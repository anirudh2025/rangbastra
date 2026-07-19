export interface JournalArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  wordCount: number;
  author: string;
  publishedDate: string;
  productSlugs: string[];
  storyHref?: string;
  heroImage: string;
  heroAlt: string;
  excerpt: string;
  body: string[];
}

const journalDrafts: Array<Omit<JournalArticle, "readingTime" | "wordCount" | "author" | "publishedDate" | "productSlugs">> = [
  {
    slug: "begin-custom-bridal-lehenga-journey",
    title: "How To Begin A Custom Bridal Lehenga Journey",
    description:
      "A calm editorial guide to beginning your custom bridal lehenga journey with clarity, emotion and trust.",
    category: "Bridal Guidance",
    heroImage:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    heroAlt: "Editorial bridal couture portrait in warm atelier light",
    excerpt:
      "A custom lehenga begins before fabric. It begins with memory, celebration and the quiet details a bride wants to carry.",
    body: [
      "The first conversation is not about choosing a garment. It is about understanding the day, the family traditions, the mood of the celebration and the way a bride wants to feel when she enters the room.",
      "Bring references, heirloom details, colour memories and even uncertainty. A strong couture process knows how to translate emotion into silhouette, fabric, embroidery and proportion.",
      "The most refined journeys begin early enough to leave space for discovery. Sketch, fabric, handwork and fitting all need breathing room so the final piece feels composed rather than rushed.",
    ],
  },
  {
    slug: "couture-different-from-ready-made-fashion",
    title: "What Makes Couture Different From Ready-Made Fashion",
    description:
      "Understand the difference between couture and ready-made fashion through craft, fit, emotion and personal detail.",
    category: "Couture Knowledge",
    heroImage:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
    heroAlt: "Handcrafted couture detail photographed editorially",
    excerpt:
      "Ready-made fashion asks you to fit into an existing idea. Couture begins with your story and builds around it.",
    body: [
      "Ready-made fashion is complete before you arrive. Couture is composed with you in the room, shaped by your measurements, preferences, occasion and emotional language.",
      "The difference is not only fit. It is authorship. Every border, motif, sleeve, neckline and fall of fabric has the opportunity to become intentional.",
      "Luxury couture also gives time to refinement. The smallest corrections often create the quiet confidence people remember most.",
    ],
  },
  {
    slug: "choosing-colour-story-for-your-wedding",
    title: "Choosing The Right Colour Story For Your Wedding",
    description:
      "A Rangbastra editorial note on choosing bridal colour through season, ceremony, jewellery and personal feeling.",
    category: "Colour",
    heroImage:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    heroAlt: "Bride in a richly coloured couture ensemble",
    excerpt:
      "A bridal colour story should flatter the moment, honour the ceremony and still feel unmistakably personal.",
    body: [
      "Colour should never be chosen in isolation. The venue light, ceremony hour, jewellery tone, family palette and photography mood all change how a shade lives.",
      "Some brides feel most themselves in classics. Others want a softer whisper, a deeper jewel tone or a surprising personal accent hidden inside the embroidery.",
      "The right colour story is the one that lets the bride feel recognised, not disguised.",
    ],
  },
  {
    slug: "understanding-handwork-embroidery-detail",
    title: "Understanding Handwork, Embroidery And Detail",
    description:
      "A couture knowledge note on handwork, embroidery density, detail placement and why restraint matters.",
    category: "Craft",
    heroImage:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648351/Festive_Edit_cq2w5g.webp",
    heroAlt: "Close view of ornate handcrafted embroidery",
    excerpt:
      "Embroidery becomes luxurious when it knows where to speak, where to rest and how to move with the bride.",
    body: [
      "Handwork is not measured only by density. Placement, rhythm and restraint often decide whether a piece feels refined or heavy.",
      "A good embroidery plan considers posture, photography, movement, ceremony rituals and how the fabric will fall when worn.",
      "The most memorable detail is sometimes discovered slowly: a border, a motif, a glint at the sleeve, a personal symbol carried near the heart.",
    ],
  },
  {
    slug: "prepare-for-a-design-session",
    title: "How Brides Can Prepare For A Design Session",
    description:
      "A practical yet emotional guide to preparing for a private bridal design conversation.",
    category: "Atelier Notes",
    heroImage:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782614896/Hero_Desktop_klovjb.webp",
    heroAlt: "Rangbastra couture mood in a cinematic atelier setting",
    excerpt:
      "The best design sessions begin with feeling, references and a little room for surprise.",
    body: [
      "Come with images, words, fabrics, jewellery references or ceremony notes, but do not worry about having a complete design brief.",
      "Think about what you want to avoid as much as what you love. Clarity often arrives through contrast.",
      "Most importantly, bring the story. The atelier can guide silhouette and craft, but the emotional centre belongs to the bride.",
    ],
  },
  {
    slug: "personalisation-in-bridal-couture",
    title: "Why Personalisation Matters In Bridal Couture",
    description:
      "Why personal details, emotional references and private symbols make bridal couture more meaningful.",
    category: "Personalisation",
    heroImage:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Custom_Edit_vbbzxk.webp",
    heroAlt: "Custom couture details arranged in an editorial composition",
    excerpt:
      "Personalisation is not excess. At its best, it is the quiet signature that makes couture belong to one bride only.",
    body: [
      "A personalised piece can carry names, dates, motifs, blessings, colours, family references or simply the exact proportion that makes a bride feel at ease.",
      "The goal is not to add detail everywhere. The goal is to add meaning where it will be felt.",
      "When personalisation is handled with restraint, the final garment does not announce its secrets. It keeps them beautifully.",
    ],
  },
];

const wordCount = (article: { title:string; description:string; excerpt:string; body:string[] }) =>
  [article.title, article.description, article.excerpt, ...article.body].join(" ").trim().split(/\s+/).filter(Boolean).length;

export const journalArticles: JournalArticle[] = journalDrafts.map((article, index) => {
  const count = wordCount(article);
  return {
    ...article,
    wordCount: count,
    readingTime: `${Math.max(1, Math.ceil(count / 220))} min read`,
    author: "Rangbastra Editorial Desk",
    publishedDate: "2026-07-19",
    productSlugs: index % 2 === 0 ? ["amaira"] : ["gulnaar"],
    storyHref: "/bride-stories",
  };
});

export const journalCategories = [
  "All",
  ...Array.from(new Set(journalArticles.map((article) => article.category))),
];

export const getRelatedArticles = (slug: string, count = 3) => {
  const current = journalArticles.find((article) => article.slug === slug);

  return journalArticles
    .filter((article) => article.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current?.category ? 0 : 1;
      const bScore = b.category === current?.category ? 0 : 1;
      return aScore - bScore;
    })
    .slice(0, count);
};
