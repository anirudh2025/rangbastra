export interface BrideStory {
  slug: string;
  status: "demo" | "published";
  brideName: string;
  city: string;
  occasion: string;
  weddingContext: string;
  chapterTitle: string;
  garment: string;
  quote: string;
  image: string;
  imageAlt: string;
  gallery: Array<{ src: string; alt: string }>;
  relatedPieceSlugs: string[];
  source: string | null;
  consentConfirmed: boolean;
  verifiedTestimonial: boolean;
}

/**
 * PREVIEW-ONLY DEMO RECORD.
 * Replace with an owner-approved story, written consent/source, genuine quote,
 * and bride-owned media before any production merge. Demo records must never be
 * described as real testimonials or marked verified.
 */
export const brideStories: BrideStory[] = [{
  slug: "preview-story-format",
  status: "demo",
  brideName: "Preview story",
  city: "Location pending consent",
  occasion: "Wedding context preview",
  weddingContext: "This layout demonstrates where an owner-approved wedding date, location and celebration context will appear.",
  chapterTitle: "A bride story, shared with permission",
  garment: "Garment details pending owner-approved story",
  quote: "Testimonial quote intentionally withheld until a bride supplies it with publishing consent.",
  image: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
  imageAlt: "Rangbastra editorial couture placeholder for the preview story format",
  gallery: [
    { src: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp", alt: "Preview gallery placeholder for a future consented bride story" },
    { src: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp", alt: "Second preview gallery placeholder for a future consented bride story" },
  ],
  relatedPieceSlugs: ["amaira"],
  source: null,
  consentConfirmed: false,
  verifiedTestimonial: false,
}];
