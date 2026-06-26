import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/ui/Reveal";
beforeAll(() => {
  // jsdom has no IntersectionObserver
  // @ts-expect-error test stub
  global.IntersectionObserver = class { observe(){} disconnect(){} unobserve(){} };
});
test("renders children", () => {
  render(<Reveal><p>Bonjour</p></Reveal>);
  expect(screen.getByText("Bonjour")).toBeInTheDocument();
});
