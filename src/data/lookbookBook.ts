export interface LookbookPage {
  id: string;
  kind: "cover" | "contents" | "editorial";
  eyebrow: string;
  title: string;
  copy: string;
  image?: string;
  imageAlt?: string;
  annotation?: string;
  pieceSlug?: string;
}
export const lookbookPages: LookbookPage[] = [
  {
    id: "cover",
    kind: "cover",
    eyebrow: "Lookbook · Volume 01",
    title: "Stories in silhouette",
    copy: "An original Rangbastra editorial sequence for bridal and occasion couture.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
    imageAlt: "Rangbastra couture photographed for the editorial lookbook",
  },
  {
    id: "contents",
    kind: "contents",
    eyebrow: "Contents",
    title: "Inside this volume",
    copy: "Ceremony / Evening / Celebration / The atelier",
  },
  {
    id: "ceremony",
    kind: "editorial",
    eyebrow: "Chapter One",
    title: "Ceremony, held close",
    copy: "A study of colour, proportion and ceremonial presence.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    imageAlt: "Bridal couture in a ceremonial editorial portrait",
    annotation:
      "Layered lehenga · contrasting drape · handcrafted surface detail",
    pieceSlug: "amaira",
  },
  {
    id: "ceremony-detail",
    kind: "editorial",
    eyebrow: "Garment Note",
    title: "Built around movement",
    copy: "The silhouette is read from a respectful distance, then through the smaller details that hold the composition together.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Crafted_with_Precision_yh1xgw.webp",
    imageAlt: "Close editorial view of Rangbastra craftsmanship",
    annotation: "Detail study · atelier-selected finish",
    pieceSlug: "gulnaar",
  },
  {
    id: "evening",
    kind: "editorial",
    eyebrow: "Chapter Two",
    title: "After-dark poise",
    copy: "An evening frame shaped by a quieter palette and sculptural fall.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    imageAlt: "Rangbastra evening couture editorial portrait",
    annotation: "Evening silhouette · jewel-tone direction",
    pieceSlug: "elara",
  },
  {
    id: "celebration",
    kind: "editorial",
    eyebrow: "Chapter Three",
    title: "Colour in motion",
    copy: "Celebration dressing that keeps expression, comfort and personal presence in balance.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Festive_Edit_boj0wo.webp",
    imageAlt: "Festive Rangbastra couture in an editorial frame",
    annotation: "Festive palette · fluid occasion silhouette",
    pieceSlug: "noor",
  },
  {
    id: "atelier",
    kind: "editorial",
    eyebrow: "Final Chapter",
    title: "Before the first sketch",
    copy: "Every custom piece begins with context: the occasion, the wearer and the feeling she wants to carry.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Consult_Our_Designer_pbxliz.webp",
    imageAlt: "A private Rangbastra designer consultation",
    annotation: "Private consultation · custom direction",
  },
  {
    id: "closing",
    kind: "editorial",
    eyebrow: "End Note",
    title: "Continue the story",
    copy: "Return to the collection or begin a private design conversation.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/RB_Fabric_Swatches_ortjph.webp",
    imageAlt: "Rangbastra fabric swatches arranged in the atelier",
  },
];
