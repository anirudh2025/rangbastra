export type HeroExperienceTier = "A" | "B" | "C" | "D";

export interface HeroCapabilitySnapshot {
  reducedMotion: boolean;
  coarsePointer: boolean;
  finePointer: boolean;
  hover: boolean;
  portrait: boolean;
  webgl2: boolean;
  saveData: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export interface HeroCapabilities extends HeroCapabilitySnapshot {
  tier: HeroExperienceTier;
  mode: "living-loom" | "silk-portal" | "static";
}

interface NavigatorHints extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

export function classifyHeroCapabilities(
  snapshot: HeroCapabilitySnapshot,
): Pick<HeroCapabilities, "tier" | "mode"> {
  if (snapshot.reducedMotion || snapshot.saveData) {
    return { tier: "D", mode: "static" };
  }

  if (snapshot.portrait) {
    return { tier: "C", mode: "silk-portal" };
  }

  if (!snapshot.webgl2) {
    return { tier: "D", mode: "static" };
  }

  const constrainedMemory =
    snapshot.deviceMemory !== undefined && snapshot.deviceMemory < 4;
  const constrainedCpu =
    snapshot.hardwareConcurrency !== undefined &&
    snapshot.hardwareConcurrency < 4;

  if (
    snapshot.finePointer &&
    snapshot.hover &&
    !constrainedMemory &&
    !constrainedCpu
  ) {
    return { tier: "A", mode: "living-loom" };
  }

  return { tier: "B", mode: "living-loom" };
}

export function detectHeroCapabilities(): HeroCapabilities {
  const nav = navigator as NavigatorHints;
  const portrait = matchMedia("(orientation: portrait)").matches;
  const snapshot: HeroCapabilitySnapshot = {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarsePointer: matchMedia("(pointer: coarse)").matches,
    finePointer: matchMedia("(pointer: fine)").matches,
    hover: matchMedia("(hover: hover)").matches,
    portrait,
    webgl2: supportsWebGL2(),
    saveData: nav.connection?.saveData === true,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
  };

  return { ...snapshot, ...classifyHeroCapabilities(snapshot) };
}

function supportsWebGL2(): boolean {
  return typeof WebGL2RenderingContext !== "undefined";
}
