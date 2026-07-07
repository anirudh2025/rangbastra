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
    icon: "mirrorWork",
  },
  {
    id: 2,
    title: "Never Mass Produced.",
    statement:
      "A Rangbastra piece is not repeated at scale. It is shaped with intention, proportion and memory.",
    icon: "designer",
  },
  {
    id: 3,
    title: "Crafted Around Your Story.",
    statement:
      "Occasion, family, colour, comfort and confidence become part of the design language.",
    icon: "customCouture",
  },
  {
    id: 4,
    title: "Made To Be Remembered.",
    statement:
      "The final garment should feel as personal years later as it did the first time it was worn.",
    icon: "signature",
  },
];

export const signatureCustomizationImage = {
  src: "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782458746/RB_Hero_v7dyxg.png",
  alt: "Rangbastra couture detail created through a personal design philosophy",
};
