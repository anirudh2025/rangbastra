import type { HeroRenderer, HeroState } from "./states";

interface CinematicHeroOptions {
  root: HTMLElement;
  mount: HTMLElement;
  signal: AbortSignal;
  portrait: boolean;
  onStateChange(state: HeroState): void;
  onReady(): void;
  onFailure(): void;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
  speed: number;
  rare: boolean;
}

const EXIT_START = 0.94;
const EXIT_END = 0.995;
const DESKTOP_PARTICLES = 360;
const MOBILE_PARTICLES = 150;

class CinematicHeroRenderer implements HeroRenderer {
  #options: CinematicHeroOptions;
  #canvas = document.createElement("canvas");
  #context?: CanvasRenderingContext2D;
  #particles: Particle[] = [];
  #resizeObserver?: ResizeObserver;
  #events = new AbortController();
  #frame = 0;
  #lastFrame = 0;
  #startTime = 0;
  #scrollTarget = 0;
  #scrollCurrent = 0;
  #pointerTarget = { x: 0, y: 0 };
  #pointerCurrent = { x: 0, y: 0 };
  #paused = false;
  #disposed = false;
  #state: HeroState;

  constructor(options: CinematicHeroOptions) {
    this.#options = options;
    this.#state = options.portrait ? "THREAD_READY" : "FALLBACK_READY";
    options.signal.addEventListener("abort", () => this.dispose(), { once: true });
  }

  mount() {
    const context = this.#canvas.getContext("2d", { alpha: true });
    if (!context) {
      this.#options.onFailure();
      return;
    }

    this.#context = context;
    this.#canvas.setAttribute("aria-hidden", "true");
    this.#canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    this.#options.mount.replaceChildren(this.#canvas);
    this.#bindEvents();
    this.#measure();
    this.#onScroll();
    this.#startTime = performance.now();
    this.#options.onReady();
    this.resume();
  }

