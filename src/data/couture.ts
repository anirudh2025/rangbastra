import { cloudinaryImageUrl } from "../lib/cloudinary";

export type CoutureCategory =
  "Bridal" | "Festive" | "Reception" | "Engagement" | "Custom Couture";

export type CoutureStatus = "published" | "draft";

export interface CoutureEditorialImpression {
  label: string;
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

interface AuthoritativeProductData {
  label: string;
  tagline: string;
  collection: string;
  price: string;
  discount: string;
  makingTime: string;
  shade: string;
  shadeHex: string;
  fabric: string;
  handwork: string;
  style: string;
  motif: string | null;
  type: string;
  flare: string | null;
  usp: string | null;
  history: string | null;
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
    name: "Ayana",
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
    imageKey: "swatches",
  },
];

const authoritativeProductData: Record<string, AuthoritativeProductData> = {
  Gulnaar: {
    label: "Editor's Select",
    tagline: "Crafted for memories.",
    collection: "Couture Edit",
    price: "32000",
    discount: "5%",
    makingTime: "10-15 D",
    shade: "Dusty Rose",
    shadeHex: "#C78D97",
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads, 8inch Embroidery",
    style: "Anaarkali",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: null,
  },
  Elara: {
    label: "Must Experience",
    tagline: "Crafted for unforgettable entrances.",
    collection: "Festive Edit",
    price: "20000",
    discount: "5%",
    makingTime: "7-10 D",
    shade: "Royal Plum",
    shadeHex: "#5B294F",
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads, 8inch Embroidery",
    style: "Gown",
    motif: null,
    type: "Kali",
    flare: null,
    usp: null,
    history: null,
  },
  Noor: {
    label: "Rare Find",
    tagline: "Where light becomes luxury.",
    collection: "Signature Edit",
    price: "55000",
    discount: "5%",
    makingTime: "10-15 D",
    shade: "Blush Pearl",
    shadeHex: "#E6C7C9",
    fabric: "Tissue Fabric",
    handwork: "15 Border Embroidery",
    style: "Anaarkali",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: null,
  },
  Inaayat: {
    label: "One to Remember",
    tagline: "Where tradition blooms beautifully.",
    collection: "Couture Edit",
    price: "35000",
    discount: "5%",
    makingTime: "10-15 D",
    shade: "Pistachio Bloom",
    shadeHex: "#B8C995",
    fabric: "Banarasi Tissue Fabric",
    handwork: "Golden & Cotton Thread weaved, Mirror Work",
    style: "Anaarkali",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: "Banarasi Tissue",
  },
  Amaira: {
    label: "The Showstopper",
    tagline: "Crafted for moments that deserve celebration.",
    collection: "Bridal Edit",
    price: "135000/250000",
    discount: "7-10%",
    makingTime: "15-20 D",
    shade: "Sunlit Marigold",
    shadeHex: "#E7A51A",
    fabric: "Banarasi Silk Fabric, Maroon Patola, Green Monga Silk",
    handwork: "Same as Inaayat",
    style: "Lehenga Choli",
    motif: null,
    type: "Kali",
    flare: null,
    usp: "Monga Silk / Patola",
    history: "Monga Silk / Patola",
  },
  Naeyra: {
    label: "Pure Craftsmanship",
    tagline: "Every motif tells a beautiful story.",
    collection: "Signature Edit",
    price: "60000",
    discount: "5%",
    makingTime: "12-15 D",
    shade: "Lotus Blush",
    shadeHex: "#D79AA7",
    fabric: "Banarasi Tissue, Unlimited Colors",
    handwork: "Same as Inaayat, Resham Thread, Extra Beads",
    style: "Anaarkali",
    motif: "Elephant & Birds",
    type: "Pleated",
    flare: null,
    usp: null,
    history: "Banarasi Tissue",
  },
  Mahira: {
    label: "Bespoke Beauty",
    tagline: "Where florals bloom into couture.",
    collection: "Couture Edit",
    price: "25000",
    discount: "5%",
    makingTime: "7-10 D",
    shade: "Ruby Bloom",
    shadeHex: "#A92C49",
    fabric: "Printed Organza Georgette Fabric",
    handwork: "Only Mirror Work",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: null,
  },
  Ayana: {
    label: "Limited Highlight",
    tagline: "Where simplicity steals the spotlight.",
    collection: "Festive Edit",
    price: "18500",
    discount: "5%",
    makingTime: "6 D",
    shade: "Champagne Ivory",
    shadeHex: "#EFE3CB",
    fabric: "Printed Italian Crepe",
    handwork: "beads work",
    style: "Corset with Skirt",
    motif: null,
    type: "Pleated",
    flare: null,
    usp: null,
    history: null,
  },
  Iraaya: {
    label: "Elegant Choice",
    tagline: "Made to move with every celebration.",
    collection: "Signature Edit",
    price: "85000",
    discount: "7%",
    makingTime: "12-15 D",
    shade: "Imperial Voilet",
    shadeHex: "#5D418A",
    fabric: "Banarasi Silk",
    handwork: "Vintage tikki patchwork",
    style: "Lehenga Choli",
    motif: null,
    type: "Kali",
    flare: null,
    usp: null,
    history: "Vintage History",
  },
  Riva: {
    label: "Curated Luxury",
    tagline: "Elegance that speaks without words.",
    collection: "Bridal Edit",
    price: "103000",
    discount: "7%",
    makingTime: "15-18 D",
    shade: "Royal Mauve",
    shadeHex: "#8D647F",
    fabric: "Tissue Fabric",
    handwork: "18Inch border embroidery, same as gulnaar",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
  },
  Anaahita: {
    label: "Atelier Treasure",
    tagline: "Crafted for special occasions.",
    collection: "Bridal Edit",
    price: "112000",
    discount: "7%",
    makingTime: "15-20 D",
    shade: "Deep Plum",
    shadeHex: "#4F2045",
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
  },
  Aavya: {
    label: "Finest Creation",
    tagline: "Inspired by stories, made for celebrations.",
    collection: "Bridal Edit",
    price: "195000",
    discount: "Up to 7%",
    makingTime: "15-20 D",
    shade: "Mint Sage",
    shadeHex: "#A9BFA7",
    fabric: "georgette shimmer",
    handwork: "Pichwai art, tikki, beads, zardosi, resham thread",
    style: "Lehenga Choli",
    motif: null,
    type: "kali",
    flare: "5.5M",
    usp: "Embroidery",
    history: "Pichwai history",
  },
  Ziana: {
    label: "Made to Admire",
    tagline: "Grace that never asks for attention.",
    collection: "Signature Edit",
    price: "70000",
    discount: "5%",
    makingTime: "10-15 D",
    shade: "Pearl Mint",
    shadeHex: "#C8D8CC",
    fabric: "Tissue Fabric",
    handwork: "Silver Work, mirror, Zardosi, cutdana, resham",
    style: "Lehenga Choli",
    motif: null,
    type: "pleated",
    flare: "8M",
    usp: null,
    history: null,
  },
  Eiraa: {
    label: "Collector's Choice",
    tagline: "Made for moments that deserve to shine.",
    collection: "Signature Edit",
    price: "70000",
    discount: "5%",
    makingTime: "10-15 D",
    shade: "Pearl Pink",
    shadeHex: "#E8C8CD",
    fabric: "Tissue Fabric",
    handwork: "Silver Work, mirror, Zardosi, cutdana, resham",
    style: "Lehenga Choli",
    motif: null,
    type: "pleated",
    flare: "8M",
    usp: null,
    history: null,
  },
  Eshaira: {
    label: "Elegant Choice",
    tagline: "Made to move, made to mesmerize.",
    collection: "Festive Edit",
    price: "20000",
    discount: "5%",
    makingTime: "7-10 D",
    shade: "Fuchsia Pink",
    shadeHex: "#C73583",
    fabric: "Banarasi Silk",
    handwork: "mirror, beads, tikki, kasab, cutdana",
    style: "Corset with Skirt",
    motif: null,
    type: "kali",
    flare: "6M",
    usp: "Banarasi Silk",
    history: "Fabric History",
  },
  Ruhaaya: {
    label: "Signature Piece",
    tagline: "A celebration woven in colour.",
    collection: "Bridal Edit",
    price: "125000",
    discount: "7%",
    makingTime: "15-20 D",
    shade: "Coral Bloom",
    shadeHex: "#DD726D",
    fabric: "Banarasi Silk + Banarasi Minakari Dupatta",
    handwork: "mirror, beads, tikki, kasab, cutdana, resham work",
    style: "Lehenga Choli",
    motif: null,
    type: "pleated",
    flare: "8M",
    usp: "Banarasi Silk",
    history: "Fabric History",
  },
  Lavanya: {
    label: "Royal Selection",
    tagline: "Artistry stitched into every thread.",
    collection: "Signature Edit",
    price: "85000",
    discount: "7%",
    makingTime: "15-20 D",
    shade: "Midnight Plum",
    shadeHex: "#37233F",
    fabric: "Organza fabric",
    handwork: "mirror, beads, tikki, kasab, cutdana, resham work",
    style: "Lehenga Choli",
    motif: "Hand painted with embroidery",
    type: "Kali",
    flare: "6M",
    usp: "Hand Painted",
    history: "Motif History",
  },
  Varnika: {
    label: "Statement Piece",
    tagline: "A masterpiece woven in vibrant harmony.",
    collection: "Signature Edit",
    price: "97000",
    discount: "7%",
    makingTime: "15-20 D",
    shade: "Mulberry Wine",
    shadeHex: "#71344D",
    fabric: "Moonga silk + Rajkot silk + Tissue",
    handwork: "mirror, beads, tikki, kasab, cutdana, resham work",
    style: "Lehenga Choli",
    motif: null,
    type: "pleated",
    flare: "6.5M",
    usp: "Moonga silk",
    history: "Fabric History",
  },
  Mishka: {
    label: "Celebration Ready",
    tagline: "Fresh florals, forever festive.",
    collection: "Festive Edit",
    price: "25000",
    discount: "7%",
    makingTime: "7-10 D",
    shade: "Emerald Green",
    shadeHex: "#176B52",
    fabric: "Organza fabric",
    handwork: "zardosi, mirror",
    style: "Lehenga Choli",
    motif: null,
    type: "umbrella",
    flare: "6.5M",
    usp: null,
    history: null,
  },
  Aureya: {
    label: "Eternal Grace",
    tagline: "Bold lines. Timeless luxury.",
    collection: "Signature Edit",
    price: "135000",
    discount: "5%",
    makingTime: "15-20 D",
    shade: "Burnt Orange",
    shadeHex: "#C65A2E",
    fabric: "Banarasi silk + Bandhej gaji silk",
    handwork: "beads, zardosi, tikki, kasab, cutdana",
    style: "Lehenga Choli",
    motif: "Bird",
    type: "pleated",
    flare: "7.5M",
    usp: "Banarasi Silk, bandhej",
    history: "Fabric History",
  },
  Zavira: {
    label: "RB Recommends",
    tagline: "Royal elegance, redefined.",
    collection: "Signature Edit",
    price: "125000",
    discount: "7%",
    makingTime: "15-20 D",
    shade: "Turquoise Blue",
    shadeHex: "#2B9FA0",
    fabric: "Banglori silk + Banarasi georgette bandhej",
    handwork: "beads, zardosi, tikki, kasab, cutdana, resham work",
    style: "Lehenga Choli",
    motif: null,
    type: "kali",
    flare: "5.5M",
    usp: "bandhej",
    history: "Fabric History",
  },
  Sahira: {
    label: "Spotlight Edition",
    tagline: "Grace, stitched in every detail.",
    collection: "Signature Edit",
    price: "97000",
    discount: "7%",
    makingTime: "15-20 D",
    shade: "Lavender Voilet",
    shadeHex: "#9A83C5",
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
  },
  Nirvi: {
    label: "Gracefully Chosen",
    tagline: "Light as a breeze, made to shine.",
    collection: "Festive Edit",
    price: "18500",
    discount: "7%",
    makingTime: "5-7 D",
    shade: "Aqua Blue",
    shadeHex: "#72C7CF",
    fabric: "georgette",
    handwork: "cutdana, sequin, beads",
    style: "Lehenga Choli",
    motif: null,
    type: "pleated",
    flare: "6.5M",
    usp: null,
    history: null,
  },
  Aarini: {
    label: "Crafted to Shine",
    tagline: "Quiet elegance that speaks volumes.",
    collection: "Festive Edit",
    price: "16500",
    discount: "5%",
    makingTime: "15-20 D",
    shade: "Champagne Gold",
    shadeHex: "#C8A76B",
    fabric: "Banarasi tissue",
    handwork: "zardosi, sequin, resham",
    style: "Lehenga Choli",
    motif: null,
    type: "kali",
    flare: "5.5M",
    usp: "Banarasi tissue",
    history: "Fabric History",
  },
  Bahaar: {
    label: "Modern Classic",
    tagline: "Where every bloom becomes a celebration.",
    collection: "Signature Edit",
    price: "97000",
    discount: "7%",
    makingTime: "15-20 D",
    shade: "Celery Green",
    shadeHex: "#A8B789",
    fabric: "Tissue Fabric",
    handwork: "Cutdana, Tikki, Kasab, Beads",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "8M",
    usp: null,
    history: null,
  },
  Tiara: {
    label: "Premium Pick",
    tagline: "Every entrance deserves a crown.",
    collection: "Bridal Edit",
    price: "65000",
    discount: "5%",
    makingTime: "7-10 D",
    shade: "Pearl Ivory",
    shadeHex: "#EFE9DB",
    fabric: "georgette fabric",
    handwork: "cutdana, mirror work",
    style: "Lehenga Choli",
    motif: null,
    type: "kali",
    flare: "5.5M",
    usp: null,
    history: null,
  },
  Chaarvi: {
    label: "Most Loved",
    tagline: "Where colours learn to dance.",
    collection: "Signature Edit",
    price: "67000",
    discount: "Up to 7%",
    makingTime: "7-10 D",
    shade: "Jewel Green",
    shadeHex: "#17634A",
    fabric: "Banarasi silk",
    handwork: "Traditional Patchwork + Mirror Work",
    style: "Lehenga Choli",
    motif: null,
    type: "Pleated",
    flare: "5M",
    usp: "Banarasi Silk, Traditional Patch",
    history: "Banarasi Silk, Traditional Patch",
  },
};

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
    cloudinaryImageUrl("gulnaar-web-01"), // 01 hero
    cloudinaryImageUrl("gulnaar-web-02"), // 02 front
    cloudinaryImageUrl("gulnaar-web-03"), // 03 side
    cloudinaryImageUrl("gulnaar-web-04"), // 04 back
    cloudinaryImageUrl("gulnaar-web-05"), // 05 detail
    cloudinaryImageUrl("gulnaar-web-06"), // 06 drape
    cloudinaryImageUrl("gulnaar-web-01"), // 07 editorial
  ],
  elara: [
    cloudinaryImageUrl("elara-web-01"), // 01 hero
    cloudinaryImageUrl("elara-web-02"), // 02 front
    cloudinaryImageUrl("elara-web-03"), // 03 side
    cloudinaryImageUrl("elara-web-04"), // 04 back
    cloudinaryImageUrl("elara-web-05"), // 05 detail
    cloudinaryImageUrl("elara-web-06"), // 06 drape
    cloudinaryImageUrl("elara-web-01"), // 07 editorial
  ],
  noor: [
    cloudinaryImageUrl("noor-web-01"), // 01 hero
    cloudinaryImageUrl("noor-web-02"), // 02 front
    cloudinaryImageUrl("noor-web-03"), // 03 side
    cloudinaryImageUrl("noor-web-04"), // 04 back
    cloudinaryImageUrl("noor-web-05"), // 05 detail
    cloudinaryImageUrl("noor-web-06"), // 06 drape
    cloudinaryImageUrl("noor-web-07"), // 07 editorial
  ],
  inaayat: [
    cloudinaryImageUrl("inaayat-web-01"), // 01 hero
    cloudinaryImageUrl("inaayat-web-02"), // 02 front
    cloudinaryImageUrl("inaayat-web-03"), // 03 side
    cloudinaryImageUrl("inaayat-web-04"), // 04 back
    cloudinaryImageUrl("inaayat-web-05"), // 05 detail
    cloudinaryImageUrl("inaayat-web-06"), // 06 drape
    cloudinaryImageUrl("inaayat-web-07"), // 07 editorial
  ],
  amaira: [
    cloudinaryImageUrl("amaira-web-01"), // 01 hero
    cloudinaryImageUrl("amaira-web-02"), // 02 front
    cloudinaryImageUrl("amaira-web-03"), // 03 side
    cloudinaryImageUrl("amaira-web-04"), // 04 back
    cloudinaryImageUrl("amaira-web-05"), // 05 detail
    cloudinaryImageUrl("amaira-web-06"), // 06 drape
    cloudinaryImageUrl("amaira-web-01"), // 07 editorial
  ],
  naeyra: [
    cloudinaryImageUrl("naeyra-web-01"), // 01 hero
    cloudinaryImageUrl("naeyra-web-02"), // 02 front
    cloudinaryImageUrl("naeyra-web-03"), // 03 side
    cloudinaryImageUrl("naeyra-web-04"), // 04 back
    cloudinaryImageUrl("naeyra-web-05"), // 05 detail
    cloudinaryImageUrl("naeyra-web-06"), // 06 drape
    cloudinaryImageUrl("naeyra-web-01"), // 07 editorial
  ],
  mahira: [
    cloudinaryImageUrl("mahira-web-01"), // 01 hero
    cloudinaryImageUrl("mahira-web-02"), // 02 front
    cloudinaryImageUrl("mahira-web-03"), // 03 side
    cloudinaryImageUrl("mahira-web-04"), // 04 back
    cloudinaryImageUrl("mahira-web-05"), // 05 detail
    cloudinaryImageUrl("mahira-web-06"), // 06 drape
    cloudinaryImageUrl("mahira-web-07"), // 07 editorial
  ],
  ayana: [
    cloudinaryImageUrl("ayana-web-01"), // 01 hero
    cloudinaryImageUrl("ayana-web-02"), // 02 front
    cloudinaryImageUrl("ayana-web-03"), // 03 side
    cloudinaryImageUrl("ayana-web-04"), // 04 back
    cloudinaryImageUrl("ayana-web-05"), // 05 detail
    cloudinaryImageUrl("ayana-web-06"), // 06 drape
    cloudinaryImageUrl("ayana-web-07"), // 07 editorial
  ],
  iraaya: [
    cloudinaryImageUrl("iraaya-web-01"), // 01 hero
    cloudinaryImageUrl("iraaya-web-02"), // 02 front
    cloudinaryImageUrl("iraaya-web-03"), // 03 side
    cloudinaryImageUrl("iraaya-web-04"), // 04 back
    cloudinaryImageUrl("iraaya-web-05"), // 05 detail
    cloudinaryImageUrl("iraaya-web-06"), // 06 drape
    cloudinaryImageUrl("iraaya-web-07"), // 07 editorial
  ],
  riva: [
    cloudinaryImageUrl("riva-web-01"), // 01 hero
    cloudinaryImageUrl("riva-web-02"), // 02 front
    cloudinaryImageUrl("riva-web-03"), // 03 side
    cloudinaryImageUrl("riva-web-04"), // 04 back
    cloudinaryImageUrl("riva-web-05"), // 05 detail
    cloudinaryImageUrl("riva-web-06"), // 06 drape
    cloudinaryImageUrl("riva-web-07"), // 07 editorial
  ],
  anaahita: [
    cloudinaryImageUrl("anaahita-web-01"), // 01 hero
    cloudinaryImageUrl("anaahita-web-02"), // 02 front
    cloudinaryImageUrl("anaahita-web-03"), // 03 side
    cloudinaryImageUrl("anaahita-web-04"), // 04 back
    cloudinaryImageUrl("anaahita-web-05"), // 05 detail
    cloudinaryImageUrl("anaahita-web-06"), // 06 drape
    cloudinaryImageUrl("anaahita-web-07"), // 07 editorial
  ],
  aavya: [
    cloudinaryImageUrl("aavya-web-01"), // 01 hero
    cloudinaryImageUrl("aavya-web-02"), // 02 front
    cloudinaryImageUrl("aavya-web-03"), // 03 side
    cloudinaryImageUrl("aavya-web-04"), // 04 back
    cloudinaryImageUrl("aavya-web-05"), // 05 detail
    cloudinaryImageUrl("aavya-web-06"), // 06 drape
    cloudinaryImageUrl("aavya-web-07"), // 07 editorial
  ],
  ziana: [
    cloudinaryImageUrl("ziana-web-01"), // 01 hero
    cloudinaryImageUrl("ziana-web-02"), // 02 front
    cloudinaryImageUrl("ziana-web-03"), // 03 side
    cloudinaryImageUrl("ziana-web-04"), // 04 back
    cloudinaryImageUrl("ziana-web-05"), // 05 detail
    cloudinaryImageUrl("ziana-web-06"), // 06 drape
    cloudinaryImageUrl("ziana-web-07"), // 07 editorial
  ],
  eiraa: [
    cloudinaryImageUrl("eiraa-web-01"), // 01 hero
    cloudinaryImageUrl("eiraa-web-02"), // 02 front
    cloudinaryImageUrl("eiraa-web-03"), // 03 side
    cloudinaryImageUrl("eiraa-web-04"), // 04 back
    cloudinaryImageUrl("eiraa-web-05"), // 05 detail
    cloudinaryImageUrl("eiraa-web-06"), // 06 drape
    cloudinaryImageUrl("eiraa-web-07"), // 07 editorial
  ],
  eshaira: [
    cloudinaryImageUrl("eshaira-web-01"), // 01 hero
    cloudinaryImageUrl("eshaira-web-02"), // 02 front
    cloudinaryImageUrl("eshaira-web-03"), // 03 side
    cloudinaryImageUrl("eshaira-web-04"), // 04 back
    cloudinaryImageUrl("eshaira-web-05"), // 05 detail
    cloudinaryImageUrl("eshaira-web-06"), // 06 drape
    cloudinaryImageUrl("eshaira-web-07"), // 07 editorial
  ],
  ruhaaya: [
    cloudinaryImageUrl("ruhaaya-web-01"), // 01 hero
    cloudinaryImageUrl("ruhaaya-web-02"), // 02 front
    cloudinaryImageUrl("ruhaaya-web-03"), // 03 side
    cloudinaryImageUrl("ruhaaya-web-04"), // 04 back
    cloudinaryImageUrl("ruhaaya-web-05"), // 05 detail
    cloudinaryImageUrl("ruhaaya-web-06"), // 06 drape
    cloudinaryImageUrl("ruhaaya-web-07"), // 07 editorial
  ],
  lavanya: [
    cloudinaryImageUrl("lavanya-web-01"), // 01 hero
    cloudinaryImageUrl("lavanya-web-02"), // 02 front
    cloudinaryImageUrl("lavanya-web-03"), // 03 side
    cloudinaryImageUrl("lavanya-web-04"), // 04 back
    cloudinaryImageUrl("lavanya-web-05"), // 05 detail
    cloudinaryImageUrl("lavanya-web-06"), // 06 drape
    cloudinaryImageUrl("lavanya-web-07"), // 07 editorial
  ],
  varnika: [
    cloudinaryImageUrl("varnika-web-01"), // 01 hero
    cloudinaryImageUrl("varnika-web-02"), // 02 front
    cloudinaryImageUrl("varnika-web-03"), // 03 side
    cloudinaryImageUrl("varnika-web-04"), // 04 back
    cloudinaryImageUrl("varnika-web-05"), // 05 detail
    cloudinaryImageUrl("varnika-web-06"), // 06 drape
    cloudinaryImageUrl("varnika-web-07"), // 07 editorial
  ],
  mishka: [
    cloudinaryImageUrl("mishka-web-01"), // 01 hero
    cloudinaryImageUrl("mishka-web-02"), // 02 front
    cloudinaryImageUrl("mishka-web-03"), // 03 side
    cloudinaryImageUrl("mishka-web-04"), // 04 back
    cloudinaryImageUrl("mishka-web-05"), // 05 detail
    cloudinaryImageUrl("mishka-web-06"), // 06 drape
    cloudinaryImageUrl("mishka-web-07"), // 07 editorial
  ],
  aureya: [
    cloudinaryImageUrl("aureya-web-01"), // 01 hero
    cloudinaryImageUrl("aureya-web-02"), // 02 front
    cloudinaryImageUrl("aureya-web-03"), // 03 side
    cloudinaryImageUrl("aureya-web-04"), // 04 back
    cloudinaryImageUrl("aureya-web-05"), // 05 detail
    cloudinaryImageUrl("aureya-web-06"), // 06 drape
    cloudinaryImageUrl("aureya-web-07"), // 07 editorial
  ],
  zavira: [
    cloudinaryImageUrl("zavira-web-01"), // 01 hero
    cloudinaryImageUrl("zavira-web-02"), // 02 front
    cloudinaryImageUrl("zavira-web-03"), // 03 side
    cloudinaryImageUrl("zavira-web-04"), // 04 back
    cloudinaryImageUrl("zavira-web-05"), // 05 detail
    cloudinaryImageUrl("zavira-web-06"), // 06 drape
    cloudinaryImageUrl("zavira-web-07"), // 07 editorial
  ],
  sahira: [
    cloudinaryImageUrl("sahira-web-01"), // 01 hero
    cloudinaryImageUrl("sahira-web-02"), // 02 front
    cloudinaryImageUrl("sahira-web-03"), // 03 side
    cloudinaryImageUrl("sahira-web-04"), // 04 back
    cloudinaryImageUrl("sahira-web-05"), // 05 detail
    cloudinaryImageUrl("sahira-web-06"), // 06 drape
    cloudinaryImageUrl("sahira-web-07"), // 07 editorial
  ],
  nirvi: [
    cloudinaryImageUrl("nirvi-web-01"), // 01 hero
    cloudinaryImageUrl("nirvi-web-02"), // 02 front
    cloudinaryImageUrl("nirvi-web-03"), // 03 side
    cloudinaryImageUrl("nirvi-web-04"), // 04 back
    cloudinaryImageUrl("nirvi-web-05"), // 05 detail
    cloudinaryImageUrl("nirvi-web-06"), // 06 drape
    cloudinaryImageUrl("nirvi-web-07"), // 07 editorial
  ],
  aarini: [
    cloudinaryImageUrl("aarini-web-01"), // 01 hero
    cloudinaryImageUrl("aarini-web-02"), // 02 front
    cloudinaryImageUrl("aarini-web-03"), // 03 side
    cloudinaryImageUrl("aarini-web-04"), // 04 back
    cloudinaryImageUrl("aarini-web-05"), // 05 detail
    cloudinaryImageUrl("aarini-web-06"), // 06 drape
    cloudinaryImageUrl("aarini-web-07"), // 07 editorial
  ],
  bahaar: [
    cloudinaryImageUrl("bahaar-web-01"), // 01 hero
    cloudinaryImageUrl("bahaar-web-02"), // 02 front
    cloudinaryImageUrl("bahaar-web-03"), // 03 side
    cloudinaryImageUrl("bahaar-web-04"), // 04 back
    cloudinaryImageUrl("bahaar-web-05"), // 05 detail
    cloudinaryImageUrl("bahaar-web-06"), // 06 drape
    cloudinaryImageUrl("bahaar-web-07"), // 07 editorial
  ],
  tiara: [
    cloudinaryImageUrl("tiara-web-01"), // 01 hero
    cloudinaryImageUrl("tiara-web-02"), // 02 front
    cloudinaryImageUrl("tiara-web-03"), // 03 side
    cloudinaryImageUrl("tiara-web-04"), // 04 back
    cloudinaryImageUrl("tiara-web-05"), // 05 detail
    cloudinaryImageUrl("tiara-web-06"), // 06 drape
    cloudinaryImageUrl("tiara-web-07"), // 07 editorial
  ],
  chaarvi: [
    cloudinaryImageUrl("chaarvi-web-01"), // 01 hero
    cloudinaryImageUrl("chaarvi-web-02"), // 02 front
    cloudinaryImageUrl("chaarvi-web-03"), // 03 side
    cloudinaryImageUrl("chaarvi-web-04"), // 04 back
    cloudinaryImageUrl("chaarvi-web-05"), // 05 detail
    cloudinaryImageUrl("chaarvi-web-06"), // 06 drape
    cloudinaryImageUrl("chaarvi-web-07"), // 07 editorial
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
 * These remain a defensive fallback for any future incomplete source record.
 * Every product in the current authoritative catalogue supplies its own shade.
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
  (sourceRecord, index) => {
    const authoritative = authoritativeProductData[sourceRecord.name];
    if (!authoritative) {
      throw new Error(
        `${sourceRecord.name}: missing authoritative catalogue data`,
      );
    }
    const record = { ...sourceRecord, ...authoritative };
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
    const shortDescription =
      record.tagline || buildShortDescription(record);
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
      collection: record.collection,
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
      editorialImpression: {
        ...editorialImpressions[index % editorialImpressions.length],
        label: record.label,
        text: record.tagline,
      },
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
      !/\/image\/upload\/v\d+\//.test(image.src) &&
      !/^https:\/\/res\.cloudinary\.com\/cloutoraworld\/image\/upload\/f_webp,q_95\/[A-Za-z0-9/_-]+\.webp$/.test(
        image.src,
      )
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
