import type { Model } from "../types";

// Content ported from the production site (Changan-Website-ReDesign/src/mock/model.js → cs35).
export const cs35Plus: Model = {
  slug: "cs35-plus",
  name: "CS35+",
  nameplate: "CS35+",
  tagline: "Compact dehors, généreux dedans.",
  logo: "/images/vehicles/cs35-logo.svg",
  price: "219 900 DH",
  heroDesktop: "/images/vehicles/cutouts/cs35-plus.webp",
  heroMobile: "/images/vehicles/cutouts/cs35-plus.webp",
  colorVariants: [
    { label: "Blanc", hex: "#FFFFFF", image: "/images/model/variant/cs35-white.svg" },
    { label: "Gris", hex: "#808080", image: "/images/model/variant/cs35-grey.svg" },
    { label: "Noir", hex: "#000000", image: "/images/model/variant/cs35-black.svg" },
  ],
  comfort: [
    { title: "Smart Key", image: "/images/model/comfort/comfort-cs35-0.webp" },
    { title: "Toit ouvrant panoramique", image: "/images/model/comfort/comfort-cs35-1.webp" },
    { title: "Coffre électrique", image: "/images/model/comfort/comfort-cs35-2.webp" },
    { title: "Écran tactile 10'", image: "/images/model/comfort/comfort-cs35-3.webp" },
    { title: "Sellerie 100% cuir", image: "/images/model/comfort/comfort-cs35-4.webp" },
    { title: "Boîte automatique 7 DCT", image: "/images/model/comfort/comfort-cs35-5.webp" },
    { title: "Réglage électrique du siège conducteur", image: "/images/model/comfort/comfort-cs35-6.webp" },
  ],
  equipment: [
    {
      title: "Feux de jour à LED",
      text: "Les feux de jour à LED pour une meilleure visibilité.",
      image: "/images/model/equipment/equipment-cs35-1.webp",
    },
    {
      title: "Barre de toit en aluminium",
      text: "Barre de toit en aluminium pour un style sportif et fonctionnel.",
      image: "/images/model/equipment/equipment-cs35-2.webp",
    },
    {
      title: "Feux arrière à LED",
      text: "Feux arrière à LED pour un design moderne et une meilleure visibilité.",
      image: "/images/model/equipment/equipment-cs35-3.webp",
    },
    {
      title: "Jantes en aluminium 18'",
      text: "Jantes en aluminium 18' pour une tenue de route optimale.",
      image: "/images/model/equipment/equipment-cs35-4.webp",
    },
  ],
  gallery: [
    "/images/model/gallery/gallery-cs35-1.webp",
    "/images/model/gallery/gallery-cs35-2.webp",
    "/images/model/gallery/gallery-cs35-3.webp",
  ],
  specs: [
    { group: "Motorisation", label: "Motorisation", value: "1.4L 158CH" },
    { group: "Motorisation", label: "Boîte automatique", value: "7 DCT" },
    { group: "Consommation", label: "Consommation", value: "7.6L / 100 Km" },
    { group: "Dimensions", label: "Volume du coffre", value: "403 L" },
    { group: "Dimensions", label: "Jantes", value: "18' en aluminium" },
    { group: "Garantie", label: "Km illimité / Garantie", value: "6 ans" },
  ],
  pdf: "/images/model/gallery/cs35.pdf",
  hasSpin: false,
};
