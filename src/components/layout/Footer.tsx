import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { showrooms } from "@/content/showrooms";
import { site } from "@/content/site";

const links = [
  { label: "Modèles", href: "/modeles" },
  { label: "Hybride", href: "/modeles/cs55-phev" },
  { label: "Essai", href: "/essai" },
  { label: "Reprise", href: "/reprise" },
  { label: "À propos", href: "/a-propos" },
];

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
];

const linkClassName =
  "text-[15px] text-white/70 transition-colors duration-150 ease-[var(--ease-out)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-[6px]";

export function Footer() {
  const telHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;

  return (
    <footer className="bg-ink text-white">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="inline-flex w-fit rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <Image src="/images/logo.svg" alt="Changan" width={700} height={501} className="h-8 w-auto" />
          </Link>
          <p className="max-w-[260px] text-[15px] text-white/70">
            Changan au Maroc : des véhicules hybrides et thermiques pensés pour votre quotidien.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold text-white">Showrooms</h2>
          <nav aria-label="Showrooms" className="flex flex-col gap-3">
            {showrooms.map((showroom) => (
              <Link key={showroom.slug} href={`/showrooms/${showroom.slug}`} className={linkClassName}>
                {showroom.city}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold text-white">Liens</h2>
          <nav aria-label="Liens" className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold text-white">Contact</h2>
          <a href={telHref} className={linkClassName}>
            {site.phone}
          </a>
          <div className="flex items-center gap-4">
            {site.social.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] opacity-80 transition-opacity duration-150 ease-[var(--ease-out)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <Image src={social.icon} alt="" width={20} height={20} unoptimized className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-[13px] text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Changan Maroc</p>
          <nav aria-label="Mentions légales" className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </footer>
  );
}
