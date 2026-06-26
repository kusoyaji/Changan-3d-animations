import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { showrooms } from "@/content/showrooms";
import { site } from "@/content/site";

test("renders social links and legal", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: /facebook/i })).toBeInTheDocument();
  expect(screen.getByText(/Mentions légales/i)).toBeInTheDocument();
});

test("renders all showroom cities linking to their slug pages", () => {
  render(<Footer />);
  for (const showroom of showrooms) {
    const link = screen.getByRole("link", { name: showroom.city });
    expect(link).toHaveAttribute("href", `/showrooms/${showroom.slug}`);
  }
});

test("renders the phone number as a tel link", () => {
  render(<Footer />);
  const phoneLink = screen.getByRole("link", { name: site.phone });
  expect(phoneLink).toHaveAttribute("href", `tel:${site.phone.replace(/[^+\d]/g, "")}`);
});

test("renders all social icons with accessible names and icon images", () => {
  render(<Footer />);
  for (const social of site.social) {
    const link = screen.getByRole("link", { name: social.label });
    const img = link.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", expect.stringContaining(encodeURIComponent(social.icon).replace(/%2F/g, "/")));
  }
});

test("renders legal links and copyright with current year", () => {
  render(<Footer />);
  const legalLink = screen.getByRole("link", { name: /mentions légales/i });
  expect(legalLink).toHaveAttribute("href", "/mentions-legales");
  const confidentialiteLink = screen.getByRole("link", { name: /confidentialité/i });
  expect(confidentialiteLink).toHaveAttribute("href", "/confidentialite");
  expect(screen.getByText(new RegExp(`${new Date().getFullYear()}.*Changan Maroc`))).toBeInTheDocument();
});

test("renders nav-ish links section", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: "Modèles" })).toHaveAttribute("href", "/modeles");
  expect(screen.getByRole("link", { name: "Hybride" })).toHaveAttribute("href", "/hybride");
  expect(screen.getByRole("link", { name: "Essai" })).toHaveAttribute("href", "/essai");
  expect(screen.getByRole("link", { name: "Reprise" })).toHaveAttribute("href", "/reprise");
  expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
});
