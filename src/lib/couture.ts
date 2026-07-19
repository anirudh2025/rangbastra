import {
  couturePieces,
  type CoutureImage,
  type CouturePiece,
} from "../data/couture";

const productViewLabels = [
  "primary view",
  "front view",
  "side view",
  "back view",
  "embroidery detail",
  "drape detail",
  "editorial view",
] as const;
const productViewIds: CoutureImage["id"][] = [
  "hero",
  "front",
  "side",
  "back",
  "detail",
  "drape",
  "editorial",
];

export const getProductImages = (product: {
  name: string;
  images?: CoutureImage[];
  image?: string;
  featuredImage?: string;
}): CoutureImage[] => {
  const validImages = product.images?.filter((image): image is CoutureImage =>
    Boolean(image && typeof image.src === "string" && image.src.trim()),
  );

  if (validImages?.length) {
    return validImages.map((image, index) => ({
      ...image,
      id: image.id ?? productViewIds[index % productViewIds.length],
      role:
        image.role?.trim() ||
        productViewLabels[index % productViewLabels.length],
      src: image.src.trim(),
      alt:
        image.alt?.trim() ||
        `${product.name} - ${productViewLabels[index % productViewLabels.length]}`,
    }));
  }

  const fallback = product.image || product.featuredImage || "";
  return productViewLabels.map((view) => ({
    id: productViewIds[productViewLabels.indexOf(view)],
    role: view.replace(/^./, (letter) => letter.toUpperCase()),
    src: fallback,
    alt: `${product.name} - ${view}`,
  }));
};

export const getCloudinaryImageUrl = (src: string, width: number) => {
  if (!src.includes("res.cloudinary.com") || !src.includes("/image/upload/")) {
    return src;
  }

  return src.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto:good,c_limit,w_${width}/`,
  );
};

export const getProductCoverImage = (product: Parameters<typeof getProductImages>[0]) => {
  const images = getProductImages(product);
  return images.find((image) => image.id === "hero") ?? images[0];
};

export const isConfirmedFourByFive = (image: CoutureImage) =>
  image.width === 2160 && image.height === 2700 && image.aspectRatio === "4 / 5";


export const getPublishedCouturePieces = () =>
  couturePieces.filter((product) => product.status === "published");

export const getDraftCouturePieces = () =>
  couturePieces.filter((product) => product.status !== "published");

export const getCouturePieceBySlug = (slug: string) =>
  getPublishedCouturePieces().find((product) => product.slug === slug);

export const getLiveInterest = (_product: CouturePiece) => ({ count: null, text: "Recently admired" });

export const getRelatedCouturePieces = (product: CouturePiece, limit = 4) => {
  const published = getPublishedCouturePieces().filter(
    (item) => item.id !== product.id,
  );

  return published
    .map((item) => {
      const score = [
        item.category === product.category,
        item.style === product.style,
        item.fabric === product.fabric,
        item.type === product.type,
      ].filter(Boolean).length;

      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.id - b.item.id)
    .slice(0, limit)
    .map(({ item }) => item);
};
