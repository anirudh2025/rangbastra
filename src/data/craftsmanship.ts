export interface CraftsmanshipPillar {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const craftsmanshipPillars: CraftsmanshipPillar[] = [
  {
    id: 1,
    title: "Hand Embroidery",
    description:
      "Every motif is guided by skilled hands, creating surface detail with patience, rhythm and quiet precision.",
    icon: "embroidery",
  },
  {
    id: 2,
    title: "Finest Fabrics",
    description:
      "Silks, textures and drapes are chosen for how they move, feel and hold their elegance through celebration.",
    icon: "fabric",
  },
  {
    id: 3,
    title: "Perfect Fit",
    description:
      "Measurements become architecture, shaping each silhouette around the person who will live in it.",
    icon: "measurements",
  },
  {
    id: 4,
    title: "Timeless Design",
    description:
      "The final piece balances occasion, memory and restraint so it feels personal long after the moment passes.",
    icon: "heritage",
  },
];
