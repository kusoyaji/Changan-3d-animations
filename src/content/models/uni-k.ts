import type { Model } from "../types";

// Content ported from the production site (Changan-Website-ReDesign/src/mock/model.js → unik).
export const uniK: Model = {
  slug: "uni-k",
  name: "UNI-K",
  nameplate: "UNI-K",
  tagline: "Présence maximale.",
  logo: "/images/vehicles/unik-logo.svg",
  price: "459 900 DH",
  heroDesktop: "/images/vehicles/cutouts/uni-k.webp",
  heroMobile: "/images/vehicles/cutouts/uni-k.webp",
  colorVariants: [
    { label: "Blanc", hex: "#FFFFFF", image: "/images/model/variant/unik-4.svg" },
    { label: "Gris", hex: "#808080", image: "/images/model/variant/unik-3.svg" },
    { label: "Noir", hex: "#000000", image: "/images/model/variant/unik-1.svg" },
    { label: "Bleu", hex: "#A3B5C7", image: "/images/model/variant/unik-2.svg" },
  ],
  comfort: [
    { title: "Smart Key", image: "/images/model/comfort/comfort-unik-1.webp" },
    { title: "Toit panoramique ouvrant", image: "/images/model/comfort/comfort-unik-2.webp" },
    { title: "Écran tactile 12' avec Apple CarPlay", image: "/images/model/comfort/comfort-unik-3.webp" },
    { title: "Lumière d'ambiance", image: "/images/model/comfort/comfort-unik-5.webp" },
    { title: "Système son premium « SONY »", image: "/images/model/comfort/comfort-unik-6.webp" },
    { title: "Sellerie en cuir", image: "/images/model/comfort/comfort-unik-4.webp" },
  ],
  equipment: [
    {
      title: "Feux avant full LED",
      text: "Feux avant full LED pour une visibilité optimale et un design distinctif.",
      image: "/images/model/equipment/equipment-unik-4.webp",
    },
    {
      title: "Poignées de portes rétractables",
      text: "Poignées de portes rétractables pour un design élégant et aérodynamique.",
      image: "/images/model/equipment/equipment-unik-5.webp",
    },
    {
      title: "Jantes en aluminium 21'",
      text: "Jantes en aluminium 21' pour une tenue de route optimale.",
      image: "/images/model/equipment/equipment-unik-1.webp",
    },
    {
      title: "Feux arrière full LED",
      text: "Feux arrière full LED pour un design moderne et une meilleure visibilité.",
      image: "/images/model/equipment/equipment-unik-3.webp",
    },
  ],
  gallery: [
    "/images/model/gallery/gallery-unik-1.webp",
    "/images/model/gallery/gallery-unik-2.webp",
    "/images/model/gallery/gallery-unik-3.webp",
  ],
  specs: [
    { group: "Motorisation", label: "Motorisation", value: "2.0L 226CH" },
    { group: "Motorisation", label: "Boîte automatique", value: "8 AT" },
    { group: "Consommation", label: "Consommation", value: "8.9L / 100 Km" },
    { group: "Dimensions", label: "Volume du coffre", value: "518 L" },
    { group: "Dimensions", label: "Jantes", value: "21' en aluminium" },
    { group: "Garantie", label: "Km illimité / Garantie", value: "6 ans" },
  ],
  pdf: "/images/model/gallery/uni-k.pdf",
  hasSpin: false,
};
