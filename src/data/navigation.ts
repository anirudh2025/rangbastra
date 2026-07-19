export interface NavigationChild {
  label: string;
  href: string;
  icon: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationChild[];
}

export const navigation: NavigationItem[] = [
  {
    label: "Collections",
    href: "/collections",
    icon: "sparkle",
    children: [
      { label: "Bridal Couture", href: "/collections?category=Bridal", icon:"veil" },
      { label: "Festive Edit", href: "/collections?category=Festive", icon:"festive" },
      { label: "Reception", href: "/collections?category=Reception", icon:"reception" },
      { label: "Engagement", href: "/collections?category=Engagement", icon:"engagement" },
      { label: "View All Collections", href: "/collections", icon:"mirrorWork" },
    ],
  },
  {
    label: "The Atelier",
    href: "/custom-couture",
    icon: "customCouture",
    children: [
      { label: "Custom Couture", href: "/custom-couture", icon:"needle" },
      { label: "Our Philosophy", href: "/our-story", icon:"journal" },
      { label: "Rangbastra Journey", href: "/rangbastra-journey", icon:"signature" },
      { label: "Designer Consultation", href: "/designer-consultation", icon:"designer" },
    ],
  },
  {
    label: "Bridal Experience",
    href: "/bride-stories",
    icon: "mirrorWork",
    children: [
      { label: "Bride Stories", href: "/bride-stories", icon:"wedding" },
      { label: "Customization Process", href: "/customization-process", icon:"measurements" },
      { label: "Design Your Outfit", href: "/design-your-outfit", icon:"personalGuidance" },
      { label: "Frequently Asked Questions", href: "/faq", icon:"confidentialDiscussion" },
    ],
  },
  {
    label: "Discover",
    href: "/lookbook",
    icon: "signature",
    children: [
      { label: "Lookbook", href: "/lookbook", icon:"mirrorWork" },
      { label: "Journal", href: "/journal", icon:"journal" },
      { label: "Our Story", href: "/our-story", icon:"heritage" },
      { label: "Contact", href: "/contact", icon:"email" },
    ],
  },
];
