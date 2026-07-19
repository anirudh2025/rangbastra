export interface Collection {

    title:string;

    subtitle:string;

    image:string;

    href:string;

}

export const collections:Collection[]=[

{
title:"Signature Edit",
subtitle:"Signature Wedding Collection",
image:"https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
href:"/collections"
},

{
title:"Bridal Edit",
subtitle:"Evening Luxury",
image:"https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
href:"/collections"
},

{
title:"Couture Edit",
subtitle:"Joyful Celebrations",
image:"https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
href:"/collections"
},

{
title:"Festive Edit",
subtitle:"Modern Glamour",
image:"https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Festive_Edit_boj0wo.webp",    
href:"/collections"
}

];

export type CollectionPersonaId = "bridal" | "festive" | "reception" | "engagement";

export interface CollectionPersona {
  id: CollectionPersonaId;
  eyebrow: string;
  heading: string;
  statement: string;
  introduction: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  accent: string;
  motion: "ceremonial" | "luminous" | "poised" | "romantic";
  cta: string;
}

export const collectionPersonas: Record<CollectionPersonaId, CollectionPersona> = {
  bridal: {
    id: "bridal",
    eyebrow: "Bridal Couture",
    heading: "Ceremony, held close",
    statement: "Heirloom silhouettes for a deeply personal beginning.",
    introduction: "Bridal couture composed with intimate detail, considered proportion and the quiet permanence of pieces made to become memory.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    imageAlt: "Rangbastra bridal couture in an intimate ceremonial setting",
    imagePosition: "50% 34%",
    accent: "104 52 47",
    motion: "ceremonial",
    cta: "Begin Your Bridal Story",
  },
  festive: {
    id: "festive",
    eyebrow: "Festive Edit",
    heading: "Joy, made luminous",
    statement: "Expressive couture for celebrations in full colour.",
    introduction: "Festive pieces shaped through fluid movement, vivid craft and a confident glow that remains distinctly personal.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Festive_Edit_boj0wo.webp",
    imageAlt: "Rangbastra festive couture with luminous handcrafted detail",
    imagePosition: "50% 38%",
    accent: "128 70 44",
    motion: "luminous",
    cta: "Create Your Festive Look",
  },
  reception: {
    id: "reception",
    eyebrow: "Reception",
    heading: "Poise after dusk",
    statement: "Sculptural silhouettes with an evening presence.",
    introduction: "Reception couture balancing architectural drape, restrained lustre and a composed confidence designed for the night.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    imageAlt: "Rangbastra reception couture styled for an evening celebration",
    imagePosition: "50% 30%",
    accent: "83 50 62",
    motion: "poised",
    cta: "Shape Your Evening Look",
  },
  engagement: {
    id: "engagement",
    eyebrow: "Engagement",
    heading: "A promise in detail",
    statement: "Romantic couture for the celebration before forever.",
    introduction: "Engagement silhouettes with refined texture, gentle radiance and thoughtful detail for a moment filled with anticipation.",
    image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
    imageAlt: "Rangbastra engagement couture with refined romantic detailing",
    imagePosition: "50% 36%",
    accent: "112 71 76",
    motion: "romantic",
    cta: "Begin Your Engagement Edit",
  },
};
