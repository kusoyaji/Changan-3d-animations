import type { Model } from "../types";

// Content ported from the production site (Changan-Website-ReDesign/src/mock/model.js → cs15).
export const cs15: Model = {
  slug: "cs15",
  name: "CS15",
  nameplate: "All New CS15",
  tagline: "Votre premier SUV, tout équipé.",
  logo: "/images/icons/all-new-cs15-logo-v2.png",
  price: "149 900 DH",
  heroDesktop: "/images/vehicles/cutouts/cs15.webp",
  heroMobile: "/images/vehicles/cutouts/cs15.webp",
  colorVariants: [
    { label: "Blanc", hex: "#FFFFFF", image: "/images/vehicles/CS15 BLANCHE SANS AP.png" },
    { label: "Gris", hex: "#808080", image: "/images/vehicles/CS15 GRIS SANS AP.png" },
    { label: "Noir", hex: "#000000", image: "/images/vehicles/CS15 NOIR SANS AP.png" },
  ],
  comfort: [
    { title: "Écran tactile 10'", image: "/images/model/comfort/comfort-cs15-5.webp", mobileImage: "/images/model/comfort/comfort-cs15-mobile-screen.jpg" },
    { title: "Apple CarPlay & Android Auto", image: "/images/model/equipment/equipment-cs15-carplay.png" },
    { title: "Jantes en aluminium 17'", image: "/images/model/comfort/comfort-cs15-2.webp", mobileImage: "/images/model/comfort/comfort-cs15-mobile-wheels.jpg" },
    { title: "Volant à méplat", image: "/images/model/comfort/comfort-cs15-3.webp", mobileImage: "/images/model/comfort/comfort-cs15-mobile-steering.jpg" },
    { title: "Sellerie en cuir", image: "/images/model/comfort/comfort-cs15-4.webp", mobileImage: "/images/model/comfort/comfort-cs15-mobile-leather.jpg" },
    { title: "Ordinateur de bord digital LCD 7'", image: "/images/model/comfort/comfort-cs15-lcd.png" },
    { title: "Smart Key : accès et démarrage sans clé", image: "/images/model/comfort/comfort-cs15-smartkey.jpg", mobileImage: "/images/model/comfort/comfort-cs15-mobile-smartkey.jpg" },
    { title: "Boîte de vitesses automatique 5 DCT", image: "/images/model/comfort/comfort-cs15-bvt-dct.jpg", mobileImage: "/images/model/comfort/comfort-cs15-mobile-dct.jpg" },
  ],
  equipment: [
    {
      title: "Calandre gloss black",
      text: "La calandre noire affirme un design moderne et dynamique, renforçant le caractère distinctif du véhicule.",
      image: "/images/model/equipment/equipment-cs15-1.webp",
    },
    {
      title: "Toit panoramique ouvrant",
      text: "Le toit panoramique ouvrant offre une sensation d'espace et de luminosité pour un confort optimal à bord.",
      image: "/images/model/comfort/comfort-cs15-1.webp",
    },
    {
      title: "Jantes en aluminium 17'",
      text: "Les jantes en aluminium 17'' allient élégance et performance pour une meilleure stabilité et une allure sportive.",
      image: "/images/model/equipment/equipment-cs15-2.webp",
    },
    {
      title: "Feux de jour à LED",
      text: "Les feux de jour à LED améliorent la visibilité et renforcent la signature lumineuse moderne du véhicule.",
      image: "/images/model/equipment/equipment-cs15-4.webp",
    },
  ],
  gallery: [
    "/images/model/gallery/gallery-cs15-front.png",
    "/images/model/gallery/gallery-cs15-side.png",
    "/images/model/gallery/gallery-cs15-rear.png",
  ],
  specs: [
    { group: "Motorisation", label: "Motorisation", value: "1.5L 101CH" },
    { group: "Motorisation", label: "Boîte automatique", value: "5 DCT" },
    { group: "Consommation", label: "Consommation", value: "7.8L / 100 Km" },
    { group: "Dimensions", label: "Volume du coffre", value: "284 L" },
    { group: "Dimensions", label: "Jantes", value: "17' en aluminium" },
    { group: "Garantie", label: "Km illimité / Garantie", value: "6 ans" },
  ],
  pdf: "/FT CS15.pdf",
  hasSpin: false,
};
