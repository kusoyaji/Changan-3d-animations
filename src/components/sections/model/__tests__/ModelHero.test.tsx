import { render, screen } from "@testing-library/react";
import { ModelHero } from "@/components/sections/model/ModelHero";
import { getModel } from "@/content/models";

beforeAll(() => {
  // jsdom has no IntersectionObserver
  // @ts-expect-error test stub
  global.IntersectionObserver = class { observe(){} disconnect(){} unobserve(){} };
});

test("renders nameplate and the essai CTA", () => {
  render(<ModelHero model={getModel("cs55-phev")!} />);
  expect(screen.getByText("CS55 PHEV")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Réserver un essai" })).toHaveAttribute("href", "/essai");
});

test("falls back to model name when tagline is empty", () => {
  render(<ModelHero model={getModel("alsvin")!} />);
  expect(screen.getAllByText(/ALSVIN/i).length).toBeGreaterThan(0);
});
