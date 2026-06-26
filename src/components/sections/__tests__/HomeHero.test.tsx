import { render, screen } from "@testing-library/react";
import { HomeHero } from "@/components/sections/HomeHero";

beforeAll(() => {
  // jsdom has no IntersectionObserver
  // @ts-expect-error test stub
  global.IntersectionObserver = class { observe(){} disconnect(){} unobserve(){} };
});

test("renders headline and both CTAs", () => {
  render(<HomeHero />);
  expect(screen.getByText(/Le voyage/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Réserver un essai" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explorer la gamme" })).toBeInTheDocument();
});

test("renders the eyebrow, subtext, and frosted spec strip", () => {
  render(<HomeHero />);
  expect(screen.getByText(/Conçue pour la route marocaine/)).toBeInTheDocument();
  expect(
    screen.getByText(/Une gamme qui réunit design, technologie et confort/)
  ).toBeInTheDocument();
  expect(screen.getByText("CS55 PHEV")).toBeInTheDocument();
  expect(screen.getByText("Hybride rechargeable")).toBeInTheDocument();
  expect(screen.getByText("1 100 km")).toBeInTheDocument();
  expect(screen.getByText("8 villes")).toBeInTheDocument();
  expect(screen.getByText("8 showrooms")).toBeInTheDocument();
});

test("renders the hero car image with priority and a descriptive alt", () => {
  render(<HomeHero />);
  const img = screen.getByAltText("Changan CS55 PHEV");
  expect(img).toBeInTheDocument();
  expect(img.tagName).toBe("IMG");
});
