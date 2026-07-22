import type { Model } from "../types";

export const cs55Phev: Model = {
  slug: "cs55-phev",
  name: "CS55 PHEV",
  nameplate: "CS55 PHEV",
  tagline: "Plus loin, en silence.",
  logo: "/images/icons/LOGO NEW CS55 Phev.png",
  price: "269 900 DH",
  heroDesktop: "/images/vehicles/cutouts/cs55-phev.webp",
  heroMobile: "/images/vehicles/cutouts/cs55-phev.webp",
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
    { title: "Sellerie en cuir", image: "/images/model/comfort/CS55 PHEV CS55 PHEV Sellerie en cuir real pic.jpg" },
    { title: "Toit ouvrant panoramique", image: "/images/model/comfort/CS55 PHEV Toit ouvrant panoramique.jpg" },
    { title: "Écran tactile 12.3\"", image: "/images/model/comfort/CS55 PHEV Ecran tactile 12.3'.jpg" },
    { title: "Caméra 540°", image: "/images/model/comfort/CS55 PHEV Caméra 540°.jpg" },
    { title: "Boîte automatique E-CVT", image: "/images/model/comfort/CS55-PHEV  BOITE AUTOMATIQUE E-CVT.jpg" },
    { title: "Chargeur sans fil", image: "/images/model/comfort/CS55 PHEV Chargeur sans fil.jpg" },
  ],
  equipment: [
    {
      title: "Feux avant à LED",
      text: "Les feux avant à LED offrent une signature lumineuse moderne et une visibilité optimale.",
      image: "/images/model/equipment/CS55-PHEV FEUX AVANT LED.jpg",
    },
    {
      title: "Feux arrière à LED",
      text: "Les feux arrière à LED renforcent le design distinctif et améliorent la visibilité.",
      image: "/images/model/equipment/CS55-PHEV FEUX ARRIERE A LED.jpg",
    },
    {
      title: "Jantes en aluminium 19'",
      text: "Les jantes en aluminium 19'' allient élégance et performance pour une allure sportive.",
      image: "/images/model/equipment/CS55-PHEV JANTES EN ALU.jpg",
    },
    {
      title: "Caméra de rétroviseurs",
      text: "Caméras intégrées aux rétroviseurs pour une vision panoramique et une sécurité accrue.",
      image: "/images/model/equipment/CS55-PHEV CAMERA DE RETRO.jpg",
    },
  ],
  gallery: [
    "/images/model/gallery/CS55 PHEV 2 face droite.png",
    "/images/model/gallery/CS55 PHEV arriere.png",
    "/images/model/gallery/CS55PHEV 1 arriere droite.png",
  ],
  specs: [
    { group: "Motorisation", label: "Puissance combinée", value: "1.5L 325CH" },
    { group: "Motorisation", label: "Boîte automatique", value: "E-CVT" },
    { group: "Autonomie", label: "Autonomie électrique", value: "120 Km" },
    { group: "Consommation", label: "Consommation", value: "4.9L / 100 Km" },
    { group: "Dimensions", label: "Volume du coffre", value: "475 L" },
    { group: "Dimensions", label: "Jantes", value: "19' en aluminium" },
  ],
  hasSpin: false,
  cinematic3d: {
    frameCount: 180,
    mobileFrameCount: 90,
    framePath: "/images/model/cs55-phev/3d/desktop/{i}.avif",
    mobileFramePath: "/images/model/cs55-phev/3d/mobile/{i}.avif",
    poster: "/images/model/cs55-phev/3d/poster.avif",
    webpFallback: true,
    // `at` values track the final 10s golden-hour master: aerial → front → orbit
    // (¾ → profil → ¾ arrière → arrière) → through the REAR glass → interior.
    // Each sits where that content is on screen; kept ≥0.09 apart so the
    // plateau-then-fade caption logic never overlaps.
    beats: [
      { at: 0, eyebrow: "Plan 01 · Vue aérienne", title: "Six mètres au-dessus", text: "Le jour se lève sur le CS55 PHEV." },
      { at: 0.1, eyebrow: "Plan 02 · Face avant", title: "Le regard LED" },
      { at: 0.25, eyebrow: "Plan 03 · Trois-quarts avant", title: "Calandre diamant" },
      { at: 0.4, eyebrow: "Plan 04 · Profil", title: "Des lignes qui filent" },
      { at: 0.52, eyebrow: "Plan 05 · Trois-quarts arrière", title: "Épaules musclées" },
      { at: 0.63, eyebrow: "Plan 06 · Face arrière", title: "Signature lumineuse" },
      { at: 0.73, eyebrow: "Plan 07 · Immersion", title: "Par la lunette arrière", text: "La caméra entre par l'arrière." },
      { at: 0.92, eyebrow: "Plan 08 · À bord", title: "Cuir. Écrans. Silence." },
    ],
  },
};
