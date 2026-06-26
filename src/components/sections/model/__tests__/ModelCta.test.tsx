import { render, screen } from "@testing-library/react";
import { ModelCta } from "@/components/sections/model/ModelCta";

beforeAll(() => {
  // jsdom has no IntersectionObserver
  // @ts-expect-error test stub
  global.IntersectionObserver = class { observe(){} disconnect(){} unobserve(){} };
});

test("includes the model name and an essai link", () => {
  render(<ModelCta name="CS55 PHEV" />);
  expect(screen.getByText(/CS55 PHEV/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Réserver un essai" })).toHaveAttribute("href", "/essai");
});
