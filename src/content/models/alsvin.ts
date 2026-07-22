import type { Model } from "../types";

// Content ported from the production site (Changan-Website-ReDesign/src/mock/model.js → alsvin).
export const alsvin: Model = {
  slug: "alsvin",
  name: "Alsvin",
  nameplate: "Alsvin",
  tagline: "L'essentiel, avec style.",
  logo: "/images/vehicles/alsvin-logo.svg",
  price: "154 900 DH",
  heroDesktop: "/images/vehicles/cutouts/alsvin.webp",
  heroMobile: "/images/vehicles/cutouts/alsvin.webp",
  colorVariants: [
    { label: "Blanc", hex: "#FFFFFF", image: "/images/model/variant/white.webp" },
    { label: "Gris", hex: "#808080", image: "/images/model/variant/gray.webp" },
    { label: "Noir", hex: "#000000", image: "/images/model/variant/black.webp" },
  ],
  comfort: [
    { title: "Sièges en cuir", image: "/images/model/comfort/comfort-1.webp" },
    { title: "Boîte de vitesses automatique", image: "/images/model/comfort/comfort-2.webp" },
    { title: "Écran tactile 9' + Mirror Link", image: "/images/model/comfort/comfort-3.webp" },
  ],
  equipment: [
    {
      title: "Calandre chromée",
      text: "La calandre et le contour de vitres chromés donnent un aspect élégant à l'extérieur.",
      image: "/images/model/equipment/equipment-1.webp",
    },
    {
      title: "Jantes en aluminium 15''",
      text: "Les jantes en aluminium 15'' disponibles de série pour garantir une meilleure tenue de route.",
      image: "/images/model/equipment/equipment-2.webp",
    },
    {
      title: "Toit ouvrant électrique",
      text: "Le toit ouvrant électrique pour un confort optimal.",
      image: "/images/model/equipment/equipment-3.webp",
    },
    {
      title: "Feux de jour à LED",
      text: "Les feux de jour à LED améliorent la visibilité de la voiture auprès des autres automobilistes durant la journée.",
      image: "/images/model/equipment/equipment-4.webp",
    },
  ],
  gallery: [
    "/images/model/gallery/gallery-1.webp",
    "/images/model/gallery/gallery-2.webp",
    "/images/model/gallery/gallery-3.webp",
  ],
  specs: [
    { group: "Motorisation", label: "Motorisation", value: "1.5L 98CH" },
    { group: "Motorisation", label: "Boîte automatique", value: "5 DCT" },
    { group: "Consommation", label: "Consommation", value: "6.2L / 100 Km" },
    { group: "Dimensions", label: "Volume du coffre", value: "430 L" },
    { group: "Dimensions", label: "Jantes", value: "15' en aluminium" },
    { group: "Garantie", label: "Km illimité / Garantie", value: "6 ans" },
  ],
  pdf: "/images/model/gallery/alsvin.pdf",
  hasSpin: false,
};
