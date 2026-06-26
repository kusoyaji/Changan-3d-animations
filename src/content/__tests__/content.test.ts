import { allModels, getModel, modelSlugs } from "@/content/models";
import { showrooms } from "@/content/showrooms";

test("six model slugs are defined", () => {
  expect(modelSlugs).toEqual(
    expect.arrayContaining(["cs55-phev", "cs55", "cs35-plus", "cs15", "uni-k", "alsvin"])
  );
});

test("getModel returns the CS55 PHEV with a hero image", () => {
  const m = getModel("cs55-phev");
  expect(m?.heroDesktop).toMatch(/\.(png|webp|jpg)$/);
});

test("eight showrooms are defined", () => {
  expect(showrooms).toHaveLength(8);
});

test("allModels matches modelSlugs length", () => {
  expect(allModels).toHaveLength(modelSlugs.length);
});
