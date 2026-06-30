import { render, screen } from "@testing-library/react";
import { CinematicSequence } from "@/components/sections/model/CinematicSequence";
import type { Cinematic3D } from "@/content/types";

const data: Cinematic3D = {
  frameCount: 120,
  mobileFrameCount: 60,
  framePath: "/images/model/cs55-phev/3d/desktop/{i}.avif",
  mobileFramePath: "/images/model/cs55-phev/3d/mobile/{i}.avif",
  poster: "/images/model/cs55-phev/3d/poster.avif",
  webpFallback: true,
  beats: [
    { at: 0, eyebrow: "Plan 01 · Vue aérienne", title: "Six mètres au-dessus" },
    { at: 0.5, eyebrow: "Plan 06 · Face arrière", title: "Signature lumineuse" },
  ],
};

test("renders nothing when there is no data", () => {
  const { container } = render(<CinematicSequence name="CS55 PHEV" />);
  expect(container).toBeEmptyDOMElement();
});

test("renders the beat captions and the poster in the scrub view", () => {
  render(<CinematicSequence data={data} name="CS55 PHEV" />);
  expect(screen.getByText("Six mètres au-dessus")).toBeInTheDocument();
  expect(screen.getByText("Plan 01 · Vue aérienne")).toBeInTheDocument();
  expect(screen.getByAltText("CS55 PHEV — vue extérieure")).toBeInTheDocument();
});

test("reduced motion renders the static poster, no scrub", async () => {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: /reduce/.test(query),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;

  render(<CinematicSequence data={data} name="CS55 PHEV" />);
  expect(await screen.findByText("CS55 PHEV sous tous les angles")).toBeInTheDocument();

  window.matchMedia = original;
});
