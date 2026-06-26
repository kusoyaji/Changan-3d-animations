import type { Metadata } from "next";
import { bricolage, interTight, plexMono, changan } from "./fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const description =
  "Changan au Maroc : découvrez la gamme de véhicules hybrides et thermiques Changan, réservez un essai et trouvez votre showroom.";

export const metadata: Metadata = {
  metadataBase: new URL("https://changan.ma"),
  title: {
    default: "Changan Maroc",
    template: "%s · Changan Maroc",
  },
  description,
  openGraph: {
    title: "Changan Maroc",
    description,
    locale: "fr_MA",
    images: ["/images/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${interTight.variable} ${plexMono.variable} ${changan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
