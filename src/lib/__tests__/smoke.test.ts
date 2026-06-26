import { cn } from "@/lib/cn";
test("cn filters falsy values", () => {
  expect(cn("a", false, "b", undefined)).toBe("a b");
});
