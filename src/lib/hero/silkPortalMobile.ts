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
const EXIT_START = 0.76;
const EXIT_END = 0.98;

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
    const exit = this.#smoothRange(EXIT_START, EXIT_END, this.#scrollCurrent);
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
    const exit = this.#smoothRange(EXIT_START, EXIT_END, this.#scrollCurrent);
    const structure = this.#smoothRange(0, 0.36, construction);
    const coverage = this.#smoothRange(0.28, 0.72, construction);
    const couture = this.#smoothRange(0.58, 0.86, construction);
    const motif = this.#smoothRange(0.82, 1, construction);
    const paths = this.#buildPaths(width, height);
    const guideAlpha =
      0.62 * (1 - this.#smoothRange(0.5, 0.92, construction));

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
      "185, 143, 94",
      guideAlpha,
      1,
    );

    if (motif > 0) {
      const motifPaths = this.#buildMotif(width, height);
      const motifHead = this.#drawSequencedPaths(
        context,
        motifPaths,
        motif,
        "194, 146, 84",
        0.52,
        0.88,
      );
      if (motifHead && motif < 0.96) this.#drawNeedle(context, motifHead);
      this.#drawPearls(context, width, height, motif);
    } else if (head && structure < 0.96) {
      this.#drawNeedle(context, head);
    }

    if (exit > 0) this.#drawReleaseThreads(context, width, height, exit);
    this.#drawContentQuietZone(context, width, height);
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
      this.#cubic(
        { x: cx + 1, y: cy + 8 },
        { x: cx - 18, y: cy - 2 },
        { x: cx - 28, y: cy + 7 },
        { x: cx - 34, y: cy + 20 },
        18,
      ),
      this.#cubic(
        { x: cx - 7, y: cy + 68 },
        { x: cx + 12, y: cy + 61 },
        { x: cx + 24, y: cy + 70 },
        { x: cx + 30, y: cy + 84 },
        18,
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
    const top = height * 0.11;
    const shoulder = height * 0.225;
    const waist = height * 0.43;
    const hem = height * 0.7;
    if (coverage <= 0) return;
    const silhouette = new Path2D();
    silhouette.moveTo(cx - width * 0.05, top);
    silhouette.bezierCurveTo(
      cx - width * 0.075,
      top + height * 0.018,
      cx - width * 0.135,
      shoulder - height * 0.045,
      cx - width * 0.155,
      shoulder,
    );
    silhouette.bezierCurveTo(
      cx - width * 0.175,
      height * 0.29,
      cx - width * 0.135,
      height * 0.36,
      cx - width * 0.13,
      waist,
    );
    silhouette.bezierCurveTo(
      cx - width * 0.14,
      height * 0.485,
      cx - width * 0.285,
      height * 0.61,
      cx - width * 0.39,
      hem,
    );
    silhouette.bezierCurveTo(
      cx - width * 0.18,
      height * 0.735,
      cx + width * 0.19,
      height * 0.75,
      cx + width * 0.405,
      hem,
    );
    silhouette.bezierCurveTo(
      cx + width * 0.31,
      height * 0.6,
      cx + width * 0.16,
      height * 0.49,
      cx + width * 0.14,
      waist,
    );
    silhouette.bezierCurveTo(
      cx + width * 0.135,
      height * 0.36,
      cx + width * 0.18,
      height * 0.29,
      cx + width * 0.165,
      shoulder,
    );
    silhouette.bezierCurveTo(
      cx + width * 0.145,
      shoulder - height * 0.045,
      cx + width * 0.078,
      top + height * 0.018,
      cx + width * 0.05,
      top,
    );
    silhouette.bezierCurveTo(
      cx + width * 0.025,
      top + height * 0.014,
      cx - width * 0.024,
      top + height * 0.014,
      cx - width * 0.05,
      top,
    );
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
    textile.addColorStop(0.42, `rgba(68, 38, 29, ${0.46 + couture * 0.14})`);
    textile.addColorStop(0.62, `rgba(102, 58, 38, ${0.34 + couture * 0.14})`);
    textile.addColorStop(1, "rgba(17, 10, 8, .94)");
    context.fillStyle = textile;
    const edgeSoftness =
      height * 0.045 * (1 - this.#smoothRange(0.84, 1, coverage));
    const solidEdge = Math.max(top, revealY - edgeSoftness);
    context.fillRect(0, top, width, solidEdge - top);
    if (edgeSoftness > 0.5) {
      const growingEdge = context.createLinearGradient(
        0,
        solidEdge,
        0,
        revealY + edgeSoftness,
      );
      growingEdge.addColorStop(0, "rgba(82, 47, 33, .78)");
      growingEdge.addColorStop(0.55, "rgba(67, 38, 28, .36)");
      growingEdge.addColorStop(1, "rgba(30, 18, 14, 0)");
      context.fillStyle = growingEdge;
      context.fillRect(0, solidEdge, width, edgeSoftness * 2);
    }

    for (const [x, y, radius, alpha] of [
      [cx - width * 0.15, height * 0.3, width * 0.28, 0.08],
      [cx + width * 0.18, height * 0.48, width * 0.34, 0.07],
      [cx - width * 0.04, height * 0.62, width * 0.4, 0.055],
    ] as const) {
      const depth = context.createRadialGradient(x, y, 0, x, y, radius);
      depth.addColorStop(0, `rgba(205, 154, 105, ${alpha * couture})`);
      depth.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = depth;
      context.fillRect(0, top, width, revealY - top + height * 0.05);
    }

    this.#drawFabricFolds(
      context,
      width,
      height,
      top,
      waist,
      hem,
      revealY,
      couture,
    );

    context.strokeStyle = `rgba(224, 199, 174, ${0.008 + couture * 0.016})`;
    context.lineWidth = 0.45;
    for (let x = cx - width * 0.36; x <= cx + width * 0.39; x += 5.5) {
      context.beginPath();
      context.moveTo(x, top);
      context.bezierCurveTo(
        x + Math.sin(x * 0.08) * 1.4,
        waist,
        x + Math.sin(x * 0.05) * 2.2,
        height * 0.57,
        x,
        revealY,
      );
      context.stroke();
    }
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
      context.lineCap = "round";
      const releaseOrder = [0.2, 0.1, 0.31, 0.16, 0.38, 0.24, 0.44];
      for (let lane = -3; lane <= 3; lane += 1) {
        const threshold = releaseOrder[lane + 3]!;
        if (exit <= threshold) continue;
        const release = this.#smoothRange(threshold, threshold + 0.32, exit);
        context.globalAlpha = release * 0.86;
        const x = cx + lane * width * 0.092;
        const endY =
          hem - release * height * (0.1 + ((lane + 3) % 3) * 0.018);
        context.lineWidth =
          width * (0.006 + ((lane + 3) % 3) * 0.0035);
        context.beginPath();
        context.moveTo(x + lane * 1.4, hem + height * 0.012);
        context.bezierCurveTo(
          x - lane * 2.2,
          hem - height * 0.025,
          x + lane * 3.6,
          endY + height * 0.035,
          x - lane * 1.2,
          endY,
        );
        context.strokeStyle = "#000";
        context.stroke();
      }
    }
    context.restore();
  }

  #drawFabricFolds(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    top: number,
    waist: number,
    hem: number,
    revealY: number,
    couture: number,
  ) {
    if (couture <= 0) return;
    const cx = width * 0.5;
    context.save();
    context.globalCompositeOperation = "screen";
    context.lineCap = "round";
    context.filter = "blur(8px)";
    const folds = [
      [-0.19, -0.11, -0.24, 0.046, 0.052],
      [-0.07, -0.035, -0.08, 0.032, 0.038],
      [0.045, 0.025, 0.095, 0.038, 0.046],
      [0.17, 0.1, 0.25, 0.028, 0.034],
    ] as const;
    for (const [topOffset, waistOffset, hemOffset, intensity, widthFactor] of folds) {
      const gradient = context.createLinearGradient(
        cx + topOffset * width,
        top,
        cx + hemOffset * width,
        hem,
      );
      gradient.addColorStop(0, "rgba(112, 66, 45, 0)");
      gradient.addColorStop(
        0.42,
        `rgba(210, 147, 102, ${intensity * couture})`,
      );
      gradient.addColorStop(
        0.72,
        `rgba(164, 98, 66, ${intensity * couture * 0.75})`,
      );
      gradient.addColorStop(1, "rgba(74, 42, 31, 0)");
      context.strokeStyle = gradient;
      context.lineWidth = width * widthFactor;
      context.beginPath();
      context.moveTo(cx + topOffset * width, top + height * 0.08);
      context.bezierCurveTo(
        cx + waistOffset * width,
        waist - height * 0.06,
        cx + hemOffset * width * 0.78,
        height * 0.58,
        cx + hemOffset * width,
        Math.min(hem, revealY),
      );
      context.stroke();
    }
    context.restore();

    const edgeShade = context.createRadialGradient(
      cx,
      height * 0.43,
      width * 0.08,
      cx,
      height * 0.43,
      width * 0.46,
    );
    edgeShade.addColorStop(0, "rgba(0, 0, 0, 0)");
    edgeShade.addColorStop(0.66, "rgba(0, 0, 0, .04)");
    edgeShade.addColorStop(1, `rgba(0, 0, 0, ${0.32 * couture})`);
    context.fillStyle = edgeShade;
    context.fillRect(0, top, width, Math.max(0, revealY - top));
  }

  #drawSequencedPaths(
    context: CanvasRenderingContext2D,
    paths: StitchPath[],
    progress: number,
    rgb: string,
    baseAlpha: number,
    width: number,
  ): Point | undefined {
    if (progress <= 0 || paths.length === 0) return;
    let head: Point | undefined;
    context.lineCap = "round";
    for (let index = 0; index < paths.length; index += 1) {
      const path = paths[index]!;
      const start = index / (paths.length + 0.55);
      const finish = (index + 1.35) / (paths.length + 0.55);
      const local = this.#smoothRange(start, finish, progress);
      if (local <= 0) continue;
      const endIndex = Math.max(1, Math.floor(local * (path.length - 1)));
      for (let point = 1; point <= endIndex; point += 1) {
        const distanceFromHead = endIndex - point;
        const trail = local < 0.995
          ? 0.18 + Math.exp(-distanceFromHead / 5.5) * 0.82
          : 0.26;
        context.strokeStyle = `rgba(${rgb}, ${baseAlpha * trail})`;
        context.lineWidth =
          width * (0.76 + Math.sin((point + index * 3) * 0.42) * 0.16);
        context.beginPath();
        context.moveTo(path[point - 1]!.x, path[point - 1]!.y);
        context.lineTo(path[point]!.x, path[point]!.y);
        context.stroke();
      }
      if (local < 0.995 || index === paths.length - 1) {
        head = path[endIndex];
      }
    }
    return head;
  }

  #drawNeedle(context: CanvasRenderingContext2D, point: Point) {
    const glow = context.createRadialGradient(
      point.x,
      point.y,
      0,
      point.x,
      point.y,
      7,
    );
    glow.addColorStop(0, "rgba(238, 213, 176, .34)");
    glow.addColorStop(1, "rgba(208, 164, 108, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(point.x, point.y, 7, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(238, 215, 183, .88)";
    context.beginPath();
    context.arc(point.x, point.y, 1.55, 0, Math.PI * 2);
    context.fill();
  }

  #drawPearls(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    progress: number,
  ) {
    if (progress < 0.58) return;
    const alpha = this.#smoothRange(0.58, 0.92, progress);
    context.fillStyle = `rgba(225, 205, 178, ${alpha * 0.52})`;
    for (const [x, y, radius] of [
      [0.44, 0.375, 1.15],
      [0.565, 0.405, 1.45],
      [0.465, 0.485, 1.05],
    ] as const) {
      context.beginPath();
      context.arc(width * x, height * y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  #drawReleaseThreads(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    progress: number,
  ) {
    const cx = width * 0.5;
    const startY = height * 0.66;
    const releaseOrder = [0.06, 0.2, 0.12, 0.28, 0.16, 0.34];
    const offsets = [-0.28, -0.17, -0.06, 0.07, 0.19, 0.31];
    context.lineCap = "round";
    for (let lane = 0; lane < offsets.length; lane += 1) {
      const local = this.#smoothRange(
        releaseOrder[lane]!,
        releaseOrder[lane]! + 0.62,
        progress,
      );
      if (local <= 0) continue;
      const offset = offsets[lane]!;
      const startX = cx + offset * width;
      const endY = height * (0.69 + local * (0.25 + (lane % 2) * 0.035));
      context.strokeStyle = `rgba(167, 121, 78, ${local * (0.34 + (lane % 3) * 0.06)})`;
      context.lineWidth = 0.58 + (lane % 3) * 0.13;
      context.beginPath();
      context.moveTo(startX, startY);
      context.bezierCurveTo(
        startX + offset * width * 0.18,
        height * (0.72 + (lane % 2) * 0.025),
        cx + offset * width * 0.72,
        endY - 22,
        cx + offset * width * 0.52,
        endY,
      );
      context.stroke();
    }
  }

  #drawContentQuietZone(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) {
    const quiet = context.createLinearGradient(
      0,
      height * 0.52,
      0,
      height * 0.9,
    );
    quiet.addColorStop(0, "rgba(0, 0, 0, 0)");
    quiet.addColorStop(0.38, "rgba(0, 0, 0, .16)");
    quiet.addColorStop(0.7, "rgba(0, 0, 0, .42)");
    quiet.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = quiet;
    context.fillRect(0, height * 0.52, width, height * 0.38);
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
