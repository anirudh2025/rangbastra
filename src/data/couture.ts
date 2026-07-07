export type CoutureCategory =
  | "Bridal"
  | "Festive"
  | "Reception"
  | "Engagement"
  | "Custom Couture";

export type CoutureStatus = "published" | "draft";

export interface CoutureEditorialImpression {
  label: "Founder's Pick" | "Atelier Favourite" | "Editor's Choice" | "Most Admired" | "Signature Detail";
  rating: 4 | 4.5 | 5;
  text: string;
}

export interface CoutureSeo {
  title: string;
  description: string;
}

export interface CouturePiece {
  id: number;
  slug: string;
  name: string;
  signatureName: string;
  collection: string;
  category: CoutureCategory;
  occasion: string;
  price: string | null;
  discount: string | null;
  priceLabel: string;
  discountLabel: string | null;
  makingTime: string | null;
  shade: string | null;
  fabric: string | null;
  handwork: string | null;
  style: string | null;
  motif: string | null;
  type: string | null;
  flare: string | null;
  usp: string | null;
  history: string | null;
  shortDescription: string;
  story: string;
  craftTags: string[];
  featuredImage: string;
  gallery: string[];
  status: CoutureStatus;
  editorialImpression: CoutureEditorialImpression;
  seo: CoutureSeo;
  image: string;
  featured: boolean;
  colorFamily: string;
}

interface CoutureSourceRecord {
  id: number;
  name: string;
  category: CoutureCategory;
  occasion: string;
  price: string | null;
  discount: string | null;
  makingTime: string | null;
  shade: string | null;
  fabric: string | null;
  handwork: string | null;
  style: string | null;
  motif: string | null;
  type: string | null;
  flare: string | null;
  usp: string | null;
  history: string | null;
  status?: CoutureStatus;
  imageKey: keyof typeof coutureImages;
}

export const coutureCategories: Array<"All" | CoutureCategory> = [
  "All",
  "Bridal",
  "Festive",
  "Reception",
  "Engagement",
  "Custom Couture",
];

const coutureImages = {
  bridal:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
  signature:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
  couture:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
  festive:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Festive_Edit_boj0wo.webp",
  hero:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782458746/RB_Hero_v7dyxg.png",
  swatches:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/RB_Fabric_Swatches_ortjph.webp",
  atelier:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Consult_Our_Designer_pbxliz.webp",
  craft:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Crafted_with_Precision_yh1xgw.webp",
  celebration:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Celebrate_Beautifully_pgr9c6.webp",
};

const editorialImpressions: CoutureEditorialImpression[] = [
  {
    label: "Founder's Pick",
    rating: 5,
    text: "Chosen for its rare balance of softness, craft, and celebration.",
  },
  {
    label: "Atelier Favourite",
    rating: 4.5,
    text: "Admired for the way its surface work stays luminous without feeling loud.",
  },
  {
    label: "Editor's Choice",
    rating: 5,
    text: "A composed couture story with a silhouette that photographs beautifully.",
  },
  {
    label: "Most Admired",
    rating: 4.5,
    text: "A piece remembered for its detail, proportion, and quiet ceremonial presence.",
  },
  {
    label: "Signature Detail",
    rating: 5,
    text: "Selected for the hand-finished accents that reveal themselves slowly.",
  },
];

