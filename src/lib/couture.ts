import { couturePieces, type CouturePiece } from "../data/couture";

const LIVE_INTEREST_MIN = 6;
const LIVE_INTEREST_MAX = 18;

const interestCopy = [
  "Currently receiving attention",
  "visitors explored this piece recently",
  "Quietly admired today",
  "In private consideration",
] as const;

export const getPublishedCouturePieces = () =>
  couturePieces.filter((product) => product.status === "published");

export const getDraftCouturePieces = () =>
  couturePieces.filter((product) => product.status !== "published");

export const getCouturePieceBySlug = (slug: string) =>
  getPublishedCouturePieces().find((product) => product.slug === slug);

export const getStableCoutureNumber = (
  slug: string,
  min = LIVE_INTEREST_MIN,
  max = LIVE_INTEREST_MAX,
) => {
  const spread = max - min + 1;
  const hash = slug.split("").reduce((total, char) => {
    return (total * 31 + char.charCodeAt(0)) % 100000;
  }, 7);

  return min + (hash % spread);
};

export const getLiveInterest = (product: CouturePiece) => {
  const count = getStableCoutureNumber(product.slug);
  const copy = interestCopy[count % interestCopy.length];

  return {
    count,
    text: copy.includes("visitors") ? `${count} ${copy}` : copy,
  };
};

export const getRelatedCouturePieces = (product: CouturePiece, limit = 4) => {
  const published = getPublishedCouturePieces().filter((item) => item.id !== product.id);

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
