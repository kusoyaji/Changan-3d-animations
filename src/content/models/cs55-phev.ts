import type { Model } from "../types";

export const cs55Phev: Model = {
  slug: "cs55-phev",
  name: "CS55 PHEV",
  nameplate: "CS55 PHEV",
  tagline: "Plus loin, en silence.",
  heroDesktop: "/images/vehicles/cs55-phev-home-v2.png",
  heroMobile: "/images/vehicles/cs55-phev-home-mobile.png",
  colorVariants: [
    {
      label: "Blanc",
      hex: "#EDEDED",
      image: "/images/model/banner/CS55-PHEV changan-blanc-metallic-fond-blanc.png",
    },
    {
      label: "Gris clair",
      hex: "#B9BEC4",
      image: "/images/model/banner/CS55-PHEV changan-gris-clair-metallic-fond-blanc.png",
    },
    {
      label: "Gris foncé",
      hex: "#54595F",
      image: "/images/model/banner/CS55-PHEV changan-gris-fonce-metallic-fond-blanc.png",
    },
    {
      label: "Noir",
      hex: "#16181B",
      image: "/images/model/banner/CS55-PHEV changan-noir-metallic-fond-blanc.png",
    },
  ],
  comfort: [
    { title: "Écran tactile 12.3\"", image: "/images/model/comfort/CS55 PHEV Ecran tactile 12.3'.jpg" },
    { title: "Toit ouvrant panoramique", image: "/images/model/comfort/CS55 PHEV Toit ouvrant panoramique.jpg" },
    { title: "Caméra 540°", image: "/images/model/comfort/CS55 PHEV Caméra 540°.jpg" },
  ],
  equipment: [
    { title: "Feux avant à LED", image: "/images/model/equipment/CS55-PHEV FEUX AVANT LED.jpg" },
    { title: "Jantes en aluminium", image: "/images/model/equipment/CS55-PHEV JANTES EN ALU.jpg" },
  ],
  gallery: [
    "/images/model/gallery/CS55 PHEV 2 face droite.png",
    "/images/model/gallery/CS55 PHEV arriere.png",
    "/images/model/gallery/CS55PHEV 1 arriere droite.png",
  ],
  specs: [
    { group: "Motorisation", label: "Type", value: "Hybride rechargeable" },
    { group: "Autonomie", label: "Combinée", value: "1 100 km" },
    { group: "Performance", label: "0–100 km/h", value: "8,5 s" },
  ],
  hasSpin: true,
  spinFrames: ["00", "01", "02", "03", "04"].map(
    (n) => `/images/model/cs55-phev/spin/frame-${n}.webp`
  ),
};
