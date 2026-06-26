import { render, screen } from "@testing-library/react";
import { FeatureSection } from "@/components/sections/model/FeatureSection";

beforeAll(() => {
  // jsdom has no IntersectionObserver; Reveal (used per-row) relies on it.
  // @ts-expect-error test stub
  global.IntersectionObserver = class { observe(){} disconnect(){} unobserve(){} };
});

test("renders nothing when empty", () => {
  const { container } = render(
    <FeatureSection eyebrow="Confort" heading="H" features={[]} />,
  );
  expect(container).toBeEmptyDOMElement();
});

test("renders each feature title", () => {
  render(
    <FeatureSection
      eyebrow="Confort"
      heading="Confort à bord"
      features={[{ title: "Toit panoramique", image: "/t.jpg" }]}
    />,
  );
  expect(screen.getByText("Toit panoramique")).toBeInTheDocument();
});

test("renders the eyebrow and heading", () => {
  render(
    <FeatureSection
      eyebrow="Confort"
      heading="Confort à bord"
      features={[{ title: "Toit panoramique", image: "/t.jpg" }]}
    />,
  );
  expect(screen.getByText("Confort")).toBeInTheDocument();
  expect(screen.getByText("Confort à bord")).toBeInTheDocument();
});

test("renders feature text when present", () => {
  render(
    <FeatureSection
      eyebrow="Confort"
      heading="Confort à bord"
      features={[
        {
          title: "Toit panoramique",
          text: "Une vue dégagée sur le ciel.",
          image: "/t.jpg",
        },
      ]}
    />,
  );
  expect(screen.getByText("Une vue dégagée sur le ciel.")).toBeInTheDocument();
});

test("does not render a paragraph when feature has no text", () => {
  render(
    <FeatureSection
      eyebrow="Confort"
      heading="Confort à bord"
      features={[{ title: "Toit panoramique", image: "/t.jpg" }]}
    />,
  );
  expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
});

test("renders multiple features", () => {
  render(
    <FeatureSection
      eyebrow="Équipement"
      heading="Équipement de série"
      features={[
        { title: "Toit panoramique", image: "/t.jpg" },
        { title: "Sièges chauffants", text: "Confort par tous les temps.", image: "/s.jpg" },
      ]}
    />,
  );
  expect(screen.getByText("Toit panoramique")).toBeInTheDocument();
  expect(screen.getByText("Sièges chauffants")).toBeInTheDocument();
  expect(screen.getByText("Confort par tous les temps.")).toBeInTheDocument();
});

test("image alt matches the feature title", () => {
  render(
    <FeatureSection
      eyebrow="Confort"
      heading="Confort à bord"
      features={[{ title: "Toit panoramique", image: "/t.jpg" }]}
    />,
  );
  expect(screen.getByAltText("Toit panoramique")).toBeInTheDocument();
});
