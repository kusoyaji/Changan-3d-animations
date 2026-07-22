import type { Model } from "../types";

// Content ported from the production site (Changan-Website-ReDesign/src/mock/model.js → cs55).
export const cs55: Model = {
  slug: "cs55",
  name: "CS55+",
  nameplate: "CS55+",
  tagline: "L'équilibre, sans compromis.",
  logo: "/images/vehicles/cs55-logo.svg",
  price: "264 900 DH",
  heroDesktop: "/images/vehicles/cutouts/cs55.webp",
  heroMobile: "/images/vehicles/cutouts/cs55.webp",
  colorVariants: [
    { label: "Blanc", hex: "#FFFFFF", image: "/images/model/variant/cs55-3.svg" },
    { label: "Gris", hex: "#808080", image: "/images/model/variant/cs55-1.svg" },
    { label: "Noir", hex: "#000000", image: "/images/model/variant/cs55-2.svg" },
    { label: "Bleu", hex: "#A3B5C7", image: "/images/model/variant/cs55-4.svg" },
  ],
  comfort: [
    { title: "Coffre électrique", image: "/images/model/comfort/comfort-cs55-1.webp" },
    { title: "Volant sport à méplat", image: "/images/model/comfort/comfort-cs55-2.webp" },
    { title: "Réglage électrique du siège conducteur", image: "/images/model/comfort/comfort-cs55-3.webp" },
    { title: "Écran tactile 12' Apple CarPlay", image: "/images/model/comfort/comfort-cs55-4.webp" },
    { title: "Mode : Eco / Normal / Sport", image: "/images/model/comfort/comfort-cs55-5.webp" },
    { title: "Boîte automatique E-shift by wire", image: "/images/model/comfort/comfort-cs55-6.webp" },
    { title: "Sellerie en cuir bi-ton", image: "/images/model/comfort/comfort-cs55-7.webp" },
  ],
  equipment: [
    {
      title: "Feux avant full LED",
      text: "Feux avant full LED pour une visibilité optimale.",
      image: "/images/model/equipment/equipment-cs55-1.webp",
    },
    {
      title: "Becquet arrière sport",
      text: "Becquet arrière sport pour un design dynamique et aérodynamique.",
      image: "/images/model/equipment/equipment-cs55-2.webp",
    },
    {
      title: "Jantes en aluminium 19'",
      text: "Jantes en aluminium 19' pour une tenue de route optimale.",
      image: "/images/model/equipment/equipment-cs55-3.webp",
    },
  ],
  gallery: [
    "/images/model/gallery/gallery-cs55-1.webp",
    "/images/model/gallery/gallery-cs55-2.webp",
    "/images/model/gallery/gallery-cs55-3.webp",
  ],
  specs: [
    { group: "Motorisation", label: "Motorisation", value: "1.5L 181CH" },
    { group: "Motorisation", label: "Boîte automatique", value: "7 DCT" },
    { group: "Consommation", label: "Consommation", value: "6.6L / 100 Km" },
    { group: "Dimensions", label: "Volume du coffre", value: "475 L" },
    { group: "Dimensions", label: "Jantes", value: "19' en aluminium" },
    { group: "Garantie", label: "Km illimité / Garantie", value: "6 ans" },
  ],
  pdf: "/images/model/gallery/cs55.pdf",
  hasSpin: false,
};
