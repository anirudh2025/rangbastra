export interface LookbookStory {
  id: number;
  title: string;
  caption: string;
  image: string;
  variant: "portrait" | "landscape" | "feature" | "tall";
}

export const lookbookStories: LookbookStory[] = [
  {
    id: 1,
    title: "The Bridal Quiet",
    caption: "A silhouette made for the pause before the celebration begins.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    variant: "feature",
  },
  {
    id: 2,
    title: "Modern Heirloom",
    caption: "Couture detail with the restraint of a piece meant to be kept.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    variant: "portrait",
  },
  {
    id: 3,
    title: "Evening Movement",
    caption: "Fabric, light and proportion meeting in a single gesture.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
    variant: "landscape",
  },
  {
    id: 4,
    title: "Festive Stillness",
    caption: "A composed moment for colour, memory and celebration.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648338/Festive_Edit_boj0wo.webp",
    variant: "tall",
  },
];
