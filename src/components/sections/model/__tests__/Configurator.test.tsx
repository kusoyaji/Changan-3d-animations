import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Configurator } from "@/components/sections/model/Configurator";

const variants = [
  { label: "Blanc", hex: "#EDEDED", image: "/a.png" },
  { label: "Noir", hex: "#16181B", image: "/b.png" },
];

const specs = [
  { group: "Motorisation", label: "Type", value: "Hybride rechargeable" },
  { group: "Autonomie", label: "Combinée", value: "1 100 km" },
];

test("renders nothing when no colors, specs, or pdf", () => {
  const { container } = render(<Configurator variants={[]} specs={[]} name="X" />);
  expect(container).toBeEmptyDOMElement();
});

test("renders the merged Configuration heading", () => {
  render(<Configurator variants={variants} specs={specs} name="CS55 PHEV" />);
  expect(screen.getByText("Configuration")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 2, name: /Couleurs & caractéristiques/i }),
  ).toBeInTheDocument();
});

test("first variant is selected by default and shows its image", () => {
  render(<Configurator variants={variants} specs={specs} name="CS55 PHEV" />);
  expect(screen.getByRole("button", { name: "Blanc" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Noir" })).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByAltText("CS55 PHEV — Blanc")).toBeInTheDocument();
});

test("selecting a swatch updates the active variant", async () => {
  render(<Configurator variants={variants} specs={specs} name="CS55 PHEV" />);
  await userEvent.click(screen.getByRole("button", { name: "Noir" }));
  expect(screen.getByRole("button", { name: "Noir" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByAltText("CS55 PHEV — Noir")).toBeInTheDocument();
});

test("renders grouped specs and keeps the section anchor", () => {
  const { container } = render(
    <Configurator variants={variants} specs={specs} name="X" id="specifications" />,
  );
  expect(screen.getByText("Motorisation")).toBeInTheDocument();
  expect(screen.getByText("1 100 km")).toBeInTheDocument();
  expect(container.querySelector("#specifications")).not.toBeNull();
});

test("shows the PDF download when pdf is provided", () => {
  render(<Configurator variants={variants} specs={specs} pdf="/FT.pdf" name="X" />);
  expect(screen.getByRole("link", { name: /fiche technique/i })).toHaveAttribute("href", "/FT.pdf");
});

test("works with specs only (no colors)", () => {
  render(<Configurator variants={[]} specs={specs} name="X" />);
  expect(screen.getByText("Motorisation")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Blanc" })).not.toBeInTheDocument();
});