  pause() {
    this.#paused = true;
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  resume() {
    if (this.#disposed || !this.#context) return;
    this.#paused = false;
    this.#schedule();
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    this.pause();
    this.#events.abort();
    this.#resizeObserver?.disconnect();
    this.#canvas.remove();
    this.#options.root.style.removeProperty("--hero-master-opacity");
    this.#options.root.style.removeProperty("--hero-master-brightness");
    this.#options.root.style.removeProperty("--hero-master-scale");
    this.#options.root.style.removeProperty("--hero-master-x");
    this.#options.root.style.removeProperty("--hero-master-y");
    this.#options.root.style.removeProperty("--hero-light-opacity");
    this.#options.root.style.removeProperty("--hero-construction-opacity");
    this.#options.root.style.removeProperty("--hero-stitch-opacity");
    delete this.#options.root.dataset.heroChapter;
  }

  #bindEvents() {
    const signal = this.#events.signal;
    window.addEventListener("scroll", this.#onScroll, { passive: true, signal });
    window.addEventListener(
      "pointermove",
      (event) => {
        if (this.#options.portrait) return;
        this.#pointerTarget.x = event.clientX / Math.max(1, innerWidth) - 0.5;
        this.#pointerTarget.y = event.clientY / Math.max(1, innerHeight) - 0.5;
        this.#schedule();
      },
      { passive: true, signal },
    );
    window.addEventListener("orientationchange", this.#onOrientation, { signal });
    this.#resizeObserver = new ResizeObserver(() => this.#measure());
    this.#resizeObserver.observe(this.#options.root);
  }

  #onOrientation = () => {
    const portrait = matchMedia("(orientation: portrait)").matches;
    if (portrait !== this.#options.portrait) location.reload();
  };

  #onScroll = () => {
    const rect = this.#options.root.getBoundingClientRect();
    const travel = Math.max(1, this.#options.root.offsetHeight - innerHeight);
    this.#scrollTarget = Math.max(0, Math.min(1, -rect.top / travel));
    this.#schedule();
  };

  #measure() {
    const width = Math.max(1, this.#options.mount.clientWidth);
    const height = Math.max(1, this.#options.mount.clientHeight);
    const dpr = Math.min(devicePixelRatio || 1, this.#options.portrait ? 1.25 : 1.5);
    this.#canvas.width = Math.round(width * dpr);
    this.#canvas.height = Math.round(height * dpr);
    this.#canvas.style.width = `${width}px`;
    this.#canvas.style.height = `${height}px`;
    this.#context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.#buildParticles(width, height);
    this.#schedule();
  }

  #buildParticles(width: number, height: number) {
    const count = this.#options.portrait ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
    this.#particles = Array.from({ length: count }, (_, index) => {
      const seededX = ((index * 47) % 997) / 997;
      const seededY = ((index * 83) % 991) / 991;
      const centerDistance = Math.abs(seededX - 0.5);
      const quietZone = seededY > 0.42 && seededY < 0.78;
      const sideBias = this.#options.portrait
        ? seededX < 0.5
          ? seededX * 0.9
          : 0.55 + seededX * 0.45
        : seededX < 0.5
          ? seededX * 0.82
          : 0.59 + seededX * 0.41;
      return {
        x: sideBias * width,
        y: seededY * height,
        radius: index % 29 === 0 ? 1.35 : 0.35 + ((index * 19) % 10) * 0.045,
        alpha:
          (quietZone ? 0.3 : 1) *
          (0.08 + ((index * 31) % 100) / 100 * 0.24) *
          (0.72 + centerDistance * 0.5),
        phase: (index * 2.399) % (Math.PI * 2),
        speed: 0.12 + (index % 7) * 0.018,
        rare: index % 53 === 0,
      };
    });
  }

  #schedule() {
    if (this.#paused || this.#disposed || this.#frame) return;
    this.#frame = requestAnimationFrame(this.#render);
  }

  #render = (now: number) => {
    this.#frame = 0;
    if (this.#paused || this.#disposed || !this.#context) return;

    const elapsed = (now - this.#startTime) / 1000;
    const intro = Math.min(1, elapsed / 2.4);
    this.#scrollCurrent += (this.#scrollTarget - this.#scrollCurrent) * 0.09;
    this.#pointerCurrent.x += (this.#pointerTarget.x - this.#pointerCurrent.x) * 0.045;
    this.#pointerCurrent.y += (this.#pointerTarget.y - this.#pointerCurrent.y) * 0.045;

    const progress = this.#options.portrait
      ? this.#scrollCurrent
      : Math.max(intro * 0.9, this.#scrollCurrent);
    const exit = this.#smoothRange(EXIT_START, EXIT_END, this.#scrollCurrent);
    this.#applyVisualState(progress, exit);

    if (now - this.#lastFrame >= 42) {
      this.#drawParticles(elapsed, progress, exit);
      this.#lastFrame = now;
    }

    const smoothing =
      Math.abs(this.#scrollTarget - this.#scrollCurrent) > 0.001 ||
      Math.abs(this.#pointerTarget.x - this.#pointerCurrent.x) > 0.001 ||
      Math.abs(this.#pointerTarget.y - this.#pointerCurrent.y) > 0.001;
    if (intro < 1 || smoothing || (progress > 0.48 && exit < 0.995)) {
      this.#schedule();
    }
  };

  #applyVisualState(progress: number, exit: number) {
    const root = this.#options.root;
    const textile = this.#smoothRange(0.24, 0.62, progress);
    const handwork = this.#smoothRange(0.68, 0.9, progress);
    const completion = this.#smoothRange(0.84, 1, progress);
    const opacity = (0.08 + textile * 0.92) * (1 - exit * 0.92);
    const brightness = (0.28 + textile * 0.52 + handwork * 0.2) * (1 - exit * 0.56);
    const light = (0.02 + handwork * 0.22) * (1 - exit * 0.88);
    const parallaxX = this.#options.portrait ? 0 : this.#pointerCurrent.x * 9;
    const parallaxY = this.#options.portrait
      ? (progress - 0.5) * -5
      : this.#pointerCurrent.y * 5;

    root.style.setProperty("--hero-master-opacity", opacity.toFixed(3));
    root.style.setProperty("--hero-master-brightness", brightness.toFixed(3));
    root.style.setProperty(
      "--hero-master-scale",
      (1.035 - completion * 0.025 + exit * 0.018).toFixed(4),
    );
    root.style.setProperty("--hero-master-x", `${parallaxX.toFixed(2)}px`);
    root.style.setProperty("--hero-master-y", `${parallaxY.toFixed(2)}px`);
    root.style.setProperty("--hero-light-opacity", light.toFixed(3));

    if (this.#options.portrait) {
      const stitch = 1 - this.#smoothRange(0.13, 0.3, progress);
      const construction =
        this.#smoothRange(0.1, 0.34, progress) *
        (1 - this.#smoothRange(0.76, 0.94, progress));
      root.style.setProperty("--hero-stitch-opacity", stitch.toFixed(3));
      root.style.setProperty(
        "--hero-construction-opacity",
        construction.toFixed(3),
      );
      this.#setMobileChapter(progress, exit);
    } else {
      this.#setDesktopState(progress, exit);
    }
  }

  #drawParticles(elapsed: number, progress: number, exit: number) {
    if (!this.#context) return;
    const context = this.#context;
    const width = this.#options.mount.clientWidth;
    const height = this.#options.mount.clientHeight;
    context.clearRect(0, 0, width, height);
    const visibility = this.#smoothRange(0.48, 0.9, progress) * (1 - exit * 0.95);
    if (visibility <= 0.002) return;

    context.save();
    context.globalCompositeOperation = "screen";
    for (const particle of this.#particles) {
      const pulse = Math.max(
        0,
        Math.sin(elapsed * particle.speed + particle.phase),
      ) ** 16;
      const alpha = visibility * particle.alpha * (0.44 + pulse * 1.4);
      if (alpha < 0.012) continue;
      const y = particle.y + Math.sin(elapsed * 0.08 + particle.phase) * 2.2;
      context.fillStyle = `rgba(220, 163, 83, ${alpha})`;
      context.beginPath();
      context.arc(particle.x, y, particle.radius + pulse * 0.45, 0, Math.PI * 2);
      context.fill();
      if (particle.rare && pulse > 0.72) {
        context.strokeStyle = `rgba(246, 208, 145, ${alpha * 0.62})`;
        context.lineWidth = 0.55;
        context.beginPath();
        context.moveTo(particle.x - 4.5, y);
        context.lineTo(particle.x + 4.5, y);
        context.moveTo(particle.x, y - 4.5);
        context.lineTo(particle.x, y + 4.5);
        context.stroke();
      }
    }
    context.restore();
  }

  #setDesktopState(progress: number, exit: number) {
    let next: HeroState;
    if (exit > 0.64) next = "SECTION_HANDOFF";
    else if (exit > 0.02) next = "UNRAVEL";
    else if (progress >= 0.88) next = "IDLE_BREATH";
    else if (progress >= 0.68) next = "MOTIF_EMERGE";
    else if (progress >= 0.3) next = "WEAVE_FORM";
    else next = "THREADS_ENTER";
    this.#transition(next);
  }

  #setMobileChapter(progress: number, exit: number) {
    let chapter = "A_SINGLE_STITCH";
    let next: HeroState = "THREADS_ENTER";
    if (progress >= 0.12) {
      chapter = "STRUCTURE_FORMED";
      next = "WEAVE_FORM";
    }
    if (progress >= 0.27) chapter = "THREADS_CONNECT";
    if (progress >= 0.42) {
      chapter = "TEXTILE_TAKES_SHAPE";
      next = "COUTURE_FORM";
    }
    if (progress >= 0.58) chapter = "COUTURE_EMERGES";
    if (progress >= 0.72) {
      chapter = "HANDWORK_BEGINS";
      next = "MOTIF_EMERGE";
    }
    if (progress >= 0.88) {
      chapter = "COMPLETE";
      next = "IDLE_BREATH";
    }
    if (exit > 0.02) next = exit > 0.64 ? "SECTION_HANDOFF" : "UNRAVEL";
    this.#options.root.dataset.heroChapter = chapter;
    this.#transition(next);
  }

  #transition(next: HeroState) {
    if (next === this.#state) return;
    this.#state = next;
    this.#options.onStateChange(next);
  }

  #smoothRange(start: number, end: number, value: number) {
    const normalized = Math.max(
      0,
      Math.min(1, (value - start) / Math.max(0.0001, end - start)),
    );
    return normalized * normalized * (3 - 2 * normalized);
  }
}

export function createCinematicHero(
  options: CinematicHeroOptions,
): HeroRenderer {
  return new CinematicHeroRenderer(options);
}
