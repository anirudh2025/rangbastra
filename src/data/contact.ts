export const contact = {
  whatsappNumber: "+91 8077124409",
  whatsappUrl: "https://wa.me/918077124409",
  // TODO: Confirm the production inbox before launch.
  email: "hello@rangbastra.luxury",
  // TODO: Confirm the official Instagram handle before launch.
  instagramUrl: "https://www.instagram.com/rangbastra",
  address: "Anand, Gujarat",
};

export const whatsappMessages = {
  homepage:
    "Hello Rangbastra, I would love to begin my custom couture journey.",
  product:
    "Hello Rangbastra, I am interested in this couture piece and would like to know more about customization.",
  designYourOutfit:
    "Hello Rangbastra, I would like to design a custom outfit with your team.",
  lookbook:
    "Hello Rangbastra, I saw your lookbook and would love to create something similar.",
  ourStory:
    "Hello Rangbastra, I would like to know more about your custom couture experience.",
  customCouture:
    "Hello Rangbastra, I would love to begin a custom couture journey with your team.",
  collections:
    "Hello Rangbastra, I explored your collections and would like guidance for a custom design.",
};

export type WhatsAppMessageKey = keyof typeof whatsappMessages;

export function getWhatsAppHref(message: WhatsAppMessageKey | string) {
  const text =
    message in whatsappMessages
      ? whatsappMessages[message as WhatsAppMessageKey]
      : message;

  return `${contact.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export function getMailtoHref(subject = "Rangbastra couture enquiry") {
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
}
