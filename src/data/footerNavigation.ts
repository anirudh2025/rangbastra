import { contact, getMailtoHref, getWhatsAppHref } from "./contact";

export interface FooterNavigationLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterNavigationGroup {
  title: string;
  links: FooterNavigationLink[];
}

export const footerNavigation: FooterNavigationGroup[] = [
  {
    title: "Discover",
    links: [
      {
        label: "Collections",
        href: "/collections",
      },
      {
        label: "Lookbook",
        href: "/lookbook",
      },
      {
        label: "Journal",
        href: "/journal",
      },
      {
        label: "Search",
        href: "/search",
      },
      {
        label: "Wishlist",
        href: "/wishlist",
      },
      {
        label: "Custom Couture",
        href: "/custom-couture",
      },
    ],
  },
  {
    title: "Maison",
    links: [
      {
        label: "Our Story",
        href: "/our-story",
      },
      {
        label: "Craftsmanship",
        href: "/#craftsmanship",
      },
      {
        label: "Bride Stories",
        href: "/bride-stories",
      },
      {
        label: "Client Room",
        href: "/account",
      },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "Instagram",
        href: contact.instagramUrl,
        external: true,
      },
      {
        label: "WhatsApp",
        href: getWhatsAppHref("homepage"),
        external: true,
      },
      {
        label: "Email",
        href: getMailtoHref(),
        external: true,
      },
      {
        label: "Design Your Outfit",
        href: "/design-your-outfit",
      },
      {
        label: "Contact",
        href: "/contact",
      },
      {
        label: "FAQ",
        href: "/faq",
      },
    ],
  },
  {
    title: "Care",
    links: [
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        label: "Terms & Conditions",
        href: "/terms-and-conditions",
      },
      {
        label: "Disclaimer",
        href: "/disclaimer",
      },
      {
        label: "Shipping & Delivery",
        href: "/shipping-and-delivery",
      },
      {
        label: "Returns & Exchanges",
        href: "/returns-and-exchanges",
      },
    ],
  },
];
