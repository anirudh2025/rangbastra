import type { HeroRenderer, HeroState } from "./states";

interface SilkPortalOptions {
  root: HTMLElement;
  mount: HTMLElement;
  signal: AbortSignal;
  onStateChange(state: HeroState): void;
  onReady(): void;
  onFailure(): void;
  onIneligible(): void;
}

const TARGET_DRAG = 260;
const DPR_CAP = 1.25;

class SilkPortalMobileRenderer implements HeroRenderer {
  #options: SilkPortalOptions;
  #canvas = document.createElement("canvas");
  #context?: CanvasRenderingContext2D;
  #control?: HTMLButtonElement;
  #events = new AbortController();
  #resizeObserver?: ResizeObserver;
  #frame = 0;
  #progress = 0;
  #target = 0;
  #startY = 0;
  #startProgress = 0;
  #pulling = false;
  #completing = false;
  #paused = false;
  #disposed = false;
  #state: HeroState = "THREAD_READY";

  constructor(options: SilkPortalOptions) {
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
    const control = this.#options.root.querySelector<HTMLButtonElement>(
      "[data-hero-pull-control]",
    );
    if (!context || !control) {
      this.#options.onFailure();
      return;
    }

    this.#context = context;
    this.#control = control;
    control.disabled = false;
    control.removeAttribute("aria-hidden");
    this.#canvas.setAttribute("aria-hidden", "true");
    this.#canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    this.#options.mount.replaceChildren(this.#canvas);
    this.#options.root.dataset.heroPullReady = "true";
    this.#bindEvents();
    this.#measure();
    this.#draw();
    this.#setState("WAITING_FOR_PULL");
    this.#options.onReady();
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
    delete this.#options.root.dataset.heroPullReady;
    this.#options.root.style.removeProperty("--hero-pull-progress");
  }

  #bindEvents() {
    if (!this.#control) return;
    const signal = this.#events.signal;
    this.#control.addEventListener("pointerdown", this.#onPointerDown, {
      signal,
    });
    this.#control.addEventListener("pointermove", this.#onPointerMove, {
      signal,
    });
    this.#control.addEventListener("pointerup", this.#onPointerUp, { signal });
    this.#control.addEventListener("pointercancel", this.#onPointerUp, {
      signal,
    });
    this.#control.addEventListener("click", this.#onClick, { signal });
    window.addEventListener("orientationchange", this.#onOrientationChange, {
      signal,
    });
    this.#resizeObserver = new ResizeObserver(this.#measure);
    this.#resizeObserver.observe(this.#options.root);
  }

  #onPointerDown = (event: PointerEvent) => {
    if (this.#completing || this.#progress >= 1) return;
    event.preventDefault();
    this.#pulling = true;
    this.#startY = event.clientY;
    this.#startProgress = this.#target;
    this.#control?.setPointerCapture(event.pointerId);
    this.#setState("PULLING");
  };

  #onPointerMove = (event: PointerEvent) => {
    if (!this.#pulling) return;
    event.preventDefault();
    const distance = Math.max(0, event.clientY - this.#startY);
    this.#target = Math.min(
      1,
      this.#startProgress + distance / TARGET_DRAG,
    );
    this.#updateStateForProgress();
    this.#schedule();
  };

  #onPointerUp = (event: PointerEvent) => {
    if (!this.#pulling) return;
    this.#pulling = false;
    if (this.#control?.hasPointerCapture(event.pointerId)) {
      this.#control.releasePointerCapture(event.pointerId);
    }
    if (this.#target >= 0.22) this.#complete();
  };

  #onClick = (event: MouseEvent) => {
    if ((event as PointerEvent).detail === 0 || !this.#pulling) {
      this.#complete();
    }
  };

  #onOrientationChange = () => {
    if (!matchMedia("(orientation: portrait)").matches) {
      this.#options.onIneligible();
    }
  };

  #complete() {
    if (this.#target >= 1 || this.#completing) return;
    if (this.#state === "WAITING_FOR_PULL") {
      this.#setState("PULLING");
    }
    this.#completing = true;
    this.#target = 1;
    this.#schedule();
  }

  #schedule() {
    if (!this.#frame && !this.#paused && !this.#disposed) {
      this.#frame = requestAnimationFrame(this.#render);
    }
  }

  #render = () => {
    this.#frame = 0;
    if (this.#paused || this.#disposed) return;
    this.#progress += (this.#target - this.#progress) * 0.095;
    if (Math.abs(this.#target - this.#progress) < 0.002) {
      this.#progress = this.#target;
    }
    this.#updateStateForProgress();
    this.#draw();
    if (this.#progress !== this.#target) this.#schedule();
  };

  #updateStateForProgress() {
    if (this.#target >= 0.72 && this.#state === "WEAVE_FORM") {
      this.#setState("IDENTITY_REVEAL");
    } else if (
      this.#target >= 0.08 &&
      (this.#state === "PULLING" || this.#state === "WAITING_FOR_PULL")
    ) {
      this.#setState("WEAVE_FORM");
    }
    if (this.#progress === 1 && this.#state === "IDENTITY_REVEAL") {
      this.#setState("COMPLETE");
      this.#completing = false;
      if (this.#control) {
        this.#control.disabled = true;
        this.#control.setAttribute("aria-hidden", "true");
      }
    }
  }

  #setState(next: HeroState) {
    if (this.#state === next) return;
    this.#state = next;
    this.#options.onStateChange(next);
  }

  #measure = () => {
    const { width, height } = this.#options.root.getBoundingClientRect();
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

  #draw() {
    const context = this.#context;
    if (!context) return;
    const { width, height } = this.#options.root.getBoundingClientRect();
    const progress = this.#progress;
    context.clearRect(0, 0, width, height);

    const field = context.createRadialGradient(
      width * 0.5,
      height * 0.38,
      0,
      width * 0.5,
      height * 0.42,
      width * 0.7,
    );
    field.addColorStop(0, `rgba(72, 42, 31, ${0.2 + progress * 0.2})`);
    field.addColorStop(0.55, "rgba(20, 13, 11, .3)");
    field.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = field;
    context.fillRect(0, 0, width, height);

    const top = height * 0.08;
    const bottom = height * (0.43 + progress * 0.25);
    const center = width * 0.5;
    const strands = 18;
    context.lineCap = "round";

    for (let index = 0; index < strands; index += 1) {
      const lane = index / (strands - 1) - 0.5;
      const reveal = Math.max(0, Math.min(1, progress * 1.25 - Math.abs(lane) * 0.22));
      const skirt = lane * width * (0.08 + reveal * 0.48);
      const shoulder = lane * width * (0.05 + reveal * 0.13);
      context.beginPath();
      context.moveTo(center + lane * 5, top);
      context.bezierCurveTo(
        center + shoulder,
        height * 0.25,
        center + skirt * 0.55,
        height * 0.47,
        center + skirt,
        bottom,
      );
      context.strokeStyle =
        index % 5 === 0
          ? `rgba(170, 132, 92, ${0.11 + reveal * 0.19})`
          : `rgba(108, 73, 57, ${0.06 + reveal * 0.13})`;
      context.lineWidth = index % 5 === 0 ? 1 : 0.7;
      context.stroke();
    }

    if (progress > 0.68) this.#drawMotif(context, width, height, progress);

    const threadGradient = context.createLinearGradient(0, top, 0, bottom);
    threadGradient.addColorStop(0, "rgba(224, 199, 161, .12)");
    threadGradient.addColorStop(0.38, "rgba(213, 174, 119, .78)");
    threadGradient.addColorStop(1, "rgba(118, 79, 53, .16)");
    context.strokeStyle = threadGradient;
    context.lineWidth = 1.25;
    context.beginPath();
    context.moveTo(center, top);
    context.bezierCurveTo(
      center - 4,
      height * 0.25,
      center + 5,
      height * 0.4,
      center,
      bottom,
    );
    context.stroke();

    this.#options.root.style.setProperty(
      "--hero-pull-progress",
      progress.toFixed(4),
    );
  }

  #drawMotif(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    progress: number,
  ) {
    const alpha = Math.min(1, (progress - 0.68) / 0.32);
    context.save();
    context.translate(width * 0.5, height * 0.36);
    context.strokeStyle = `rgba(184, 141, 87, ${alpha * 0.42})`;
    context.lineWidth = 0.9;
    context.beginPath();
    context.moveTo(-3, -34);
    context.bezierCurveTo(42, -22, 34, 28, 2, 44);
    context.bezierCurveTo(-26, 57, -42, 25, -19, 7);
    context.stroke();
    context.beginPath();
    context.moveTo(-2, 44);
    context.bezierCurveTo(22, 66, 31, 91, 23, 124);
    context.stroke();
    context.fillStyle = `rgba(225, 205, 177, ${alpha * 0.62})`;
    for (const [x, y, radius] of [[24, -7, 1.8], [-25, 24, 1.4], [24, 91, 1.6]]) {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }
}

export function createSilkPortalMobile(
  options: SilkPortalOptions,
): HeroRenderer {
  return new SilkPortalMobileRenderer(options);
}
