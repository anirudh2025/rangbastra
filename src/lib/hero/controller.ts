import { detectHeroCapabilities } from "./capabilities";
import type { HeroCapabilities } from "./capabilities";
import { canTransitionHeroState } from "./states";
import type { HeroRenderer, HeroState } from "./states";

const HERO_SELECTOR = "[data-hero-root]";
const POINTER_OWNER = "living-loom";

class HeroController {
  readonly root: HTMLElement;
  readonly capabilities: HeroCapabilities;
  readonly signal: AbortSignal;

  #abortController = new AbortController();
  #observer?: IntersectionObserver;
  #renderer?: HeroRenderer;
  #state: HeroState = "BOOT";
  #visible = true;

  constructor(root: HTMLElement) {
    this.root = root;
    this.signal = this.#abortController.signal;
    this.capabilities = detectHeroCapabilities();
  }

  async mount() {
    const mode =
      this.capabilities.mode === "silk-portal" ? "mobile" : "desktop";
    this.#state = mode === "mobile" ? "THREAD_READY" : "FALLBACK_READY";
    this.root.dataset.heroReady = "true";
    this.root.dataset.heroTier = this.capabilities.tier;
    this.root.dataset.heroMode = this.capabilities.mode;
    this.root.dataset.heroState =
      this.capabilities.tier === "D" ? "STATIC" : this.#state;
    this.root.dataset.heroStateFamily = mode;

    this.#observer = new IntersectionObserver(
      ([entry]) => {
        this.#visible = entry?.isIntersecting ?? true;
        this.root.toggleAttribute("data-hero-visible", this.#visible);
        if (this.#visible && !document.hidden) this.#renderer?.resume();
        else this.#renderer?.pause();
      },
      { threshold: 0.01 },
    );
    this.#observer.observe(this.root);

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) this.#renderer?.pause();
        else if (this.#visible) this.#renderer?.resume();
      },
      { signal: this.signal },
    );

    matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
      "change",
      (event) => {
        if (!event.matches) return;
        this.#state = "STATIC";
        this.root.dataset.heroState = this.#state;
        this.#renderer?.dispose();
        this.#renderer = undefined;
        this.releasePointerOwnership();
      },
      { signal: this.signal },
    );

    if (
      this.capabilities.mode !== "living-loom" ||
      (this.capabilities.tier !== "A" && this.capabilities.tier !== "B")
    ) {
      return;
    }

    try {
      const { createLivingLoomDesktop } = await import("./livingLoomDesktop");
      if (this.signal.aborted) return;

      const renderer = createLivingLoomDesktop({
        root: this.root,
        mount: this.root.querySelector<HTMLElement>(
          "[data-hero-enhancement]",
        )!,
        tier: this.capabilities.tier,
        signal: this.signal,
        onStateChange: (state) => this.#setState(state),
        onReady: () => {
          this.root.dataset.heroEnhancedReady = "true";
        },
        onPointerOwnershipChange: (owned) => {
          if (owned) this.claimPointerOwnership();
          else this.releasePointerOwnership();
        },
        onFailure: () => this.#fail(),
        onIneligible: () => this.#returnToFallback(),
      });

      this.attachRenderer(renderer);
      await renderer.mount();
    } catch {
      this.#fail();
    }
  }

  attachRenderer(renderer: HeroRenderer) {
    this.#renderer?.dispose();
    this.#renderer = renderer;
  }

  claimPointerOwnership() {
    document.documentElement.dataset.heroPointerOwner = POINTER_OWNER;
  }

  releasePointerOwnership() {
    if (document.documentElement.dataset.heroPointerOwner === POINTER_OWNER) {
      delete document.documentElement.dataset.heroPointerOwner;
    }
  }

  #setState(next: HeroState) {
    if (
      !canTransitionHeroState("desktop", this.#state, next) &&
      next !== "FAILED"
    ) {
      return;
    }
    this.#state = next;
    this.root.dataset.heroState = next;
  }

  #returnToFallback() {
    this.#renderer?.dispose();
    this.#renderer = undefined;
    this.releasePointerOwnership();
    delete this.root.dataset.heroEnhancedReady;
    this.root.dataset.heroMode = "static";
    this.#state = "STATIC";
    this.root.dataset.heroState = this.#state;
  }

  #fail() {
    this.#renderer?.dispose();
    this.#renderer = undefined;
    this.releasePointerOwnership();
    delete this.root.dataset.heroEnhancedReady;
    this.root.dataset.heroMode = "static";
    this.#state = "FAILED";
    this.root.dataset.heroState = this.#state;
  }

  dispose() {
    this.#abortController.abort();
    this.#observer?.disconnect();
    this.#renderer?.dispose();
    this.releasePointerOwnership();
    delete this.root.dataset.heroReady;
  }
}

let activeController: HeroController | undefined;

export function initHeroController() {
  const root = document.querySelector<HTMLElement>(HERO_SELECTOR);

  if (!root) {
    activeController?.dispose();
    activeController = undefined;
    return;
  }

  if (activeController?.root === root) return;
  activeController?.dispose();
  activeController = new HeroController(root);
  void activeController.mount();
}

export function disposeHeroController() {
  activeController?.dispose();
  activeController = undefined;
}
