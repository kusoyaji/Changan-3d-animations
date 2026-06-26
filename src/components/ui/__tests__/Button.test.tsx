import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

test("renders a link when href is provided", () => {
  render(<Button href="/essai">Réserver un essai</Button>);
  const el = screen.getByRole("link", { name: "Réserver un essai" });
  expect(el).toHaveAttribute("href", "/essai");
});
test("primary variant uses azure background", () => {
  render(<Button>Go</Button>);
  expect(screen.getByRole("button")).toHaveClass("bg-azure");
});
