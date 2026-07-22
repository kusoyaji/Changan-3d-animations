import { render, screen } from "@testing-library/react";
import { HybridHighlight } from "@/components/sections/HybridHighlight";
import { ShowroomTeaser } from "@/components/sections/ShowroomTeaser";
import { LeadCta } from "@/components/sections/LeadCta";

beforeAll(() => {
  // jsdom has no IntersectionObserver
  // @ts-expect-error test stub
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
});

test("hybrid highlight links to the CS55 PHEV model page", () => {
  render(<HybridHighlight />);
  expect(screen.getByRole("link", { name: /CS55 PHEV/i })).toHaveAttribute(
    "href",
    "/modeles/cs55-phev"
  );
});

test("showroom teaser links to /showrooms", () => {
  render(<ShowroomTeaser />);
  expect(screen.getByRole("link", { name: /showroom/i })).toHaveAttribute(
    "href",
    "/showrooms"
  );
});

test("lead CTA offers an essai link", () => {
  render(<LeadCta />);
  expect(screen.getByRole("link", { name: /essai/i })).toHaveAttribute(
    "href",
    "/essai"
  );
});
