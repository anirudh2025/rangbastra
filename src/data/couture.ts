export type CoutureCategory =
  "Bridal" | "Festive" | "Reception" | "Engagement" | "Custom Couture";

export type CoutureStatus = "published" | "draft";

export interface CoutureEditorialImpression {
  label:
    | "Founder's Pick"
    | "Atelier Favourite"
    | "Editor's Choice"
    | "Most Admired"
    | "Signature Detail";
  rating: 4 | 4.5 | 5;
  text: string;
}

export interface CoutureSeo {
  title: string;
  description: string;
}

export interface CoutureImage {
  id: "hero" | "front" | "side" | "back" | "detail" | "drape" | "editorial";
  role: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

export const PRODUCT_IMAGE_STANDARD = {
  width: 2160,
  height: 2700,
  aspectRatio: "4 / 5",
} as const;

export interface CoutureColor {
  name: string;
  hex: string | null;
  secondaryHex?: string | null;
}

export interface CouturePaletteOption {
  id: string;
  name: string;
  value: string;
  secondaryValue?: string;
  finish?: string;
  type: "original" | "custom-request";
  availability: "As photographed" | "Subject to fabric availability";
}

export interface CouturePiece {
  id: number;
  slug: string;
  name: string;
  signatureName: string;
  collection: string;
  category: CoutureCategory;
  collectionIds: string[];
  occasion: string;
  price: string | null;
  discount: string | null;
  priceLabel: string;
  startingPrice: number | null;
  discountLabel: string | null;
  makingTime: string | null;
  shade: string | null;
  shadeHex?: string | null;
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
  images?: CoutureImage[];
  color: CoutureColor;
  paletteOptions: CouturePaletteOption[];
  customization: { enabled: boolean; route: string };
  status: CoutureStatus;
  editorialImpression: CoutureEditorialImpression;
  seo: CoutureSeo;
  image: string;
  featured: boolean;
  colorFamily: string;
  palette: CouturePaletteOption[];
  rating?: number;
  reviewCount?: number;
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
  shadeHex?: string | null;
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
  hero: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782458746/RB_Hero_v7dyxg.png",
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
  {
    id: 1,
    name: "Gulnaar",
    category: "Festive",
    occasion: "Celebration Anaarkali",
    price: "32000",
    discount: "0.05",
    makingTime: "10-15 D",
    shade: "Dusty Rose",
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads, 8 inch Embroidery",
    style: "Anaarkali",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: null,
    imageKey: "festive",
  },
  {
    id: 2,
    name: "Elara",
    category: "Reception",
    occasion: "Evening Gown",
    price: "20000",
    discount: "0.05",
    makingTime: "7-10 D",
    shade: "Royal Plum",
    // Temporary visual reference supplied in data until the atelier confirms the calibrated Royal Plum hex.
    shadeHex: "#4A214F",
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads, 8 inch Embroidery",
    style: "Gown",
    motif: null,
    type: "Kali",
    flare: null,
    usp: null,
    history: null,
    imageKey: "couture",
  },
  {
    id: 3,
    name: "Noor",
    category: "Festive",
    occasion: "Ceremonial Anaarkali",
    price: "55000",
    discount: "0.05",
    makingTime: "10-15 D",
    shade: null,
    fabric: "Tissue Fabric",
    handwork: "15 Border Embroidery",
    style: "Anaarkali",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: null,
    imageKey: "signature",
  },
  {
    id: 4,
    name: "Inaayat",
    category: "Custom Couture",
    occasion: "Heritage Anaarkali",
    price: "35000",
    discount: "0.05",
    makingTime: "10-15 D",
    shade: null,
    fabric: "Banarasi Tissue Fabric",
    handwork: "Golden and cotton thread weave with mirror work",
    style: "Anaarkali",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: "Banarasi Tissue",
    imageKey: "craft",
  },
  {
    id: 5,
    name: "Amaira",
    category: "Bridal",
    occasion: "Heritage Lehenga Choli",
    price: "135000/250000",
    discount: "7-10%",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Banarasi Silk Fabric, Maroon Patola, Green Monga Silk",
    handwork: "Inspired by Inaayat",
    style: "Lehenga Choli",
    motif: null,
    type: "Kali",
    flare: null,
    usp: "Monga Silk / Patola",
    history: null,
    imageKey: "bridal",
  },
  {
    id: 6,
    name: "Naeyra",
    category: "Festive",
    occasion: "Motif Anaarkali",
    price: "60000",
    discount: "0.05",
    makingTime: "12-15 D",
    shade: "Unlimited Colors",
    fabric: "Banarasi Tissue",
    handwork: "Inspired by Inaayat with resham thread and extra beads",
    style: "Anaarkali",
    motif: "Elephant and Birds",
    type: "Pleated",
    flare: null,
    usp: null,
    history: "Banarasi Tissue",
    imageKey: "celebration",
  },
  {
    id: 7,
    name: "Mahira",
    category: "Engagement",
    occasion: "Mirror Work Lehenga",
    price: "25000",
    discount: "0.05",
    makingTime: "7-10 D",
    shade: null,
    fabric: "Printed Organza Georgette Fabric",
    handwork: "Mirror Work",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: null,
    imageKey: "swatches",
  },
  {
    id: 8,
    name: "Aayana",
    category: "Festive",
    occasion: "Corset with Skirt",
    price: "18500",
    discount: "0.05",
    makingTime: "6 D",
    shade: null,
    fabric: "Printed Italian Crepe",
    handwork: "Bead work",
    style: "Corset with Skirt",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: null,
    imageKey: "atelier",
  },
  {
    id: 9,
    name: "Iraaya",
    category: "Bridal",
    occasion: "Vintage Patchwork Lehenga",
    price: "85000",
    discount: "0.07",
    makingTime: "12-15 D",
    shade: null,
    fabric: "Banarasi Silk",
    handwork: "Vintage tikki patchwork",
    style: "Lehenga Choli",
    motif: null,
    type: "Kali",
    flare: null,
    usp: null,
    history: "Vintage History",
    imageKey: "hero",
  },
  {
    id: 10,
    name: "Riva",
    category: "Bridal",
    occasion: "Tissue Lehenga Choli",
    price: "103000",
    discount: "0.07",
    makingTime: "15-18 D",
    shade: null,
    fabric: "Tissue Fabric",
    handwork: "18 inch border embroidery inspired by Gulnaar",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
    imageKey: "bridal",
  },
  {
    id: 11,
    name: "Anaahita",
    category: "Bridal",
    occasion: "Embroidered Lehenga Choli",
    price: "112000",
    discount: "0.07",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
    imageKey: "signature",
  },
  {
    id: 12,
    name: "Aavya",
    category: "Bridal",
    occasion: "Pichwai Art Lehenga",
    price: "195000",
    discount: "utpo 7%",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Georgette shimmer",
    handwork: "Pichwai art, tikki, beads, zardosi, resham thread",
    style: "Lehenga Choli",
    motif: null,
    type: "Kali",
    flare: "5.5M",
    usp: "Embroidery",
    history: "Pichwai history",
    imageKey: "couture",
  },
  {
    id: 13,
    name: "Ziana",
    category: "Reception",
    occasion: "Silver Work Lehenga",
    price: "70000",
    discount: "0.05",
    makingTime: "10-15 D",
    shade: null,
    fabric: "Tissue Fabric",
    handwork: "Silver work, mirror, zardosi, cutdana, resham",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
    imageKey: "craft",
  },
  {
    id: 14,
    name: "Eiraa",
    category: "Reception",
    occasion: "Silver Work Lehenga",
    price: "70000",
    discount: "0.05",
    makingTime: "10-15 D",
    shade: null,
    fabric: "Tissue Fabric",
    handwork: "Silver work, mirror, zardosi, cutdana, resham",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
    imageKey: "celebration",
  },
  {
    id: 15,
    name: "Eshaira",
    category: "Engagement",
    occasion: "Banarasi Corset Story",
    price: "20000",
    discount: "0.05",
    makingTime: "7-10 D",
    shade: null,
    fabric: "Banarasi Silk",
    handwork: "Mirror, beads, tikki, kasab, cutdana",
    style: "Corset with Skirt",
    motif: null,
    type: "Kali",
    flare: "6M",
    usp: "Banarasi Silk",
    history: "Fabric History",
    imageKey: "festive",
  },
  {
    id: 16,
    name: "Ruhaaya",
    category: "Bridal",
    occasion: "Minakari Dupatta Lehenga",
    price: "125000",
    discount: "0.07",
    makingTime: "15 - 20 D",
    shade: null,
    fabric: "Banarasi Silk with Banarasi Minakari Dupatta",
    handwork: "Mirror, beads, tikki, kasab, cutdana, resham work",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: "Banarasi Silk",
    history: "Fabric History",
    imageKey: "bridal",
  },
  {
    id: 17,
    name: "Lavanya",
    category: "Bridal",
    occasion: "Hand Painted Lehenga",
    price: "85000",
    discount: "0.07",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Organza fabric",
    handwork: "Mirror, beads, tikki, kasab, cutdana, resham work",
    style: "Lehenga Choli",
    motif: "Hand painted with embroidery",
    type: "Kali",
    flare: "6M",
    usp: "Hand Painted",
    history: "Motif History",
    imageKey: "signature",
  },
  {
    id: 18,
    name: "Varnika",
    category: "Custom Couture",
    occasion: "Moonga Silk Lehenga",
    price: "97000",
    discount: "0.07",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Moonga silk, Rajkot silk, and tissue",
    handwork: "Mirror, beads, tikki, kasab, cutdana, resham work",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "6.5 M",
    usp: "Moonga silk",
    history: "Fabric History",
    imageKey: "hero",
  },
  {
    id: 19,
    name: "Mishka",
    category: "Engagement",
    occasion: "Organza Lehenga Choli",
    price: "25000",
    discount: "0.07",
    makingTime: "7-10 D",
    shade: null,
    fabric: "Organza fabric",
    handwork: "Zardosi, mirror",
    style: "Lehenga Choli",
    motif: null,
    type: "Umbrella",
    flare: "6.5M",
    usp: null,
    history: null,
    imageKey: "atelier",
  },
  {
    id: 20,
    name: "Aureya",
    category: "Bridal",
    occasion: "Bandhej Bird Motif Lehenga",
    price: "135000",
    discount: "0.05",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Banarasi silk with Bandhej gaji silk",
    handwork: "Beads, zardosi, tikki, kasab, cutdana",
    style: "Lehenga Choli",
    motif: "Bird",
    type: "Pleated",
    flare: "7.5 M",
    usp: "Banarasi Silk, bandhej",
    history: "Fabric History",
    imageKey: "couture",
  },
  {
    id: 21,
    name: "Zavira",
    category: "Bridal",
    occasion: "Bandhej Lehenga Choli",
    price: "125000",
    discount: "0.07",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Banglori silk with Banarasi georgette bandhej",
    handwork: "Beads, zardosi, tikki, kasab, cutdana, resham work",
    style: "Lehenga Choli",
    motif: null,
    type: "Kali",
    flare: "5.5M",
    usp: "Bandhej",
    history: "Fabric History",
    imageKey: "bridal",
  },
  {
    id: 22,
    name: "Sahira",
    category: "Bridal",
    occasion: "Tissue Lehenga Choli",
    price: "97000",
    discount: "0.07",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
    imageKey: "signature",
  },
  {
    id: 23,
    name: "Nirvi",
    category: "Festive",
    occasion: "Georgette Lehenga Choli",
    price: "18500",
    discount: "0.07",
    makingTime: "5-7 D",
    shade: null,
    fabric: "Georgette",
    handwork: "Cutdana, sequin, beads",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "6.5 M",
    usp: null,
    history: null,
    imageKey: "festive",
  },
  {
    id: 24,
    name: "Aarini",
    category: "Custom Couture",
    occasion: "Banarasi Tissue Lehenga",
    price: "16500",
    discount: "0.05",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Banarasi tissue",
    handwork: "Zardosi, sequin, resham",
    style: "Lehenga Choli",
    motif: null,
    type: "Kali",
    flare: "5.5 m",
    usp: "Banarasi tissue",
    history: "Fabric History",
    imageKey: "swatches",
  },
  {
    id: 25,
    name: "Bahaar",
    category: "Bridal",
    occasion: "Tissue Lehenga Choli",
    price: "97000",
    discount: "0.07",
    makingTime: "15-20 D",
    shade: null,
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
    imageKey: "celebration",
  },
  {
    id: 26,
    name: "Tiara",
    category: "Reception",
    occasion: "Georgette Mirror Lehenga",
    price: "65000",
    discount: "0.05",
    makingTime: "7-10 D",
    shade: null,
    fabric: "Georgette fabric",
    handwork: "Cutdana, mirror work",
    style: "Lehenga Choli",
    motif: null,
    type: "Kali",
    flare: "5.5 M",
    usp: null,
    history: null,
    imageKey: "craft",
  },
  {
    id: 27,
    name: "Chaarvi",
    category: "Custom Couture",
    occasion: "Draft couture piece",
    price: null,
    discount: null,
    makingTime: null,
    shade: null,
    fabric: null,
    handwork: null,
    style: null,
    motif: null,
    type: null,
    flare: null,
    usp: null,
    history: null,
    status: "draft",
    imageKey: "swatches",
  },
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
    return formatInr(normalized.split("/")[0]!.trim());
  }

