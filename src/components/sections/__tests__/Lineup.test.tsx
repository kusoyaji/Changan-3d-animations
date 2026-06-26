import { render, screen } from "@testing-library/react";
import { Lineup } from "@/components/sections/Lineup";

beforeAll(() => {
  // jsdom has no IntersectionObserver
  // @ts-expect-error test stub
  global.IntersectionObserver = class { observe(){} disconnect(){} unobserve(){} };
});

test("renders a card linking to each of the six models", () => {
  render(<Lineup />);
  expect(screen.getByRole("link", { name: /CS55 PHEV/ })).toHaveAttribute("href", "/modeles/cs55-phev");
  expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(6);
});
