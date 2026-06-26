import { render, screen } from "@testing-library/react";
import { Specifications } from "@/components/sections/model/Specifications";

const specs = [
  { group: "Motorisation", label: "Type", value: "Hybride rechargeable" },
  { group: "Autonomie", label: "Combinée", value: "1 100 km" },
];

test("renders nothing when no specs and no pdf", () => {
  const { container } = render(<Specifications specs={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test("renders grouped specs and the section anchor", () => {
  const { container } = render(
    <Specifications specs={specs} id="specifications" />,
  );
  expect(screen.getByText("Motorisation")).toBeInTheDocument();
  expect(screen.getByText("1 100 km")).toBeInTheDocument();
  expect(container.querySelector("#specifications")).not.toBeNull();
});

test("shows the PDF download when pdf is provided", () => {
  render(<Specifications specs={specs} pdf="/FT CS15.pdf" />);
  expect(screen.getByRole("link", { name: /fiche technique/i })).toHaveAttribute(
    "href",
    "/FT CS15.pdf",
  );
});
