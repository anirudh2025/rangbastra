export interface SignaturePrinciple {
  id: number;
  title: string;
  statement: string;
  icon: string;
}

export const signaturePrinciples: SignaturePrinciple[] = [
  {
    id: 1,
    title: "One Design. One Woman.",
    statement:
      "Every silhouette begins with the person who will wear it, never with a catalogue template.",
    icon: "sparkles",
  },
  {
    id: 2,
    title: "Never Mass Produced.",
    statement:
      "A Rangbastra piece is not repeated at scale. It is shaped with intention, proportion and memory.",
    icon: "needle",
  },
  {
    id: 3,
    title: "Crafted Around Your Story.",
    statement:
      "Occasion, family, colour, comfort and confidence become part of the design language.",
    icon: "thread",
  },
  {
    id: 4,
    title: "Made To Be Remembered.",
    statement:
      "The final garment should feel as personal years later as it did the first time it was worn.",
    icon: "crown",
  },
];

export const signatureCustomizationImage = {
  src: "https://res.cloudinary.com/dfxlm7z58/image/upload/f_auto,q_auto,dpr_auto,c_fill,w_900,h_1200,g_auto/v1782458746/RB_Hero_v7dyxg.png",
  alt: "Rangbastra couture detail created through a personal design philosophy",
};
