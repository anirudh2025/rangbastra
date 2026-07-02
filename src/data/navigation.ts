export interface NavigationItem {
    label: string;
    href: string;
    icon?: string;
}

export const navigation: NavigationItem[] = [
    {
        label: "Collections",
        href: "/collections",
        icon: "sparkles"
    },
    {
        label: "Custom Couture",
        href: "/custom-couture",
        icon: "needle"
    },
    {
        label: "Lookbook",
        href: "/lookbook",
        icon: "crown"
    },
    {
        label: "Our Story",
        href: "/story",
        icon: "thread"
    }
];