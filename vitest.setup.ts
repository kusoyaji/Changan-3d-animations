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

// jsdom has no IntersectionObserver; Reveal falls through to it after the
// matchMedia check above, so provide a no-op stub globally.
if (!("IntersectionObserver" in globalThis)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  // @ts-expect-error test stub
  globalThis.IntersectionObserver = MockIntersectionObserver;
}
