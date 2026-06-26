import { Bricolage_Grotesque, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const changan = localFont({
  src: [
    { path: "../../public/changan-font/ChangAnunitype-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/changan-font/ChangAnunitype-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/changan-font/ChangAnunitype-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-brand",
  display: "swap",
});
