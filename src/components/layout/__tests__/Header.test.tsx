import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";
import { site } from "@/content/site";

test("desktop nav exposes the Modèles menu trigger and its model links", () => {
  render(<Header />);
  const nav = screen.getByRole("navigation", { name: "Navigation principale" });
  const trigger = within(nav).getByRole("button", { name: /Modèles/ });
  expect(trigger).toHaveAttribute("aria-haspopup", "true");
  expect(within(nav).getByRole("menuitem", { name: /CS55 PHEV/ })).toHaveAttribute(
    "href",
    "/modeles/cs55-phev",
  );
});

test("renders the primary CTA", () => {
  render(<Header />);
  expect(screen.getAllByRole("link", { name: /Réserver un essai/i })[0]).toBeInTheDocument();
});

test("renders the phone number as a tel link", () => {
  render(<Header />);
  const phoneLink = screen.getAllByRole("link", { name: site.phone })[0];
  expect(phoneLink).toHaveAttribute("href", `tel:${site.phone.replace(/[^+\d]/g, "")}`);
});

test("mobile menu toggle has accessible attributes and opens the panel", async () => {
  const user = userEvent.setup();
  render(<Header />);
  const toggle = screen.getByRole("button", { name: /ouvrir le menu/i });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
});
