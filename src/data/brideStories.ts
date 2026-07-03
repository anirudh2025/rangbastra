export interface BrideStory {
  id: number;
  brideName: string;
  city: string;
  quote: string;
  image: string;
  imageAlt: string;
}

export const brideStories: BrideStory[] = [
  {
    id: 1,
    brideName: "Anaya Mehta",
    city: "Mumbai",
    quote:
      "It felt as though every detail remembered who I was before I even stepped into the celebration.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    imageAlt: "Editorial portrait of a bride in a Rangbastra couture look",
  },
  {
    id: 2,
    brideName: "Mira Khanna",
    city: "Jaipur",
    quote:
      "The outfit carried my mother's traditions, my own quiet confidence and the joy of that morning.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    imageAlt: "Bride wearing a signature Rangbastra wedding ensemble",
  },
  {
    id: 3,
    brideName: "Zoya Rahman",
    city: "Hyderabad",
    quote:
      "When I saw the final piece, it no longer felt like couture. It felt like a chapter of my life.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
    imageAlt: "Editorial bridal couture moment with handcrafted detailing",
  },
];
