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
        href: "/story",
      },
      {
        label: "Craftsmanship",
        href: "/craftsmanship",
      },
      {
        label: "Bride Stories",
        href: "/bride-stories",
      },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "Instagram",
        href: "https://instagram.com/rangbastra",
        external: true,
      },
      {
        label: "WhatsApp",
        href: "https://wa.me/",
        external: true,
      },
      {
        label: "Visit Atelier",
        href: "/atelier",
      },
    ],
  },
];
