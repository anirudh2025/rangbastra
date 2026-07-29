import type { HeroRenderer, HeroState } from "./states";

interface LivingStitchOptions {
  root: HTMLElement;
  mount: HTMLElement;
  signal: AbortSignal;
  onStateChange(state: HeroState): void;
  onReady(): void;
  onFailure(): void;
  onIneligible(): void;
}

interface Point {
  x: number;
  y: number;
}

type StitchPath = Point[];

const DPR_CAP = 1.25;
const INTRO_DURATION = 1700;

class LivingStitchMobileRenderer implements HeroRenderer {
  #options: LivingStitchOptions;
  #canvas = document.createElement("canvas");
  #context?: CanvasRenderingContext2D;
  #events = new AbortController();
  #resizeObserver?: ResizeObserver;
  #frame = 0;
  #startTime = 0;
  #scrollTarget = 0;
  #scrollCurrent = 0;
  #constructionCurrent = 0;
  #paused = false;
  #disposed = false;
  #ready = false;
  #state: HeroState = "THREAD_READY";

  constructor(options: LivingStitchOptions) {
    this.#options = options;
    options.signal.addEventListener("abort", () => this.dispose(), {
      once: true,
    });
  }

  mount() {
    if (this.#disposed || this.#options.signal.aborted) return;
    if (!matchMedia("(orientation: portrait)").matches) {
      this.#options.onIneligible();
      return;
    }
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
    this.#startTime = performance.now();
    this.#onScroll();
    this.resume();
  }

  pause() {
    this.#paused = true;
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  resume() {
    if (this.#disposed) return;
    this.#paused = false;
    this.#schedule();
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    cancelAnimationFrame(this.#frame);
    this.#events.abort();
    this.#resizeObserver?.disconnect();
    this.#canvas.remove();
    this.#options.root.style.removeProperty("--hero-unravel");
    this.#options.root.style.removeProperty("--hero-scene-progress");
  }

  #bindEvents() {
    const signal = this.#events.signal;
    window.addEventListener("scroll", this.#onScroll, {
      passive: true,
      signal,
    });
    window.addEventListener("orientationchange", this.#onOrientationChange, {
      signal,
    });
    this.#resizeObserver = new ResizeObserver(this.#measure);
    this.#resizeObserver.observe(this.#options.root);
  }

  #onScroll = () => {
    const rect = this.#options.root.getBoundingClientRect();
    const distance = Math.max(1, rect.height - innerHeight);
    this.#scrollTarget = this.#clamp(-rect.top / distance);
    this.#options.root.style.setProperty(
      "--hero-scene-progress",
      this.#scrollTarget.toFixed(4),
    );
    this.#schedule();
  };

  #onOrientationChange = () => {
    if (!matchMedia("(orientation: portrait)").matches) {
      this.#options.onIneligible();
    }
  };

  #measure = () => {
    const stage =
      this.#options.root.querySelector<HTMLElement>("[data-hero-stage]");
    const { width, height } =
      stage?.getBoundingClientRect() ??
      this.#options.root.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    if (width >= height) {
      this.#options.onIneligible();
      return;
    }
    const dpr = Math.min(devicePixelRatio || 1, DPR_CAP);
    this.#canvas.width = Math.round(width * dpr);
    this.#canvas.height = Math.round(height * dpr);
    this.#canvas.style.width = `${width}px`;
    this.#canvas.style.height = `${height}px`;
    this.#context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.#draw();
  };

  #schedule() {
    if (!this.#frame && !this.#paused && !this.#disposed) {
      this.#frame = requestAnimationFrame(this.#render);
    }
  }

  #render = (now: number) => {
    this.#frame = 0;
    if (this.#paused || this.#disposed) return;
    this.#scrollCurrent +=
      (this.#scrollTarget - this.#scrollCurrent) * 0.11;
    const intro = Math.min(0.13, ((now - this.#startTime) / INTRO_DURATION) * 0.13);
    const scrollConstruction = this.#smoothRange(
      0,
      0.68,
      this.#scrollCurrent,
    );
    const target = Math.max(intro, scrollConstruction);
    this.#constructionCurrent +=
      (target - this.#constructionCurrent) * 0.1;
    const exit = this.#smoothRange(0.7, 0.98, this.#scrollCurrent);
    this.#draw();
    this.#updateState(exit);

    if (
      !this.#ready &&
      this.#constructionCurrent >= 0.025
    ) {
      this.#ready = true;
      this.#options.onReady();
    }

    const introRunning = now - this.#startTime < INTRO_DURATION;
    const smoothing =
      Math.abs(this.#scrollTarget - this.#scrollCurrent) > 0.001 ||
      Math.abs(target - this.#constructionCurrent) > 0.001;
    if (introRunning || smoothing) this.#schedule();
  };

  #draw() {
    const context = this.#context;
    if (!context) return;
    const stage =
      this.#options.root.querySelector<HTMLElement>("[data-hero-stage]");
    const { width, height } =
      stage?.getBoundingClientRect() ??
      this.#options.root.getBoundingClientRect();
    context.clearRect(0, 0, width, height);

    const construction = this.#constructionCurrent;
    const exit = this.#smoothRange(0.7, 0.98, this.#scrollCurrent);
    const structure = this.#smoothRange(0, 0.36, construction);
    const coverage = this.#smoothRange(0.28, 0.72, construction);
    const couture = this.#smoothRange(0.58, 0.86, construction);
    const motif = this.#smoothRange(0.82, 1, construction);
    const paths = this.#buildPaths(width, height);
    const guideAlpha =
      0.62 - this.#smoothRange(0.5, 0.92, construction) * 0.55;

    const atmosphere = context.createRadialGradient(
      width * 0.5,
      height * 0.39,
      0,
      width * 0.5,
      height * 0.42,
      width * 0.68,
    );
    atmosphere.addColorStop(0, "rgba(63, 37, 27, .25)");
    atmosphere.addColorStop(0.58, "rgba(18, 11, 9, .18)");
    atmosphere.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = atmosphere;
    context.fillRect(0, 0, width, height);

    this.#drawTextile(context, width, height, coverage, couture, exit);
    const head = this.#drawSequencedPaths(
      context,
      paths,
      structure,
      `rgba(185, 143, 94, ${guideAlpha})`,
      1,
    );

    if (motif > 0) {
      const motifPaths = this.#buildMotif(width, height);
      const motifHead = this.#drawSequencedPaths(
        context,
        motifPaths,
        motif,
        "rgba(194, 146, 84, .72)",
        1.1,
      );
      if (motifHead) this.#drawNeedle(context, motifHead);
    } else if (head) {
      this.#drawNeedle(context, head);
    }

    if (exit > 0) this.#drawReleaseThreads(context, width, height, exit);
    this.#options.root.style.setProperty("--hero-unravel", exit.toFixed(4));
  }

  #buildPaths(width: number, height: number): StitchPath[] {
    const cx = width * 0.5;
    const top = height * 0.1;
    const shoulderY = height * 0.25;
    const waistY = height * 0.43;
    const hemY = height * 0.7;
    return [
      this.#cubic(
        { x: cx, y: top },
        { x: cx - 3, y: shoulderY },
        { x: cx + 5, y: waistY },
        { x: cx, y: hemY },
      ),
      this.#cubic(
        { x: cx - width * 0.045, y: top + 14 },
        { x: cx - width * 0.17, y: shoulderY },
        { x: cx - width * 0.13, y: waistY },
        { x: cx - width * 0.36, y: hemY },
      ),
      this.#cubic(
        { x: cx + width * 0.045, y: top + 14 },
        { x: cx + width * 0.17, y: shoulderY },
        { x: cx + width * 0.14, y: waistY },
        { x: cx + width * 0.39, y: hemY },
      ),
      this.#cubic(
        { x: cx - width * 0.13, y: waistY },
        { x: cx - width * 0.05, y: waistY - 7 },
        { x: cx + width * 0.06, y: waistY - 7 },
        { x: cx + width * 0.14, y: waistY },
      ),
      this.#cubic(
        { x: cx - width * 0.25, y: height * 0.56 },
        { x: cx - width * 0.06, y: height * 0.52 },
        { x: cx + width * 0.12, y: height * 0.58 },
        { x: cx + width * 0.32, y: height * 0.66 },
      ),
    ];
  }

  #buildMotif(width: number, height: number): StitchPath[] {
    const cx = width * 0.5;
    const cy = height * 0.38;
    return [
      this.#cubic(
        { x: cx - 4, y: cy - 30 },
        { x: cx + 35, y: cy - 24 },
        { x: cx + 34, y: cy + 20 },
        { x: cx + 3, y: cy + 34 },
      ),
      this.#cubic(
        { x: cx + 3, y: cy + 34 },
        { x: cx - 25, y: cy + 48 },
        { x: cx - 25, y: cy + 78 },
        { x: cx + 13, y: cy + 102 },
      ),
    ];
  }

  #drawTextile(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    coverage: number,
    couture: number,
    exit: number,
  ) {
    const cx = width * 0.5;
    const top = height * 0.115;
    const shoulder = height * 0.25;
    const waist = height * 0.43;
    const hem = height * 0.7;
    if (coverage <= 0) return;
    const silhouette = new Path2D();
    silhouette.moveTo(cx - width * 0.045, top);
    silhouette.quadraticCurveTo(
      cx - width * 0.15,
      shoulder - height * 0.035,
      cx - width * 0.17,
      shoulder,
    );
    silhouette.bezierCurveTo(
      cx - width * 0.14,
      height * 0.32,
      cx - width * 0.15,
      height * 0.38,
      cx - width * 0.13,
      waist,
    );
    silhouette.bezierCurveTo(
      cx - width * 0.18,
      height * 0.51,
      cx - width * 0.31,
      height * 0.62,
      cx - width * 0.38,
      hem,
    );
    silhouette.quadraticCurveTo(
      cx + width * 0.03,
      height * 0.745,
      cx + width * 0.4,
      hem,
    );
    silhouette.bezierCurveTo(
      cx + width * 0.32,
      height * 0.61,
      cx + width * 0.19,
      height * 0.5,
      cx + width * 0.14,
      waist,
    );
    silhouette.bezierCurveTo(
      cx + width * 0.15,
      height * 0.37,
      cx + width * 0.14,
      height * 0.31,
      cx + width * 0.17,
      shoulder,
    );
    silhouette.quadraticCurveTo(
      cx + width * 0.15,
      shoulder - height * 0.035,
      cx + width * 0.045,
      top,
    );
    silhouette.quadraticCurveTo(cx, top + 12, cx - width * 0.045, top);
    silhouette.closePath();

    context.save();
    context.clip(silhouette);
    const revealY = top + (hem - top) * coverage;
    const textile = context.createLinearGradient(
      cx - width * 0.32,
      top,
      cx + width * 0.34,
      revealY,
    );
    textile.addColorStop(0, "rgba(22, 13, 11, .94)");
    textile.addColorStop(0.42, `rgba(96, 54, 37, ${0.48 + couture * 0.18})`);
    textile.addColorStop(0.62, `rgba(132, 78, 50, ${0.4 + couture * 0.17})`);
    textile.addColorStop(1, "rgba(17, 10, 8, .94)");
    context.fillStyle = textile;
    context.fillRect(0, top, width, revealY - top);
    context.strokeStyle = `rgba(222, 198, 174, ${0.012 + couture * 0.018})`;
    context.lineWidth = 0.5;
    for (let y = top; y <= revealY; y += 6) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    if (couture > 0) {
      context.strokeStyle = `rgba(215, 184, 151, ${couture * 0.052})`;
      for (let lane = -2; lane <= 2; lane += 1) {
        context.beginPath();
        context.moveTo(cx + lane * width * 0.035, waist);
        context.bezierCurveTo(
          cx + lane * width * 0.045,
          height * 0.52,
          cx + lane * width * 0.095,
          height * 0.62,
          cx + lane * width * 0.13,
          hem,
        );
        context.stroke();
      }
    }
    if (exit > 0.08) {
      context.globalCompositeOperation = "destination-out";
      for (let lane = -3; lane <= 3; lane += 1) {
        const threshold = 0.12 + (lane + 3) * 0.075;
        if (exit <= threshold) continue;
        context.globalAlpha = this.#smoothRange(threshold, threshold + 0.22, exit);
        context.fillRect(
          cx + lane * width * 0.095 - width * 0.025,
          height * 0.58,
          width * 0.05,
          height * 0.18,
        );
      }
    }
    context.restore();
  }

  #drawSequencedPaths(
    context: CanvasRenderingContext2D,
    paths: StitchPath[],
    progress: number,
    color: string,
    width: number,
  ): Point | undefined {
    if (progress <= 0 || paths.length === 0) return;
    const scaled = Math.min(0.9999, progress) * paths.length;
    const activePath = Math.min(paths.length - 1, Math.floor(scaled));
    let head: Point | undefined;
    context.strokeStyle = color;
    context.lineWidth = width;
    context.lineCap = "round";
    for (let index = 0; index <= activePath; index += 1) {
      const path = paths[index]!;
      const local = index < activePath ? 1 : scaled - activePath;
      const end = Math.max(1, Math.floor(local * (path.length - 1)));
      context.beginPath();
      context.moveTo(path[0]!.x, path[0]!.y);
      for (let point = 1; point <= end; point += 1) {
        context.lineTo(path[point]!.x, path[point]!.y);
      }
      context.stroke();
      if (index === activePath) head = path[end];
    }
    return head;
  }

  #drawNeedle(context: CanvasRenderingContext2D, point: Point) {
    context.fillStyle = "rgba(231, 205, 169, .9)";
    context.beginPath();
    context.arc(point.x, point.y, 2.1, 0, Math.PI * 2);
    context.fill();
  }

  #drawReleaseThreads(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    progress: number,
  ) {
    const cx = width * 0.5;
    const startY = height * 0.66;
    const endY = height * (0.7 + progress * 0.32);
    context.strokeStyle = `rgba(167, 121, 78, ${progress * 0.62})`;
    context.lineWidth = 0.85;
    for (let lane = -2; lane <= 2; lane += 1) {
      const startX = cx + lane * width * 0.12;
      context.beginPath();
      context.moveTo(startX, startY);
      context.bezierCurveTo(
        startX + lane * 5,
        height * 0.76,
        cx + lane * width * 0.075,
        endY - 22,
        cx + lane * width * 0.055,
        endY,
      );
      context.stroke();
    }
  }

  #updateState(exit: number) {
    const c = this.#constructionCurrent;
    let next: HeroState | undefined;
    if (this.#state === "THREAD_READY" && c > 0.01) next = "THREADS_ENTER";
    else if (this.#state === "THREADS_ENTER" && c >= 0.28) next = "WEAVE_FORM";
    else if (this.#state === "WEAVE_FORM" && c >= 0.58) next = "COUTURE_FORM";
    else if (this.#state === "COUTURE_FORM" && c >= 0.82) next = "MOTIF_EMERGE";
    else if (this.#state === "MOTIF_EMERGE" && c >= 0.995) next = "IDLE_BREATH";
    else if (this.#state === "IDLE_BREATH" && exit > 0.02) next = "UNRAVEL";
    else if (this.#state === "UNRAVEL" && exit >= 0.52) next = "SECTION_HANDOFF";
    else if (this.#state === "SECTION_HANDOFF" && exit >= 0.96) next = "COMPLETE";
    if (next) {
      this.#state = next;
      this.#options.onStateChange(next);
      this.#schedule();
    }
  }

  #cubic(
    start: Point,
    controlA: Point,
    controlB: Point,
    end: Point,
    samples = 30,
  ): StitchPath {
    const points: Point[] = [];
    for (let index = 0; index <= samples; index += 1) {
      const t = index / samples;
      const inverse = 1 - t;
      points.push({
        x:
          inverse ** 3 * start.x +
          3 * inverse ** 2 * t * controlA.x +
          3 * inverse * t ** 2 * controlB.x +
          t ** 3 * end.x,
        y:
          inverse ** 3 * start.y +
          3 * inverse ** 2 * t * controlA.y +
          3 * inverse * t ** 2 * controlB.y +
          t ** 3 * end.y,
      });
    }
    return points;
  }

  #smoothRange(start: number, end: number, value: number) {
    const normalized = this.#clamp(
      (value - start) / Math.max(0.0001, end - start),
    );
    return normalized * normalized * (3 - 2 * normalized);
  }

  #clamp(value: number) {
    return Math.max(0, Math.min(1, value));
  }
}

export function createSilkPortalMobile(
  options: LivingStitchOptions,
): HeroRenderer {
  return new LivingStitchMobileRenderer(options);
}
