export interface BrideStory {
  id: number;
  brideName: string;
  city: string;
  occasion: string;
  chapterTitle: string;
  memory: string;
  quote: string;
  letter: string;
  image: string;
  imageAlt: string;
}

export const brideStories: BrideStory[] = [
  {
    id: 1,
    brideName: "Anaya Mehta",
    city: "Mumbai",
    occasion: "Wedding Day",
    chapterTitle: "A Morning Written In Gold",
    memory:
      "Anaya wanted a bridal piece that remembered her grandmother's temple jewellery and the softness of a winter morning.",
    quote:
      "It felt as though every detail remembered who I was before I even stepped into the celebration.",
    letter:
      "When I wore it, I did not feel dressed for a ceremony. I felt held by every hand that helped me become a bride.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648330/Bridal_Edit_wajwba.webp",
    imageAlt: "Editorial portrait of a bride in a Rangbastra couture look",
  },
  {
    id: 2,
    brideName: "Mira Khanna",
    city: "Jaipur",
    occasion: "Mehendi",
    chapterTitle: "The Colour Her Mother Remembered",
    memory:
      "Mira's story began with an old family photograph, a note about turmeric light and a wish for celebration without heaviness.",
    quote:
      "The outfit carried my mother's traditions, my own quiet confidence and the joy of that morning.",
    letter:
      "The colour felt familiar before I knew why. It belonged to our home, our music and the women who stood beside me.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648342/Signature_Edit_k9aiop.webp",
    imageAlt: "Bride wearing a signature Rangbastra wedding ensemble",
  },
  {
    id: 3,
    brideName: "Zoya Rahman",
    city: "Hyderabad",
    occasion: "Reception",
    chapterTitle: "A Chapter After Sunset",
    memory:
      "Zoya wanted a reception look that felt cinematic, personal and quiet enough for every detail to be discovered slowly.",
    quote:
      "When I saw the final piece, it no longer felt like couture. It felt like a chapter of my life.",
    letter:
      "There was a moment after sunset when I saw the embroidery catch the light. That was when the whole journey became real.",
    image:
      "https://res.cloudinary.com/dfxlm7z58/image/upload/v1782648334/Couture_Edit_u7kmac.webp",
    imageAlt: "Editorial bridal couture moment with handcrafted detailing",
  },
];
