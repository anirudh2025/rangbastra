export const customCoutureImages = {
  hero:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
  atelier:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Consult_Our_Designer_pbxliz.webp",
  fabric:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/RB_Fabric_Swatches_ortjph.webp",
  craft:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Crafted_with_Precision_yh1xgw.webp",
  celebration:
    "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782996268/Celebrate_Beautifully_pgr9c6.webp",
};

export interface EditorialCard {
  title: string;
  text: string;
  icon: string;
}

export interface JourneyStep {
  title: string;
  text: string;
  icon: string;
  image: string;
}

export interface OccasionCard {
  title: string;
  mood: string;
  icon: string;
}

export interface InspirationCard {
  title: string;
  text: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const bespokeReasons: EditorialCard[] = [
  {
    title: "It Begins With The Woman",
    text: "Bespoke couture starts with your memories, movement, comfort and celebration, then shapes the garment around them.",
    icon: "sketch",
  },
  {
    title: "No Template Decides The Design",
    text: "Silhouette, colour, embroidery and fall are considered together until the piece feels recognized, not selected.",
    icon: "dupatta",
  },
  {
    title: "Craft Has Time To Breathe",
    text: "Handwork is not rushed into ornament. It is placed with proportion, restraint and the patience of the atelier.",
    icon: "diamondStitch",
  },
  {
    title: "The Final Fit Feels Emotional",
    text: "The goal is not only a beautiful outfit. It is the quiet certainty that this celebration now has your signature.",
    icon: "sparkle",
  },
];

export const coutureJourney: JourneyStep[] = [
  {
    title: "Share Your Story",
    text: "We begin with the occasion, family references, colours, rituals and the feeling you want to carry.",
    icon: "mirrorWork",
    image: customCoutureImages.fabric,
  },
  {
    title: "Personal Design Discussion",
    text: "A focused conversation turns inspiration into direction, with comfort and confidence treated as part of design.",
    icon: "designer",
    image: customCoutureImages.atelier,
  },
  {
    title: "Sketch & Concept",
    text: "The silhouette, surface language and proportion begin to take shape as a couture concept made only for you.",
    icon: "signature",
    image: customCoutureImages.hero,
  },
  {
    title: "Fabric & Embroidery",
    text: "Textiles, colour, motif and handwork are selected with the mood of the celebration at the centre.",
    icon: "fabric",
    image: customCoutureImages.craft,
  },
  {
    title: "Handcrafted Creation",
    text: "The piece moves through cutting, embroidery, finishing and fittings with personal attention at every stage.",
    icon: "thread",
    image: customCoutureImages.craft,
  },
  {
    title: "Final Celebration",
    text: "The final fitting is where the garment stops feeling like a design and begins to feel like memory.",
    icon: "delivery",
    image: customCoutureImages.celebration,
  },
];

export const occasions: OccasionCard[] = [
  { title: "Wedding", mood: "A once-in-a-lifetime signature", icon: "wedding" },
  { title: "Reception", mood: "Evening presence with softness", icon: "reception" },
  { title: "Engagement", mood: "Elegant promise and poise", icon: "engagement" },
  { title: "Haldi", mood: "Ritual colour with ease", icon: "heritage" },
  { title: "Mehendi", mood: "Movement, detail and joy", icon: "mehendi" },
  { title: "Sangeet", mood: "Celebration shaped for rhythm", icon: "dupatta" },
  { title: "Cocktail", mood: "Modern couture with restraint", icon: "diamondStitch" },
  { title: "Festive", mood: "Heirloom mood for gatherings", icon: "festive" },
  { title: "Custom Celebration", mood: "A private story of your own", icon: "customCouture" },
];

export const designInspirations: InspirationCard[] = [
  { title: "Silhouette", text: "Lehenga, anarkali, gown or a proportion developed around your body.", icon: "designer" },
  { title: "Embroidery", text: "Motifs, borders, placement and density chosen for mood rather than excess.", icon: "diamondStitch" },
  { title: "Sleeves", text: "A detail that changes posture, softness and ceremonial presence.", icon: "measurements" },
  { title: "Dupatta", text: "Drape, border, veil, train or layering shaped for the moment.", icon: "dupatta" },
  { title: "Neckline", text: "A quiet decision that frames jewellery, comfort and expression.", icon: "reception" },
  { title: "Color Palette", text: "From heritage tones to personal shades matched with restraint.", icon: "mirrorWork" },
  { title: "Blouse Style", text: "Structure, back detail, closure and proportion refined through fittings.", icon: "blouse" },
  { title: "Veil", text: "A softer ceremonial layer for entrance, photographs and memory.", icon: "veil" },
  { title: "Train", text: "A statement of arrival, used only when the celebration asks for it.", icon: "dupatta" },
  { title: "Jewellery Pairing", text: "Couture and ornament considered together so neither competes.", icon: "wedding" },
];

export const craftPhilosophy: EditorialCard[] = [
  {
    title: "Handwork",
    text: "Embroidery is treated as a language of memory, never as decoration for its own sake.",
    icon: "embroidery",
  },
  {
    title: "Fabric Selection",
    text: "Texture, fall, weight and light are chosen for how they make the wearer feel.",
    icon: "fabric",
  },
  {
    title: "Measurements",
    text: "Fit is approached as comfort, posture and confidence, not only numbers.",
    icon: "measurements",
  },
  {
    title: "Personal Attention",
    text: "Every decision remains close to the woman, the occasion and the family story around it.",
    icon: "designer",
  },
  {
    title: "Trial Sessions",
    text: "Fittings are quiet checkpoints where the piece becomes more personal with each refinement.",
    icon: "mirrorWork",
  },
  {
    title: "Final Fittings",
    text: "The last adjustments are made so the outfit feels effortless when the day arrives.",
    icon: "sparkle",
  },
];

export const pricingFactors = [
  "Craft",
  "Embroidery",
  "Fabric",
  "Complexity",
  "Timeline",
  "Customization",
];

export const customCoutureFaq: FaqItem[] = [
  {
    question: "How early should I begin a custom couture piece?",
    answer:
      "For bridal couture, earlier is always calmer. The atelier can guide timelines after understanding the occasion, craft level and fitting needs.",
  },
  {
    question: "Can I bring references or family inspiration?",
    answer:
      "Yes. References, heirloom colours, jewellery, rituals and personal memories can all become part of the design conversation.",
  },
  {
    question: "Is every design made from scratch?",
    answer:
      "Every custom couture journey is shaped individually. Some clients begin with a Rangbastra mood, while others begin with a completely personal story.",
  },
  {
    question: "Will pricing be shared before work begins?",
    answer:
      "Yes. Investment is discussed privately after the atelier understands craft, fabric, embroidery, complexity and timeline.",
  },
];
