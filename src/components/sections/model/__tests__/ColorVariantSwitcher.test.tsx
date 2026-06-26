import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColorVariantSwitcher } from "@/components/sections/model/ColorVariantSwitcher";

const variants = [
  { label: "Blanc", hex: "#EDEDED", image: "/a.png" },
  { label: "Noir", hex: "#16181B", image: "/b.png" },
];

test("renders nothing when no variants", () => {
  const { container } = render(<ColorVariantSwitcher variants={[]} name="X" />);
  expect(container).toBeEmptyDOMElement();
});

test("selecting a swatch updates the displayed image", async () => {
  render(<ColorVariantSwitcher variants={variants} name="CS55 PHEV" />);
  await userEvent.click(screen.getByRole("button", { name: "Noir" }));
  expect(screen.getByRole("button", { name: "Noir" })).toHaveAttribute("aria-pressed", "true");
});

test("first variant is selected by default", () => {
  render(<ColorVariantSwitcher variants={variants} name="CS55 PHEV" />);
  expect(screen.getByRole("button", { name: "Blanc" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Noir" })).toHaveAttribute("aria-pressed", "false");
});

test("renders the Couleurs eyebrow", () => {
  render(<ColorVariantSwitcher variants={variants} name="CS55 PHEV" />);
  expect(screen.getByText("Couleurs")).toBeInTheDocument();
});

test("displayed image alt includes the model name and selected label", () => {
  render(<ColorVariantSwitcher variants={variants} name="CS55 PHEV" />);
  expect(screen.getByAltText("CS55 PHEV — Blanc")).toBeInTheDocument();
});
