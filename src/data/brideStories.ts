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
 * Production stories must include an owner-verified source, recorded publishing
 * consent and bride-owned or licensed media. Preview/demo records intentionally
 * live outside this production data module.
 */
export const brideStories: BrideStory[] = [];
