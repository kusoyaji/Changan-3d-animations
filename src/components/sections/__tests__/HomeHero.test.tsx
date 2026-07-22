import { render, screen } from "@testing-library/react";
import { HomeHero } from "@/components/sections/HomeHero";

test("hero leads with the first model and its CTAs", () => {
  render(<HomeHero />);
  expect(screen.getByRole("heading", { level: 1, name: "CS55 PHEV" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Réserver un essai/i })).toHaveAttribute("href", "/essai");
  expect(screen.getByRole("link", { name: /Découvrir/i })).toHaveAttribute("href", "/modeles/cs55-phev");
});

test("hero exposes a model switcher across the whole range", () => {
  render(<HomeHero />);
  const tabs = screen.getAllByRole("tab");
  expect(tabs).toHaveLength(6);
  expect(tabs[0]).toHaveAttribute("aria-selected", "true");
});

test("renders the active model image with a descriptive alt", () => {
  render(<HomeHero />);
  expect(screen.getByAltText("CS55 PHEV")).toBeInTheDocument();
});
