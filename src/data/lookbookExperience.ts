export type LookbookFrame = "portrait" | "landscape" | "square" | "feature" | "wide" | "tall";

export interface EditorialShoot {
  title: string;
  issue: string;
  image: string;
  caption: string;
}

export interface LookbookImage {
  id: string;
  title: string;
  collection: string;
  caption: string;
  image: string;
  frame: LookbookFrame;
}

export interface LookbookProcessStep {
  title: string;
  text: string;
  icon: string;
}

export const lookbookExperienceImages = {
  hero:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
  editorsNote:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
  behindFrame:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Consult_Our_Designer_pbxliz.webp",
  quote:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Crafted_with_Precision_yh1xgw.webp",
};

export const editorialShoots: EditorialShoot[] = [
  {
    title: "Bridal Edit",
    issue: "The ceremony chapter",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    caption: "A bridal story composed around stillness, ritual and memory.",
  },
  {
    title: "Reception Edit",
    issue: "After-dark elegance",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
    caption: "Evening silhouettes photographed with movement and restraint.",
  },
  {
    title: "Festive Edit",
    issue: "Colour in quiet motion",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Festive_Edit_boj0wo.webp",
    caption: "Celebration pieces framed as intimate moments, not catalogue entries.",
  },
  {
    title: "Heritage Edit",
    issue: "The heirloom mood",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    caption: "Textile memory, craft and proportion held in a quieter frame.",
  },
  {
    title: "Minimal Edit",
    issue: "Less, held beautifully",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/RB_Fabric_Swatches_ortjph.webp",
    caption: "A study in surface, fabric and the luxury of restraint.",
  },
  {
    title: "Modern Bride",
    issue: "Personal presence",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Celebrate_Beautifully_pgr9c6.webp",
    caption: "A bride photographed as herself before she is photographed as fashion.",
  },
  {
    title: "Signature Edit",
    issue: "The Rangbastra frame",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Crafted_with_Precision_yh1xgw.webp",
    caption: "An editorial world where craft and emotion share the same light.",
  },
];

export const lookbookMasonry: LookbookImage[] = [
  {
    id: "bridal-quiet",
    title: "The Bridal Quiet",
    collection: "Bridal Edit",
    caption: "A silhouette made for the pause before the celebration begins.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    frame: "feature",
  },
  {
    id: "modern-heirloom",
    title: "Modern Heirloom",
    collection: "Heritage Edit",
    caption: "Couture detail with the restraint of a piece meant to be kept.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    frame: "portrait",
  },
  {
    id: "evening-movement",
    title: "Evening Movement",
    collection: "Reception Edit",
    caption: "Fabric, light and proportion meeting in a single gesture.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
    frame: "landscape",
  },
  {
    id: "festive-stillness",
    title: "Festive Stillness",
    collection: "Festive Edit",
    caption: "A composed moment for colour, memory and celebration.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Festive_Edit_boj0wo.webp",
    frame: "tall",
  },
  {
    id: "fabric-language",
    title: "Fabric Language",
    collection: "Minimal Edit",
    caption: "Texture photographed close enough to feel like a page you can touch.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/RB_Fabric_Swatches_ortjph.webp",
    frame: "wide",
  },
  {
    id: "designer-conversation",
    title: "The First Conversation",
    collection: "Modern Bride",
    caption: "A design moment before the garment enters the frame.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Consult_Our_Designer_pbxliz.webp",
    frame: "square",
  },
  {
    id: "handwork-close",
    title: "Handwork Close",
    collection: "Signature Edit",
    caption: "Embroidery photographed as a quiet act of patience.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Crafted_with_Precision_yh1xgw.webp",
    frame: "portrait",
  },
  {
    id: "final-story",
    title: "Final Story",
    collection: "Modern Bride",
    caption: "The final frame belongs to emotion before it belongs to fashion.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Celebrate_Beautifully_pgr9c6.webp",
    frame: "landscape",
  },
];

export const creativeProcess: LookbookProcessStep[] = [
  {
    title: "Concept",
    text: "Every shoot begins with the feeling of the collection, not a list of garments.",
    icon: "sparkle",
  },
  {
    title: "Styling",
    text: "Jewellery, drape, hair and posture are composed to support the wearer.",
    icon: "signature",
  },
  {
    title: "Customization",
    text: "Details are adjusted until the visual story feels intimate and specific.",
    icon: "customCouture",
  },
  {
    title: "Photography",
    text: "The frame is held quietly, allowing craft and emotion to arrive together.",
    icon: "mirrorWork",
  },
  {
    title: "Final Story",
    text: "Images are edited as chapters, each one preserving mood over volume.",
    icon: "delivery",
  },
];

export const signatureDetails: LookbookImage[] = [
  {
    id: "embroidery-detail",
    title: "Embroidery",
    collection: "Signature Detail",
    caption: "Handwork placed with patience and proportion.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Crafted_with_Precision_yh1xgw.webp",
    frame: "portrait",
  },
  {
    id: "fabric-detail",
    title: "Fabric",
    collection: "Signature Detail",
    caption: "A surface story told through weave, fall and light.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/RB_Fabric_Swatches_ortjph.webp",
    frame: "landscape",
  },
  {
    id: "mirror-detail",
    title: "Mirror Work",
    collection: "Signature Detail",
    caption: "Small reflections held inside a larger couture mood.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    frame: "portrait",
  },
  {
    id: "handwork-detail",
    title: "Handwork",
    collection: "Signature Detail",
    caption: "The hand remains visible in the rhythm of the finish.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    frame: "portrait",
  },
  {
    id: "texture-detail",
    title: "Texture",
    collection: "Signature Detail",
    caption: "Close enough to notice restraint before ornament.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Festive_Edit_boj0wo.webp",
    frame: "landscape",
  },
  {
    id: "jewellery-detail",
    title: "Jewellery Pairing",
    collection: "Signature Detail",
    caption: "A final note that completes the frame without overtaking it.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Celebrate_Beautifully_pgr9c6.webp",
    frame: "portrait",
  },
];

export const campaignTimeline = [
  {
    year: "2026",
    title: "Stories Woven Into Style",
    text: "Editorial frames become quieter, more intimate and more centered on the woman.",
  },
  {
    year: "2025",
    title: "Signature Edit",
    text: "Craft, silhouette and memory are photographed as one emotional language.",
  },
  {
    year: "2024",
    title: "Modern Bride",
    text: "A softer visual chapter begins around personal presence and movement.",
  },
  {
    year: "Earlier",
    title: "The First Frames",
    text: "Rangbastra begins treating every image as a story rather than proof.",
  },
];