  return formatInr(normalized);
};

const getStartingPrice = (price: string | null) => {
  const normalized = cleanValue(price);
  if (!normalized) return null;
  const value = Number(normalized.split("/")[0]?.trim());
  return Number.isFinite(value) ? value : null;
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
  cleanValue(value)
    ?.replace(/\s*D$/i, " days")
    .replace(/\s+-\s+/g, "-") ?? null;

const conciseAttribute = (value: string | null) => cleanValue(value)
  ?.replace(/\s+Fabric$/i, "")
  .replace(/^Anaarkali$/i, "Anarkali")
  .replace(/^Golden and cotton thread weave with mirror work$/i, "Thread Weave")
  .replace(/^Inspired by Inaayat.*$/i, "Resham Work")
  .replace(/^\d+\s+inch\s+border\s+embroidery.*$/i, "Border Embroidery")
  .replace(/^\d+\s+Border\s+Embroidery$/i, "Border Embroidery")
  .replace(/^Printed\s+/i, "");

const buildCraftTags = (record: CoutureSourceRecord) => {
  const handwork = cleanValue(record.handwork);
  const firstDetail = conciseAttribute(handwork?.split(",")[0] ?? null);
  const details = handwork?.toLowerCase().includes("mirror")
    ? [firstDetail, "Mirror Work"]
    : [firstDetail];
  return [...new Set([
    conciseAttribute(cleanValue(record.fabric)?.split(",")[0] ?? null),
    conciseAttribute(record.style),
    ...details,
    conciseAttribute(record.motif),
  ].filter((value): value is string => Boolean(value)))].slice(0, 4);
};

const buildShortDescription = (record: CoutureSourceRecord) => {
  const featuredCopy: Record<string, string> = {
    Gulnaar: "A dusty-rose anarkali shaped with luminous cutdana detail.",
    Elara: "A royal-plum gown shaped with luminous cutdana detail.",
    Amaira: "A poised couture silhouette finished with restrained handwork.",
    Mayra: "A graceful celebration silhouette with considered surface detail.",
    Mahira: "A graceful celebration silhouette with considered surface detail.",
  };
  if (featuredCopy[record.name]) return featuredCopy[record.name];
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
  const imageKeys = Object.keys(coutureImages) as Array<
    keyof typeof coutureImages
  >;
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

const productImageViews = [
  "primary view",
  "front view",
  "side view",
  "back view",
  "embroidery detail",
  "drape detail",
  "editorial view",
] as const;

const productImageIds: CoutureImage["id"][] = [
  "hero",
  "front",
  "side",
  "back",
  "detail",
  "drape",
  "editorial",
];

/**
 * EDIT PRODUCT PHOTOGRAPHY HERE.
 * Slots are ordered: hero, front, side, back, detail, drape, editorial.
 * Repeated placeholders are intentional; replace each line independently.
 */
const productImageUrls: Record<
  string,
  [string, string, string, string, string, string, string]
> = {
  gulnaar: [
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784365269/Gulnaar_Web_01_gasunw.webp", // 01 hero
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784365270/Gulnaar_Web_02_gjfxct.webp", // 02 front
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784365270/Gulnaar_Web_03_h9rvca.webp", // 03 side
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784365270/Gulnaar_Web_04_kf5vnc.webp", // 04 back
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784365270/Gulnaar_Web_05_rrxwtl.webp", // 05 detail
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784365271/Gulnaar_Web_06_we87zg.webp", // 06 drape
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784365275/Gulnaar_Web_01_gasunw.webp", // 07 editorial
  ],
  elara: [
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784188775/Elara_Web_01_wyoibr.webp", // 01 hero
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784188776/Elara_Web_02_mcllu1.webp", // 02 front
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784188778/Elara_Web_03_wf5v8x.webp", // 03 side
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784188777/Elara_Web_04_cekq8k.webp", // 04 back
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784188778/Elara_Web_05_tuxyyq.webp", // 05 detail
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784188778/Elara_Web_06_vbg9in.webp", // 06 drape
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784188775/Elara_Web_01_wyoibr.webp", // 07 editorial - temporary hero fallback
  ],
  noor: [
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784457855/Noor_Web_01_lzgejf.webp", // 01 hero
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784457856/Noor_Web_02_a4b0d6.webp", // 02 front
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784457857/Noor_Web_03_odw8vy.webp", // 03 side
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784457857/Noor_Web_04_hgfm1n.webp", // 04 back
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784457856/Noor_Web_05_iknicz.webp", // 05 detail
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784457857/Noor_Web_06_dwqhey.webp", // 06 drape
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784457856/Noor_Web_07_yfdeai.webp", // 07 editorial
  ],
  inaayat: [
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784461296/Inaayat_Web_01_bnyonn.webp", // 01 hero
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784461297/Inaayat_Web_02_ewc039.webp", // 02 front
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784461298/Inaayat_Web_03_jsepzz.webp", // 03 side
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784461297/Inaayat_Web_04_nwlmuc.webp", // 04 back
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784461298/Inaayat_Web_05_jckrsr.webp", // 05 detail
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784461298/Inaayat_Web_06_tl1gir.webp", // 06 drape
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1784461299/Inaayat_Web_07_foksqp.webp", // 07 editorial
  ],
  amaira: [
    coutureImages.bridal, // 01 hero
    coutureImages.bridal, // 02 front
    coutureImages.bridal, // 03 side
    coutureImages.bridal, // 04 back
    coutureImages.bridal, // 05 detail
    coutureImages.bridal, // 06 drape
    coutureImages.bridal, // 07 editorial
  ],
  naeyra: [
    coutureImages.celebration, // 01 hero
    coutureImages.celebration, // 02 front
    coutureImages.celebration, // 03 side
    coutureImages.celebration, // 04 back
    coutureImages.celebration, // 05 detail
    coutureImages.celebration, // 06 drape
    coutureImages.celebration, // 07 editorial
  ],
  mahira: [
    coutureImages.swatches, // 01 hero
    coutureImages.swatches, // 02 front
    coutureImages.swatches, // 03 side
    coutureImages.swatches, // 04 back
    coutureImages.swatches, // 05 detail
    coutureImages.swatches, // 06 drape
    coutureImages.swatches, // 07 editorial
  ],
  aayana: [
    coutureImages.atelier, // 01 hero
    coutureImages.atelier, // 02 front
    coutureImages.atelier, // 03 side
    coutureImages.atelier, // 04 back
    coutureImages.atelier, // 05 detail
    coutureImages.atelier, // 06 drape
    coutureImages.atelier, // 07 editorial
  ],
  iraaya: [
    coutureImages.hero, // 01 hero
    coutureImages.hero, // 02 front
    coutureImages.hero, // 03 side
    coutureImages.hero, // 04 back
    coutureImages.hero, // 05 detail
    coutureImages.hero, // 06 drape
    coutureImages.hero, // 07 editorial
  ],
  riva: [
    coutureImages.bridal, // 01 hero
    coutureImages.bridal, // 02 front
    coutureImages.bridal, // 03 side
    coutureImages.bridal, // 04 back
    coutureImages.bridal, // 05 detail
    coutureImages.bridal, // 06 drape
    coutureImages.bridal, // 07 editorial
  ],
  anaahita: [
    coutureImages.signature, // 01 hero
    coutureImages.signature, // 02 front
    coutureImages.signature, // 03 side
    coutureImages.signature, // 04 back
    coutureImages.signature, // 05 detail
    coutureImages.signature, // 06 drape
    coutureImages.signature, // 07 editorial
  ],
  aavya: [
    coutureImages.couture, // 01 hero
    coutureImages.couture, // 02 front
    coutureImages.couture, // 03 side
    coutureImages.couture, // 04 back
    coutureImages.couture, // 05 detail
    coutureImages.couture, // 06 drape
    coutureImages.couture, // 07 editorial
  ],
  ziana: [
    coutureImages.craft, // 01 hero
    coutureImages.craft, // 02 front
    coutureImages.craft, // 03 side
    coutureImages.craft, // 04 back
    coutureImages.craft, // 05 detail
    coutureImages.craft, // 06 drape
    coutureImages.craft, // 07 editorial
  ],
  eiraa: [
    coutureImages.celebration, // 01 hero
    coutureImages.celebration, // 02 front
    coutureImages.celebration, // 03 side
    coutureImages.celebration, // 04 back
    coutureImages.celebration, // 05 detail
    coutureImages.celebration, // 06 drape
    coutureImages.celebration, // 07 editorial
  ],
  eshaira: [
    coutureImages.festive, // 01 hero
    coutureImages.festive, // 02 front
    coutureImages.festive, // 03 side
    coutureImages.festive, // 04 back
    coutureImages.festive, // 05 detail
    coutureImages.festive, // 06 drape
    coutureImages.festive, // 07 editorial
  ],
  ruhaaya: [
    coutureImages.bridal, // 01 hero
    coutureImages.bridal, // 02 front
    coutureImages.bridal, // 03 side
    coutureImages.bridal, // 04 back
    coutureImages.bridal, // 05 detail
    coutureImages.bridal, // 06 drape
    coutureImages.bridal, // 07 editorial
  ],
  lavanya: [
    coutureImages.signature, // 01 hero
    coutureImages.signature, // 02 front
    coutureImages.signature, // 03 side
    coutureImages.signature, // 04 back
    coutureImages.signature, // 05 detail
    coutureImages.signature, // 06 drape
    coutureImages.signature, // 07 editorial
  ],
  varnika: [
    coutureImages.hero, // 01 hero
    coutureImages.hero, // 02 front
    coutureImages.hero, // 03 side
    coutureImages.hero, // 04 back
    coutureImages.hero, // 05 detail
    coutureImages.hero, // 06 drape
    coutureImages.hero, // 07 editorial
  ],
  mishka: [
    coutureImages.atelier, // 01 hero
    coutureImages.atelier, // 02 front
    coutureImages.atelier, // 03 side
    coutureImages.atelier, // 04 back
    coutureImages.atelier, // 05 detail
    coutureImages.atelier, // 06 drape
    coutureImages.atelier, // 07 editorial
  ],
  aureya: [
    coutureImages.couture, // 01 hero
    coutureImages.couture, // 02 front
    coutureImages.couture, // 03 side
    coutureImages.couture, // 04 back
    coutureImages.couture, // 05 detail
    coutureImages.couture, // 06 drape
    coutureImages.couture, // 07 editorial
  ],
  zavira: [
    coutureImages.bridal, // 01 hero
    coutureImages.bridal, // 02 front
    coutureImages.bridal, // 03 side
    coutureImages.bridal, // 04 back
    coutureImages.bridal, // 05 detail
    coutureImages.bridal, // 06 drape
    coutureImages.bridal, // 07 editorial
  ],
  sahira: [
    coutureImages.signature, // 01 hero
    coutureImages.signature, // 02 front
    coutureImages.signature, // 03 side
    coutureImages.signature, // 04 back
    coutureImages.signature, // 05 detail
    coutureImages.signature, // 06 drape
    coutureImages.signature, // 07 editorial
  ],
  nirvi: [
    coutureImages.festive, // 01 hero
    coutureImages.festive, // 02 front
    coutureImages.festive, // 03 side
    coutureImages.festive, // 04 back
    coutureImages.festive, // 05 detail
    coutureImages.festive, // 06 drape
    coutureImages.festive, // 07 editorial
  ],
  aarini: [
    coutureImages.swatches, // 01 hero
    coutureImages.swatches, // 02 front
    coutureImages.swatches, // 03 side
    coutureImages.swatches, // 04 back
    coutureImages.swatches, // 05 detail
    coutureImages.swatches, // 06 drape
    coutureImages.swatches, // 07 editorial
  ],
  bahaar: [
    coutureImages.celebration, // 01 hero
    coutureImages.celebration, // 02 front
    coutureImages.celebration, // 03 side
    coutureImages.celebration, // 04 back
    coutureImages.celebration, // 05 detail
    coutureImages.celebration, // 06 drape
    coutureImages.celebration, // 07 editorial
  ],
  tiara: [
    coutureImages.craft, // 01 hero
    coutureImages.craft, // 02 front
    coutureImages.craft, // 03 side
    coutureImages.craft, // 04 back
    coutureImages.craft, // 05 detail
    coutureImages.craft, // 06 drape
    coutureImages.craft, // 07 editorial
  ],
  chaarvi: [
    coutureImages.swatches, // 01 hero
    coutureImages.swatches, // 02 front
    coutureImages.swatches, // 03 side
    coutureImages.swatches, // 04 back
    coutureImages.swatches, // 05 detail
    coutureImages.swatches, // 06 drape
    coutureImages.swatches, // 07 editorial
  ],
};

const buildProductImages = (
  name: string,
  slug: string,
  fallback: string,
): CoutureImage[] =>
  (
    productImageUrls[slug] ?? [
      fallback,
      fallback,
      fallback,
      fallback,
      fallback,
      fallback,
      fallback,
    ]
  )
    .map((src, index) => ({
      id: productImageIds[index],
      role: productImageViews[index].replace(/^./, (letter) =>
        letter.toUpperCase(),
      ),
      src,
      alt: `${name} - ${productImageViews[index]}`,
      ...(slug === "elara" ? PRODUCT_IMAGE_STANDARD : {}),
    }))
    .map((image, index) => ({
      ...image,
      alt: `${name} - ${productImageViews[index]}`,
    }));

const customOption = (
  id: string,
  name: string,
  value: string,
  secondaryValue?: string,
  finish?: string,
): CouturePaletteOption => ({
  id,
  name,
  value,
  secondaryValue,
  finish,
  type: "custom-request",
  availability: "Subject to fabric availability",
});
const categoryPalettes: Record<CoutureCategory, CouturePaletteOption[]> = {
  Bridal: [
    customOption(
      "heritage-crimson",
      "Heritage Crimson",
      "#68172d",
      "#2b090f",
      "Deep ceremonial tone",
    ),
    customOption(
      "antique-rose",
      "Antique Rose",
      "#9a5f67",
      "#d2aaa6",
      "Soft luminous finish",
    ),
  ],
  Festive: [
    customOption(
      "cocoa-bloom",
      "Cocoa Bloom",
      "#6a4e42",
      "#b99382",
      "Warm evening tone",
    ),
    customOption(
      "saffron-ember",
      "Saffron Ember",
      "#9c4b23",
      "#d39b5c",
      "Festive warmth",
    ),
  ],
  Reception: [
    customOption(
      "midnight-plum",
      "Midnight Plum",
      "#38223d",
      "#75516f",
      "Evening lustre",
    ),
    customOption(
      "wine-cocoa",
      "Wine Cocoa",
      "#4c1726",
      "#6a4e42",
      "Deep satin finish",
    ),
  ],
  Engagement: [
    customOption(
      "mauve-mirror",
      "Mauve Mirror",
      "#765060",
      "#c7aab5",
      "Reflective soft tone",
    ),
    customOption(
      "cocoa-ivory",
      "Cocoa Ivory",
      "#6a4e42",
      "#e7ddd0",
      "Warm two-tone",
    ),
  ],
  "Custom Couture": [
    customOption(
      "atelier-cocoa",
      "Atelier Cocoa",
      "#6a4e42",
      "#b59382",
      "Signature Rangbastra palette",
    ),
    customOption(
      "custom-colour",
      "Custom Colour Study",
      "#8b756b",
      "#2b2522",
      "Developed with your designer",
    ),
  ],
};

const buildPalette = (
  record: CoutureSourceRecord,
  shadeName: string,
  shadeHex: string,
): CouturePaletteOption[] => {
  const original: CouturePaletteOption = {
    id: "original",
    name: shadeName,
    value: shadeHex,
    finish: "As photographed",
    type: "original",
    availability: "As photographed",
  };
  return [
    original,
    ...categoryPalettes[record.category].filter(
      (option) => option.id !== original.id,
    ),
  ];
};

/**
 * INTERNAL DISPLAY FALLBACKS.
 * Only Dusty Rose and Royal Plum are confirmed in source data. Products without
 * a confirmed shade use the neutral "Atelier palette" label so an estimated
 * colour is never presented to customers as a factual garment specification.
 */
const temporaryCategoryShade: Record<CoutureCategory, { name: string; hex: string }> = {
  Bridal: { name: "Atelier palette", hex: "#68172D" },
  Festive: { name: "Atelier palette", hex: "#6A4E42" },
  Reception: { name: "Atelier palette", hex: "#38223D" },
  Engagement: { name: "Atelier palette", hex: "#765060" },
  "Custom Couture": { name: "Atelier palette", hex: "#6A4E42" },
};

// Couture imagery currently uses approved editorial placeholders until each piece
// receives dedicated photography from the atelier.
export const couturePieces: CouturePiece[] = coutureSourceRecords.map(
  (record, index) => {
    const legacyFallback = coutureImages[record.imageKey];
    const status = record.status ?? "published";
    const signatureName = `${record.name} by Rangbastra`;
    const shade = cleanValue(record.shade);
    const temporaryShade = temporaryCategoryShade[record.category];
    const shadeHex =
      record.shadeHex ??
      (
        {
          "Dusty Rose": "#A86F78",
          "Royal Plum": "#4A214F",
          Maroon: "#6B1726",
          Red: "#8D1827",
          Green: "#315B45",
        } as Record<string, string>
      )[shade ?? ""] ??
      temporaryShade.hex;
    const displayShade = shade ?? temporaryShade.name;
    const fabric = cleanValue(record.fabric);
    const shortDescription = buildShortDescription(record);
    const slug = slugify(record.name);
    const paletteOptions = buildPalette(record, displayShade, shadeHex);
    const images = buildProductImages(record.name, slug, legacyFallback);
    const coverImage = images.find((image) => image.id === "hero") ?? images[0];
    const featuredImage = coverImage.src;

    return {
      id: record.id,
      slug,
      name: record.name,
      signatureName,
      collection: "Rangbastra Couture Edit",
      category: record.category,
      collectionIds: [slugify(record.category)],
      occasion: record.occasion,
      price: cleanValue(record.price),
      discount: formatDiscountLabel(record.discount),
      priceLabel: formatPriceLabel(record.price),
      startingPrice: getStartingPrice(record.price),
      discountLabel: formatDiscountLabel(record.discount),
      makingTime: normalizeMakingTime(record.makingTime),
      shade,
      shadeHex,
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
      gallery: images.map((image) => image.src),
      // Replace these placeholder URLs per product when dedicated photography is ready.
      // Repeated URLs are temporary legacy placeholders so all seven slots remain available.
      images,
      color: { name: displayShade, hex: shadeHex },
      paletteOptions,
      customization: { enabled: true, route: `/products/${slug}/customize` },
      status,
      editorialImpression:
        editorialImpressions[index % editorialImpressions.length],
      seo: {
        title: `${record.name} | Rangbastra Couture`,
        description: `${shortDescription} Explore craft, fabric, making time, and atelier details for this Rangbastra couture piece.`,
      },
      image: featuredImage,
      featured:
        status === "published" && [5, 9, 12, 16, 20, 21].includes(record.id),
      colorFamily: displayShade,
      palette: paletteOptions,
    };
  },
);

const expectedImageIds: CoutureImage["id"][] = [
  "hero",
  "front",
  "side",
  "back",
  "detail",
  "drape",
  "editorial",
];
const productKeys = new Set<string>();
for (const product of couturePieces) {
  if (productKeys.has(product.slug))
    throw new Error(`Duplicate couture product slug: ${product.slug}`);
  productKeys.add(product.slug);
  if (!product.images || product.images.length !== expectedImageIds.length)
    throw new Error(`${product.slug}: expected seven product image slots`);
  expectedImageIds.forEach((id) => {
    const image = product.images!.find((candidate) => candidate.id === id);
    if (!image?.src)
      throw new Error(`${product.slug}: missing ${id} image URL`);
    if (!/^https:\/\//.test(image.src))
      throw new Error(`${product.slug}: ${id} must use an HTTPS image URL`);
    if (
      image.src.includes("res.cloudinary.com") &&
      !/\/image\/upload\/v\d+\//.test(image.src)
    )
      throw new Error(
        `${product.slug}: ${id} Cloudinary URL must be versioned`,
      );
  });
  const hero = product.images.find((image) => image.id === "hero")!;
  if (
    product.image !== hero.src ||
    product.featuredImage !== hero.src ||
    product.gallery[0] !== hero.src
  )
    throw new Error(
      `${product.slug}: legacy image aliases must derive from the hero slot`,
    );
}
