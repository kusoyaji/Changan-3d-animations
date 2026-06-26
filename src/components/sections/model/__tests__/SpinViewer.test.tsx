import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { SpinViewer } from "@/components/sections/model/SpinViewer";

const frames = ["/f0.webp", "/f1.webp", "/f2.webp", "/f3.webp", "/f4.webp"];

test("renders nothing with fewer than 2 frames", () => {
  const { container } = render(<SpinViewer frames={["/only.webp"]} name="X" />);
  expect(container).toBeEmptyDOMElement();
});

test("range slider changes the visible frame", () => {
  render(<SpinViewer frames={frames} name="CS55 PHEV" />);
  const slider = screen.getByRole("slider", { name: /pivoter/i });
  fireEvent.change(slider, { target: { value: "2" } });
  // next/image rewrites `src` through its loader, so we assert the stable
  // `data-frame` signal on the wrapper rather than the (brittle) `src`.
  expect(screen.getByTestId("spin-frame")).toHaveAttribute("data-frame", "2");
});

test("renders the Vue 360° eyebrow and the drag hint", () => {
  render(<SpinViewer frames={frames} name="CS55 PHEV" />);
  expect(screen.getByText("Vue 360°")).toBeInTheDocument();
  expect(screen.getByText("Glissez pour faire pivoter")).toBeInTheDocument();
});

test("starts on frame 0 by default", () => {
  render(<SpinViewer frames={frames} name="CS55 PHEV" />);
  expect(screen.getByTestId("spin-frame")).toHaveAttribute("data-frame", "0");
  expect(screen.getByRole("img")).toHaveAttribute("alt", "CS55 PHEV — vue 360°");
});

test("dragging the surface horizontally advances the frame", () => {
  render(<SpinViewer frames={frames} name="CS55 PHEV" />);
  const surface = screen.getByTestId("spin-surface");
  fireEvent.pointerDown(surface, { clientX: 0, pointerId: 1 });
  fireEvent.pointerMove(surface, { clientX: 40, pointerId: 1 });
  fireEvent.pointerUp(surface, { clientX: 40, pointerId: 1 });
  expect(screen.getByTestId("spin-frame")).toHaveAttribute("data-frame", "1");
});
