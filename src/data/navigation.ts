export interface NavigationItem {
    label: string;
    href: string;
    icon?: string;
}

export const navigation: NavigationItem[] = [
    {
        label: "Collections",
        href: "/collections",
        icon: "sparkle"
    },
    {
        label: "Custom Couture",
        href: "/custom-couture",
        icon: "customCouture"
    },
    {
        label: "Lookbook",
        href: "/lookbook",
        icon: "mirrorWork"
    },
    {
        label: "Our Story",
        href: "/our-story",
        icon: "signature"
    }
];
