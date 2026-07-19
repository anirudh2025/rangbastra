export const consultationFormats = [
  { id: "whatsapp", title: "WhatsApp Consultation", detail: "A focused written conversation for initial questions, references and timing.", response: "Initial response within one business day", icon: "whatsapp" },
  { id: "video", title: "Private Video Consultation", detail: "A scheduled face-to-face discussion for silhouette, palette and celebration context.", response: "Available by confirmed appointment", icon: "videoCall" },
  { id: "studio", title: "Anand Studio Consultation", detail: "An in-person appointment for fabric, drape, measurements and detailed design direction.", response: "Available by confirmed appointment", icon: "location" },
] as const;

export const productionStages = [
  { title: "Discovery", text: "Your occasion, references, comfort and desired presence come into focus." },
  { title: "Design consultation", text: "The atelier translates your brief into a considered couture direction." },
  { title: "Sketch approval", text: "Silhouette, proportion and key details are reviewed before making begins." },
  { title: "Measurements", text: "Measurements are collected or confirmed with guidance from the team." },
  { title: "Material selection", text: "Fabric, palette, embroidery and finishing choices are aligned." },
  { title: "Crafting", text: "Approved details move into patient handwork and construction." },
  { title: "Fitting", text: "Fit, fall and movement are reviewed at the appropriate stage." },
  { title: "Refinement", text: "Final adjustments and finishing bring the approved piece together." },
  { title: "Delivery", text: "The completed piece is prepared for collection or coordinated delivery." },
] as const;

export const confirmedMilestones = [
  { date: "2026", title: "Rangbastra digital atelier", text: "Rangbastra introduced its online couture discovery and private enquiry experience.", media: null, source: "Owner-confirmed website launch context" },
] as const;

export const futureMissions = [
  "Document future milestones only after founder confirmation.",
  "Add atelier media with dates, captions and publishing permission.",
  "Connect authenticated customers to real request status in a later secured phase.",
] as const;

export const signatureCtaVariants = {
  collection: { eyebrow: "The Rangbastra Signature", title: "Find the piece that begins your story", copy: "Explore couture collections before shaping the details around you.", label: "Explore Collections", href: "/collections" },
  consultation: { eyebrow: "A Private Conversation", title: "Bring your celebration into focus", copy: "Choose the consultation format that feels most comfortable, then share the deeper brief when you are ready.", label: "Choose a Consultation", href: "/designer-consultation" },
  editorial: { eyebrow: "Continue the Story", title: "From lived memory to your own couture chapter", copy: "Explore real, consented stories as they are added to the Rangbastra archive.", label: "View Bride Stories", href: "/bride-stories" },
  account: { eyebrow: "Your Private Space", title: "Keep inspiration and enquiries together", copy: "Sign in to return to saved pieces and submitted couture enquiries.", label: "Open Your Account", href: "/account" },
} as const;
