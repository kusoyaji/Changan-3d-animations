import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

test("renders nav links and the primary CTA", () => {
  render(<Header />);
  const nav = screen.getAllByRole("navigation")[0];
  expect(within(nav).getByRole("link", { name: "Modèles" })).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: "Réserver un essai" })[0]).toBeInTheDocument();
});

test("renders the phone number as a tel link", () => {
  render(<Header />);
  const phoneLink = screen.getAllByRole("link", { name: "+212 5 22 00 00 00" })[0];
  expect(phoneLink).toHaveAttribute("href", "tel:+212522000000");
});

test("mobile menu toggle has accessible attributes and opens the panel", async () => {
  const user = userEvent.setup();
  render(<Header />);
  const toggle = screen.getByRole("button", { name: /menu/i });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
});
