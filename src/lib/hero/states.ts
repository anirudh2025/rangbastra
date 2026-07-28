export type DesktopHeroState =
  | "BOOT"
  | "FALLBACK_READY"
  | "THREADS_ENTER"
  | "WEAVE_FORM"
  | "MOTIF_EMERGE"
  | "COUTURE_FORM"
  | "IDLE_BREATH"
  | "UNRAVEL"
  | "SECTION_HANDOFF"
  | "COMPLETE"
  | "STATIC"
  | "FAILED";

export type MobileHeroState =
  | "BOOT"
  | "THREAD_READY"
  | "WAITING_FOR_PULL"
  | "PULLING"
  | "WEAVE_FORM"
  | "IDENTITY_REVEAL"
  | "COMPLETE"
  | "STATIC"
  | "FAILED";

export type HeroState = DesktopHeroState | MobileHeroState;

export interface HeroRenderer {
  mount(): void | Promise<void>;
  pause(): void;
  resume(): void;
  dispose(): void;
}

const desktopTransitions: Record<
  DesktopHeroState,
  readonly DesktopHeroState[]
> = {
  BOOT: ["FALLBACK_READY", "STATIC", "FAILED"],
  FALLBACK_READY: ["THREADS_ENTER", "WEAVE_FORM", "STATIC", "FAILED"],
  THREADS_ENTER: ["WEAVE_FORM", "STATIC", "FAILED"],
  WEAVE_FORM: ["MOTIF_EMERGE", "COUTURE_FORM", "STATIC", "FAILED"],
  MOTIF_EMERGE: ["IDLE_BREATH", "STATIC", "FAILED"],
  COUTURE_FORM: ["MOTIF_EMERGE", "IDLE_BREATH", "STATIC", "FAILED"],
  IDLE_BREATH: ["UNRAVEL", "STATIC", "FAILED"],
  UNRAVEL: ["SECTION_HANDOFF", "STATIC", "FAILED"],
  SECTION_HANDOFF: ["COMPLETE", "STATIC", "FAILED"],
  COMPLETE: ["STATIC"],
  STATIC: [],
  FAILED: ["STATIC"],
};

const mobileTransitions: Record<MobileHeroState, readonly MobileHeroState[]> = {
  BOOT: ["THREAD_READY", "STATIC", "FAILED"],
  THREAD_READY: ["WAITING_FOR_PULL", "STATIC", "FAILED"],
  WAITING_FOR_PULL: ["PULLING", "STATIC", "FAILED"],
  PULLING: ["WEAVE_FORM", "STATIC", "FAILED"],
  WEAVE_FORM: ["IDENTITY_REVEAL", "STATIC", "FAILED"],
  IDENTITY_REVEAL: ["COMPLETE", "STATIC", "FAILED"],
  COMPLETE: ["STATIC"],
  STATIC: [],
  FAILED: ["STATIC"],
};

export function canTransitionHeroState(
  mode: "desktop" | "mobile",
  current: HeroState,
  next: HeroState,
): boolean {
  const transitions =
    mode === "desktop" ? desktopTransitions : mobileTransitions;
  return (
    (transitions as Record<string, readonly string[]>)[current]?.includes(
      next,
    ) ?? false
  );
}
