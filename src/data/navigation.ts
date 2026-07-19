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
      { label: "The Rangbastra Journey", href: "/our-story", icon:"signature" },
      { label: "Designer Consultation", href: "/design-your-outfit", icon:"designer" },
    ],
  },
  {
    label: "Bridal Experience",
    href: "/bride-stories",
    icon: "mirrorWork",
    children: [
      { label: "Begin a Consultation", href: "/design-your-outfit", icon:"personalGuidance" },
      { label: "Bride Stories", href: "/bride-stories", icon:"wedding" },
      { label: "Customisation Process", href: "/custom-couture", icon:"measurements" },
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
