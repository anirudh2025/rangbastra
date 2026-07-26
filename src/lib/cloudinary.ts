const CLOUDINARY_CLOUD_NAME = "cloutoraworld";
const CLOUDINARY_FORMAT = "webp";
const CLOUDINARY_QUALITY = 95;

export const COUTURE_ASSETS = Object.freeze({
  "gulnaar-web-01": "Gulnaar_Web_01_gasunw",
  "gulnaar-web-02": "Gulnaar_Web_02_gjfxct",
  "gulnaar-web-03": "Gulnaar_Web_03_h9rvca",
  "gulnaar-web-04": "Gulnaar_Web_04_kf5vnc",
  "gulnaar-web-05": "Gulnaar_Web_05_rrxwtl",
  "gulnaar-web-06": "Gulnaar_Web_06_we87zg",
  "elara-web-01": "Elara_Web_01_wyoibr",
  "elara-web-02": "Elara_Web_02_mcllu1",
  "elara-web-03": "Elara_Web_03_wf5v8x",
  "elara-web-04": "Elara_Web_04_cekq8k",
  "elara-web-05": "Elara_Web_05_tuxyyq",
  "elara-web-06": "Elara_Web_06_vbg9in",
  "noor-web-01": "Noor_Web_01_lzgejf",
  "noor-web-02": "Noor_Web_02_a4b0d6",
  "noor-web-03": "Noor_Web_03_odw8vy",
  "noor-web-04": "Noor_Web_04_hgfm1n",
  "noor-web-05": "Noor_Web_05_iknicz",
  "noor-web-06": "Noor_Web_06_dwqhey",
  "noor-web-07": "Noor_Web_07_yfdeai",
  "inaayat-web-01": "Inaayat_Web_01_bnyonn",
  "inaayat-web-02": "Inaayat_Web_02_ewc039",
  "inaayat-web-03": "Inaayat_Web_03_jsepzz",
  "inaayat-web-04": "Inaayat_Web_04_nwlmuc",
  "inaayat-web-05": "Inaayat_Web_05_jckrsr",
  "inaayat-web-06": "Inaayat_Web_06_tl1gir",
  "inaayat-web-07": "Inaayat_Web_07_foksqp",
  "amaira-web-01": "Amaira_Web_01",
  "amaira-web-02": "Amaira_Web_02",
  "amaira-web-03": "Amaira_Web_03",
  "amaira-web-04": "Amaira_Web_04",
  "amaira-web-05": "Amaira_Web_05",
  "amaira-web-06": "Amaira_Web_06",
  "naeyra-web-01": "Naeyra_Web_01",
  "naeyra-web-02": "Naeyra_Web_02",
  "naeyra-web-03": "Naeyra_Web_03",
  "naeyra-web-04": "Naeyra_Web_04",
  "naeyra-web-05": "Naeyra_Web_05",
  "naeyra-web-06": "Naeyra_Web_06",
  "mahira-web-01": "Mahira_Web_01",
  "mahira-web-02": "Mahira_Web_02",
  "mahira-web-03": "Mahira_Web_03",
  "mahira-web-04": "Mahira_Web_04",
  "mahira-web-05": "Mahira_Web_05",
  "mahira-web-06": "Mahira_Web_06",
  "mahira-web-07": "Mahira_Web_07",
  "ayana-web-01": "Ayana_Web_01",
  "ayana-web-02": "Ayana_Web_02",
  "ayana-web-03": "Ayana_Web_03",
  "ayana-web-04": "Ayana_Web_04",
  "ayana-web-05": "Ayana_Web_05",
  "ayana-web-06": "Ayana_Web_06",
  "ayana-web-07": "Ayana_Web_07",
} as const);

export const CLOUDINARY_RESPONSIVE_WIDTHS = Object.freeze([
  180, 520, 720, 900, 1100, 1600, 1900, 2000,
] as const);

export type CoutureAssetKey = keyof typeof COUTURE_ASSETS;
export type CloudinaryResponsiveWidth =
  (typeof CLOUDINARY_RESPONSIVE_WIDTHS)[number];

const isCoutureAssetKey = (value: string): value is CoutureAssetKey =>
  Object.hasOwn(COUTURE_ASSETS, value);

export const isCloudinaryResponsiveWidth = (
  value: number,
): value is CloudinaryResponsiveWidth =>
  CLOUDINARY_RESPONSIVE_WIDTHS.includes(
    value as CloudinaryResponsiveWidth,
  );

const resolvePublicId = (source: CoutureAssetKey | string) => {
  const publicId = isCoutureAssetKey(source)
    ? COUTURE_ASSETS[source]
    : source;

  if (!/^[A-Za-z0-9/_-]+$/.test(publicId)) {
    throw new Error("Invalid Cloudinary public ID.");
  }

  return publicId;
};

export const cloudinaryImageUrl = (
  source: CoutureAssetKey | string,
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
