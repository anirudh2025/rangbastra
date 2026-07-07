import { getWhatsAppHref, whatsappMessages } from "./contact";

export const designYourOutfitImages = {
  hero:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
  invitation:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Consult_Our_Designer_pbxliz.webp",
};

export const designYourOutfitWhatsappMessage = [
  whatsappMessages.designYourOutfit,
  "Event:",
  "City:",
  "Preferred Date:",
].join("\n");

export const designYourOutfitWhatsappHref = getWhatsAppHref(designYourOutfitWhatsappMessage);

export interface DesignTimelineStep {
  title: string;
  text: string;
  icon: string;
}

export interface DesignOption {
  title: string;
  text: string;
  icon: string;
  value: string;
}

export interface DesignPromise {
  title: string;
  text: string;
  icon: string;
}

export interface DesignFaq {
  question: string;
  answer: string;
}

export const whatHappensNext: DesignTimelineStep[] = [
  {
    title: "We Receive Your Story",
    text: "Your enquiry is read as a beginning, not a ticket. The design team looks for the occasion, mood and details that matter.",
    icon: "signature",
  },
  {
    title: "Private Conversation",
    text: "A calm follow-up helps us understand your celebration, comfort, timeline and personal references.",
    icon: "designer",
  },
  {
    title: "Moodboard & Inspiration",
    text: "Colours, silhouettes, jewellery, rituals and heirloom ideas are gathered into a clear couture direction.",
    icon: "mirrorWork",
  },
  {
    title: "Design Proposal",
    text: "The designer shapes the silhouette, fabric language, embroidery mood and making approach before craft begins.",
    icon: "diamondStitch",
  },
  {
    title: "Measurements",
    text: "Fit is considered through body, posture, movement and the feeling you want on the day.",
    icon: "measurements",
  },
  {
    title: "Handcrafted Couture Begins",
    text: "Once the direction feels right, the piece enters the studio with personal guidance through each stage.",
    icon: "needle",
  },
];

export const designOccasions: DesignOption[] = [
  { title: "Wedding", text: "A once-in-a-lifetime signature", icon: "wedding", value: "Wedding" },
  { title: "Reception", text: "Evening elegance and presence", icon: "reception", value: "Reception" },
  { title: "Engagement", text: "A softer beginning", icon: "engagement", value: "Engagement" },
  { title: "Haldi", text: "Ritual warmth and colour", icon: "heritage", value: "Haldi" },
  { title: "Mehendi", text: "Movement, detail and joy", icon: "mehendi", value: "Mehendi" },
  { title: "Cocktail", text: "Modern couture restraint", icon: "diamondStitch", value: "Cocktail" },
  { title: "Festive", text: "An intimate celebration piece", icon: "festive", value: "Festive" },
  { title: "Custom Couture", text: "A private story of your own", icon: "customCouture", value: "Custom Couture" },
];

export const communicationPreferences: DesignOption[] = [
  { title: "WhatsApp", text: "Warm, direct and easy", icon: "whatsapp", value: "WhatsApp" },
  { title: "Video Call", text: "For detailed first conversations", icon: "videoCall", value: "Video Call" },
  { title: "Phone Call", text: "A quiet voice conversation", icon: "phoneCall", value: "Phone Call" },
  { title: "Studio Visit", text: "Meet with the designer", icon: "studioVisit", value: "Studio Visit" },
  { title: "Email", text: "For references and notes", icon: "email", value: "Email" },
];

export const eventTypes = [
  "Wedding",
  "Reception",
  "Engagement",
  "Haldi",
  "Mehendi",
  "Cocktail",
  "Festive",
  "Custom Couture",
];

export const budgetPreferences = [
  "Prefer to discuss privately",
  "Design guidance needed",
  "Bridal couture investment",
  "Occasion couture investment",
  "Open to recommendation",
];

export const appointmentPreferences = [
  "Studio visit",
  "Video consultation",
  "Phone conversation",
  "WhatsApp first",
  "Email first",
];

export const availabilityPromises: DesignPromise[] = [
  {
    title: "Private Responses",
    text: "Your enquiry is handled as a personal beginning, not a public request.",
    icon: "privateResponses",
  },
  {
    title: "Within 24 Hours",
    text: "The Rangbastra team aims to respond with care within one working day.",
    icon: "sparkle",
  },
  {
    title: "Dedicated Designer",
    text: "A focused design conversation helps translate your mood into couture direction.",
    icon: "dedicatedDesigner",
  },
  {
    title: "Personal Guidance",
    text: "Fabric, silhouette, craft and timeline are explained with calm clarity.",
    icon: "personalGuidance",
  },
  {
    title: "Confidential Discussion",
    text: "Your references, event details and investment preferences remain private.",
    icon: "confidentialDiscussion",
  },
  {
    title: "Handcrafted Planning",
    text: "Every next step is aligned before the piece enters the making process.",
    icon: "handcraftedPlanning",
  },
];

export const designYourOutfitFaq: DesignFaq[] = [
  {
    question: "How long does couture take?",
    answer:
      "Timelines depend on craft, embroidery, fabric sourcing and fittings. Bridal couture usually benefits from beginning as early as possible.",
  },
  {
    question: "Can I customise every detail?",
    answer:
      "Yes. Silhouette, embroidery, sleeves, neckline, colour, dupatta, blouse and finishing details can all be discussed privately.",
  },
  {
    question: "Can I visit the studio?",
    answer:
      "Yes. Studio visits can be arranged when the team confirms availability and the right stage for your conversation.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "International delivery can be discussed depending on the piece, timeline, fitting plan and destination.",
  },
  {
    question: "How many fittings are required?",
    answer:
      "The number of fittings depends on the garment and location. Your designer will recommend the calmest path after understanding your piece.",
  },
];
