export interface NavigationItem {
  label: string;
  href: string;
}

export const navigation: NavigationItem[] = [
  {
    label: "Collections",
    href: "/collections"
  },
  {
    label: "Custom Couture",
    href: "/custom-couture"
  },
  {
    label: "Lookbook",
    href: "/lookbook"
  },
  {
    label: "About",
    href: "/about"
  },
  {
    label: "Contact",
    href: "/contact"
  }
];