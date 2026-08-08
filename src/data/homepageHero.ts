import { getEditorialAsset } from "./editorialAssets.js";
import { cloudinaryImageUrl } from "../lib/cloudinary";

/**
 * Keeps the previous procedural hero available for an intentional rollback,
 * without allowing it to be included in the public homepage by default.
 */
export const SHOW_LEGACY_GENERATED_HERO = false;

/**
 * These keys are deliberately independent of the current Editorial Sync
 * manifest. A hero is activated only after its approved asset has been added
 * to that central registry and synced to its stable Cloudinary destination.
 */
export const HOMEPAGE_HERO_ASSET_KEYS = Object.freeze([
  "homepage-hero-primary",
  "homepage-hero-secondary",
  "homepage-hero-tertiary",
]);

const responsiveWidths = Object.freeze([720, 1100, 1600, 1900] as const);

export type HomepageHeroMedia = Readonly<{
  key: string;
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
}>;

const resolveHeroMedia = (key: string): HomepageHeroMedia | null => {
  try {
    const asset = getEditorialAsset(key);
    const dimensions = asset.expectedDimensions;

    if (
      !asset.enabled ||
      !asset.publicId ||
      !dimensions ||
      !Number.isFinite(dimensions.width) ||
      !Number.isFinite(dimensions.height)
    ) {
      return null;
    }

    return Object.freeze({
      key: asset.key,
      src: cloudinaryImageUrl(asset.publicId, 1900),
      srcset: responsiveWidths
        .map((width) => `${cloudinaryImageUrl(asset.publicId, width)} ${width}w`)
        .join(", "),
      width: dimensions.width,
      height: dimensions.height,
      alt: "Rangbastra couture editorial campaign",
    });
  } catch {
    // A future key is intentionally unavailable until it is an approved,
    // centralized Editorial Sync asset. Never create a guessed delivery URL.
    return null;
  }
};

export const getHomepageHeroMedia = () =>
  Object.freeze(
    HOMEPAGE_HERO_ASSET_KEYS.map(resolveHeroMedia).filter(
      (asset): asset is HomepageHeroMedia => asset !== null,
    ),
  );
