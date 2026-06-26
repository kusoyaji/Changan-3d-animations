import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia; components that check
// prefers-reduced-motion (e.g. Reveal) need a stub so they fall through to
// the IntersectionObserver path in tests, matching real-browser default.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