const coutureSourceRecords: CoutureSourceRecord[] = [
  { id: 1, name: "Gulnaar", category: "Festive", occasion: "Celebration Anaarkali", price: "32000", discount: "0.05", makingTime: "10-15 D", shade: "Dusty Rose", fabric: "Tissue Fabric", handwork: "Cutdana, Tikki, Kasab, Beads, 8 inch Embroidery", style: "Anaarkali", motif: null, type: "Pleated", flare: null, usp: null, history: null, imageKey: "festive" },
  { id: 2, name: "Elara", category: "Reception", occasion: "Evening Gown", price: "20000", discount: "0.05", makingTime: "7-10 D", shade: "Royal Plum", fabric: "Tissue Fabric", handwork: "Cutdana, Tikki, Kasab, Beads, 8 inch Embroidery", style: "Gown", motif: null, type: "Kali", flare: null, usp: null, history: null, imageKey: "couture" },
  { id: 3, name: "Noor", category: "Festive", occasion: "Ceremonial Anaarkali", price: "55000", discount: "0.05", makingTime: "10-15 D", shade: null, fabric: "Tissue Fabric", handwork: "15 Border Embroidery", style: "Anaarkali", motif: null, type: "Pleated", flare: null, usp: null, history: null, imageKey: "signature" },
  { id: 4, name: "Inaayat", category: "Custom Couture", occasion: "Heritage Anaarkali", price: "35000", discount: "0.05", makingTime: "10-15 D", shade: null, fabric: "Banarasi Tissue Fabric", handwork: "Golden and cotton thread weave with mirror work", style: "Anaarkali", motif: null, type: "Pleated", flare: null, usp: null, history: "Banarasi Tissue", imageKey: "craft" },
  { id: 5, name: "Amaira", category: "Bridal", occasion: "Heritage Lehenga Choli", price: "135000/250000", discount: "7-10%", makingTime: "15-20 D", shade: null, fabric: "Banarasi Silk Fabric, Maroon Patola, Green Monga Silk", handwork: "Inspired by Inaayat", style: "Lehenga Choli", motif: null, type: "Kali", flare: null, usp: "Monga Silk / Patola", history: null, imageKey: "bridal" },
  { id: 6, name: "Naeyra", category: "Festive", occasion: "Motif Anaarkali", price: "60000", discount: "0.05", makingTime: "12-15 D", shade: "Unlimited Colors", fabric: "Banarasi Tissue", handwork: "Inspired by Inaayat with resham thread and extra beads", style: "Anaarkali", motif: "Elephant and Birds", type: "Pleated", flare: null, usp: null, history: "Banarasi Tissue", imageKey: "celebration" },
  { id: 7, name: "Mahira", category: "Engagement", occasion: "Mirror Work Lehenga", price: "25000", discount: "0.05", makingTime: "7-10 D", shade: null, fabric: "Printed Organza Georgette Fabric", handwork: "Mirror Work", style: "Lehenga Choli", motif: null, type: "Pleated", flare: null, usp: null, history: null, imageKey: "swatches" },
  { id: 8, name: "Aayana", category: "Festive", occasion: "Corset with Skirt", price: "18500", discount: "0.05", makingTime: "6 D", shade: null, fabric: "Printed Italian Crepe", handwork: "Bead work", style: "Corset with Skirt", motif: null, type: "Pleated", flare: null, usp: null, history: null, imageKey: "atelier" },
  { id: 9, name: "Iraaya", category: "Bridal", occasion: "Vintage Patchwork Lehenga", price: "85000", discount: "0.07", makingTime: "12-15 D", shade: null, fabric: "Banarasi Silk", handwork: "Vintage tikki patchwork", style: "Lehenga Choli", motif: null, type: "Kali", flare: null, usp: null, history: "Vintage History", imageKey: "hero" },
  { id: 10, name: "Riva", category: "Bridal", occasion: "Tissue Lehenga Choli", price: "103000", discount: "0.07", makingTime: "15-18 D", shade: null, fabric: "Tissue Fabric", handwork: "18 inch border embroidery inspired by Gulnaar", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "8M", usp: null, history: null, imageKey: "bridal" },
  { id: 11, name: "Anaahita", category: "Bridal", occasion: "Embroidered Lehenga Choli", price: "112000", discount: "0.07", makingTime: "15-20 D", shade: null, fabric: "Tissue Fabric", handwork: "Cutdana, Tikki, Kasab, Beads", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "8M", usp: null, history: null, imageKey: "signature" },
  { id: 12, name: "Aavya", category: "Bridal", occasion: "Pichwai Art Lehenga", price: "195000", discount: "utpo 7%", makingTime: "15-20 D", shade: null, fabric: "Georgette shimmer", handwork: "Pichwai art, tikki, beads, zardosi, resham thread", style: "Lehenga Choli", motif: null, type: "Kali", flare: "5.5M", usp: "Embroidery", history: "Pichwai history", imageKey: "couture" },
  { id: 13, name: "Ziana", category: "Reception", occasion: "Silver Work Lehenga", price: "70000", discount: "0.05", makingTime: "10-15 D", shade: null, fabric: "Tissue Fabric", handwork: "Silver work, mirror, zardosi, cutdana, resham", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "8M", usp: null, history: null, imageKey: "craft" },
  { id: 14, name: "Eiraa", category: "Reception", occasion: "Silver Work Lehenga", price: "70000", discount: "0.05", makingTime: "10-15 D", shade: null, fabric: "Tissue Fabric", handwork: "Silver work, mirror, zardosi, cutdana, resham", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "8M", usp: null, history: null, imageKey: "celebration" },
  { id: 15, name: "Eshaira", category: "Engagement", occasion: "Banarasi Corset Story", price: "20000", discount: "0.05", makingTime: "7-10 D", shade: null, fabric: "Banarasi Silk", handwork: "Mirror, beads, tikki, kasab, cutdana", style: "Corset with Skirt", motif: null, type: "Kali", flare: "6M", usp: "Banarasi Silk", history: "Fabric History", imageKey: "festive" },
  { id: 16, name: "Ruhaaya", category: "Bridal", occasion: "Minakari Dupatta Lehenga", price: "125000", discount: "0.07", makingTime: "15 - 20 D", shade: null, fabric: "Banarasi Silk with Banarasi Minakari Dupatta", handwork: "Mirror, beads, tikki, kasab, cutdana, resham work", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "8M", usp: "Banarasi Silk", history: "Fabric History", imageKey: "bridal" },
  { id: 17, name: "Lavanya", category: "Bridal", occasion: "Hand Painted Lehenga", price: "85000", discount: "0.07", makingTime: "15-20 D", shade: null, fabric: "Organza fabric", handwork: "Mirror, beads, tikki, kasab, cutdana, resham work", style: "Lehenga Choli", motif: "Hand painted with embroidery", type: "Kali", flare: "6M", usp: "Hand Painted", history: "Motif History", imageKey: "signature" },
  { id: 18, name: "Varnika", category: "Custom Couture", occasion: "Moonga Silk Lehenga", price: "97000", discount: "0.07", makingTime: "15-20 D", shade: null, fabric: "Moonga silk, Rajkot silk, and tissue", handwork: "Mirror, beads, tikki, kasab, cutdana, resham work", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "6.5 M", usp: "Moonga silk", history: "Fabric History", imageKey: "hero" },
  { id: 19, name: "Mishka", category: "Engagement", occasion: "Organza Lehenga Choli", price: "25000", discount: "0.07", makingTime: "7-10 D", shade: null, fabric: "Organza fabric", handwork: "Zardosi, mirror", style: "Lehenga Choli", motif: null, type: "Umbrella", flare: "6.5M", usp: null, history: null, imageKey: "atelier" },
  { id: 20, name: "Aureya", category: "Bridal", occasion: "Bandhej Bird Motif Lehenga", price: "135000", discount: "0.05", makingTime: "15-20 D", shade: null, fabric: "Banarasi silk with Bandhej gaji silk", handwork: "Beads, zardosi, tikki, kasab, cutdana", style: "Lehenga Choli", motif: "Bird", type: "Pleated", flare: "7.5 M", usp: "Banarasi Silk, bandhej", history: "Fabric History", imageKey: "couture" },
  { id: 21, name: "Zavira", category: "Bridal", occasion: "Bandhej Lehenga Choli", price: "125000", discount: "0.07", makingTime: "15-20 D", shade: null, fabric: "Banglori silk with Banarasi georgette bandhej", handwork: "Beads, zardosi, tikki, kasab, cutdana, resham work", style: "Lehenga Choli", motif: null, type: "Kali", flare: "5.5M", usp: "Bandhej", history: "Fabric History", imageKey: "bridal" },
  { id: 22, name: "Sahira", category: "Bridal", occasion: "Tissue Lehenga Choli", price: "97000", discount: "0.07", makingTime: "15-20 D", shade: null, fabric: "Tissue Fabric", handwork: "Cutdana, Tikki, Kasab, Beads", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "8M", usp: null, history: null, imageKey: "signature" },
  { id: 23, name: "Nirvi", category: "Festive", occasion: "Georgette Lehenga Choli", price: "18500", discount: "0.07", makingTime: "5-7 D", shade: null, fabric: "Georgette", handwork: "Cutdana, sequin, beads", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "6.5 M", usp: null, history: null, imageKey: "festive" },
  { id: 24, name: "Aarini", category: "Custom Couture", occasion: "Banarasi Tissue Lehenga", price: "16500", discount: "0.05", makingTime: "15-20 D", shade: null, fabric: "Banarasi tissue", handwork: "Zardosi, sequin, resham", style: "Lehenga Choli", motif: null, type: "Kali", flare: "5.5 m", usp: "Banarasi tissue", history: "Fabric History", imageKey: "swatches" },
  { id: 25, name: "Bahaar", category: "Bridal", occasion: "Tissue Lehenga Choli", price: "97000", discount: "0.07", makingTime: "15-20 D", shade: null, fabric: "Tissue Fabric", handwork: "Cutdana, Tikki, Kasab, Beads", style: "Lehenga Choli", motif: null, type: "Pleated", flare: "8M", usp: null, history: null, imageKey: "celebration" },
  { id: 26, name: "Tiara", category: "Reception", occasion: "Georgette Mirror Lehenga", price: "65000", discount: "0.05", makingTime: "7-10 D", shade: null, fabric: "Georgette fabric", handwork: "Cutdana, mirror work", style: "Lehenga Choli", motif: null, type: "Kali", flare: "5.5 M", usp: null, history: null, imageKey: "craft" },
  { id: 27, name: "Chaarvi", category: "Custom Couture", occasion: "Draft couture piece", price: null, discount: null, makingTime: null, shade: null, fabric: null, handwork: null, style: null, motif: null, type: null, flare: null, usp: null, history: null, status: "draft", imageKey: "swatches" },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const cleanValue = (value: string | null) => {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();

  if (!normalized || lower === "na" || lower === "usp is the history") {
    return null;
  }

  if (lower === "fabric history") {
    return "Fabric-led heritage";
  }

  if (lower === "motif history") {
    return "Motif-led craft history";
  }

  return normalized;
};

const formatInr = (value: string) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(Number(value));

const formatPriceLabel = (price: string | null) => {
  const normalized = cleanValue(price);

  if (!normalized) {
    return "Atelier-led couture";
  }

  if (normalized.includes("/")) {
    const range = normalized
      .split("/")
      .map((item) => item.trim())
      .filter(Boolean)
      .map(formatInr)
      .join(" to ");

    return `From ${range}`;
  }

  return `From ${formatInr(normalized)}`;
};

const formatDiscountLabel = (discount: string | null) => {
  const normalized = cleanValue(discount);

  if (!normalized) {
    return null;
  }

  if (normalized.includes("%")) {
    return normalized.replace(/utpo/i, "Up to");
  }

  const numeric = Number(normalized);

  if (Number.isNaN(numeric)) {
    return normalized;
  }

  return `${Math.round(numeric * 100)}%`;
};

const normalizeMakingTime = (value: string | null) =>
  cleanValue(value)?.replace(/\s*D$/i, " days").replace(/\s+-\s+/g, "-") ?? null;

const buildCraftTags = (record: CoutureSourceRecord) =>
  [
    cleanValue(record.fabric),
    cleanValue(record.handwork)?.split(",")[0],
    cleanValue(record.style),
    cleanValue(record.motif),
  ]
    .filter((value): value is string => Boolean(value))
    .slice(0, 4);

const buildShortDescription = (record: CoutureSourceRecord) => {
  const fabric = cleanValue(record.fabric) ?? "couture fabric";
  const style = cleanValue(record.style) ?? "silhouette";
  const detail = describeHandwork(record.handwork, "hand detail");

  return `${record.name} is a ${style.toLowerCase()} story shaped in ${fabric.toLowerCase()} with ${detail}.`;
};

const describeHandwork = (value: string | null, fallback: string) => {
  const handwork = cleanValue(value);

  if (!handwork) {
    return fallback;
  }

  if (/inspired by/i.test(handwork)) {
    return "an Inaayat-inspired embroidery language";
  }

  return handwork.split(",")[0].toLowerCase();
};

const buildStory = (record: CoutureSourceRecord) => {
  const style = cleanValue(record.style) ?? "couture silhouette";
  const fabric = cleanValue(record.fabric) ?? "atelier-selected fabric";
  const handwork = describeHandwork(record.handwork, "hand-finished detail");
  const heritage = cleanValue(record.history) ?? cleanValue(record.usp);

  return [
    `${record.name} is composed as a quiet couture chapter, led by ${style.toLowerCase()} proportion and the tactile depth of ${fabric.toLowerCase()}.`,
    `The piece brings ${handwork} into focus, allowing craft to remain intimate rather than overstated.`,
    `Its presence is designed for the woman who wants the outfit to feel personal before it feels decorative, with surface, fall, and memory held in balance.`,
    heritage
      ? `Its reference point is ${heritage.toLowerCase()}, giving the ensemble a sense of memory without making it feel archival.`
      : "Its restraint leaves space for the wearer, the ceremony, and the memory around it.",
    "Every detail is meant to support the mood of the celebration while keeping the wearer at the centre of the story.",
  ].join(" ");
};

const buildGallery = (imageKey: keyof typeof coutureImages, index: number) => {
  const imageKeys = Object.keys(coutureImages) as Array<keyof typeof coutureImages>;
  const selected = [coutureImages[imageKey]];

  for (const offset of [2, 4, 6, 8]) {
    const image = coutureImages[imageKeys[(index + offset) % imageKeys.length]];

    if (!selected.includes(image)) {
      selected.push(image);
    }

    if (selected.length === 3) {
      break;
    }
  }

  return selected;
};

// Couture imagery currently uses approved editorial placeholders until each piece
// receives dedicated photography from the atelier.
export const couturePieces: CouturePiece[] = coutureSourceRecords.map((record, index) => {
  const featuredImage = coutureImages[record.imageKey];
  const status = record.status ?? "published";
  const signatureName = `${record.name} by Rangbastra`;
  const shade = cleanValue(record.shade);
  const fabric = cleanValue(record.fabric);
  const shortDescription = buildShortDescription(record);

  return {
    id: record.id,
    slug: slugify(record.name),
    name: record.name,
    signatureName,
    collection: "Rangbastra Couture Edit",
    category: record.category,
    occasion: record.occasion,
    price: cleanValue(record.price),
    discount: formatDiscountLabel(record.discount),
    priceLabel: formatPriceLabel(record.price),
    discountLabel: formatDiscountLabel(record.discount),
    makingTime: normalizeMakingTime(record.makingTime),
    shade,
    fabric,
    handwork: cleanValue(record.handwork),
    style: cleanValue(record.style),
    motif: cleanValue(record.motif),
    type: cleanValue(record.type),
    flare: cleanValue(record.flare),
    usp: cleanValue(record.usp),
    history: cleanValue(record.history),
    shortDescription,
    story: buildStory(record),
    craftTags: buildCraftTags(record),
    featuredImage,
    gallery: buildGallery(record.imageKey, index),
    status,
    editorialImpression: editorialImpressions[index % editorialImpressions.length],
    seo: {
      title: `${record.name} | Rangbastra Couture`,
      description: `${shortDescription} Explore craft, fabric, making time, and atelier details for this Rangbastra couture piece.`,
    },
    image: featuredImage,
    featured: status === "published" && [5, 9, 12, 16, 20, 21].includes(record.id),
    colorFamily: shade ?? "Atelier palette",
  };
});
