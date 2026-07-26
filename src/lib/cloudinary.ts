const CLOUDINARY_CLOUD_NAME = "cloutoraworld";
const CLOUDINARY_FORMAT = "webp";
const CLOUDINARY_QUALITY = 95;

export const GULNAAR_ASSETS = Object.freeze({
  "gulnaar-web-01": "Gulnaar_Web_01_gasunw",
  "gulnaar-web-02": "Gulnaar_Web_02_gjfxct",
  "gulnaar-web-03": "Gulnaar_Web_03_h9rvca",
  "gulnaar-web-04": "Gulnaar_Web_04_kf5vnc",
  "gulnaar-web-05": "Gulnaar_Web_05_rrxwtl",
  "gulnaar-web-06": "Gulnaar_Web_06_we87zg",
} as const);

export const CLOUDINARY_RESPONSIVE_WIDTHS = Object.freeze([
  180, 520, 720, 900, 1100, 1600, 1900, 2000,
] as const);

export type GulnaarAssetKey = keyof typeof GULNAAR_ASSETS;
export type CloudinaryResponsiveWidth =
  (typeof CLOUDINARY_RESPONSIVE_WIDTHS)[number];

const isGulnaarAssetKey = (value: string): value is GulnaarAssetKey =>
  Object.hasOwn(GULNAAR_ASSETS, value);

export const isCloudinaryResponsiveWidth = (
  value: number,
): value is CloudinaryResponsiveWidth =>
  CLOUDINARY_RESPONSIVE_WIDTHS.includes(
    value as CloudinaryResponsiveWidth,
  );

const resolvePublicId = (source: GulnaarAssetKey | string) => {
  const publicId = isGulnaarAssetKey(source)
    ? GULNAAR_ASSETS[source]
    : source;

  if (!/^[A-Za-z0-9/_-]+$/.test(publicId)) {
    throw new Error("Invalid Cloudinary public ID.");
  }

  return publicId;
};

export const cloudinaryImageUrl = (
  source: GulnaarAssetKey | string,
  width?: CloudinaryResponsiveWidth,
) => {
  if (
    width !== undefined &&
    !isCloudinaryResponsiveWidth(width)
  ) {
    throw new Error("Unsupported Cloudinary responsive width.");
  }

  const publicId = resolvePublicId(source);
  const transformations = [
    `f_${CLOUDINARY_FORMAT}`,
    `q_${CLOUDINARY_QUALITY}`,
    ...(width === undefined ? [] : [`c_limit`, `w_${width}`]),
  ].join(",");

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}.${CLOUDINARY_FORMAT}`;
};
