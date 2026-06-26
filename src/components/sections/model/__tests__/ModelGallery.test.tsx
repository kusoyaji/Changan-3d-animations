import { render, screen } from "@testing-library/react";
import { ModelGallery } from "@/components/sections/model/ModelGallery";

beforeAll(() => {
  // jsdom has no IntersectionObserver; Reveal (optionally used in gallery) relies on it.
  // @ts-expect-error test stub
  global.IntersectionObserver = class { observe(){} disconnect(){} unobserve(){} };
});

test("renders nothing when empty", () => {
  const { container } = render(<ModelGallery images={[]} name="X" />);
  expect(container).toBeEmptyDOMElement();
});

test("renders one image per path with alt text", () => {
  render(<ModelGallery images={["/g1.webp", "/g2.webp"]} name="CS55 PHEV" />);
  expect(screen.getByAltText("CS55 PHEV — vue 1")).toBeInTheDocument();
  expect(screen.getByAltText("CS55 PHEV — vue 2")).toBeInTheDocument();
});
