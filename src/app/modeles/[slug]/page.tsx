import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModelHero } from "@/components/sections/model/ModelHero";
import { ColorVariantSwitcher } from "@/components/sections/model/ColorVariantSwitcher";
import { FeatureSection } from "@/components/sections/model/FeatureSection";
import { CinematicSequence } from "@/components/sections/model/CinematicSequence";
import { ModelGallery } from "@/components/sections/model/ModelGallery";
import { Specifications } from "@/components/sections/model/Specifications";
import { ModelCta } from "@/components/sections/model/ModelCta";
import { getModel, modelSlugs } from "@/content/models";

export async function generateStaticParams() {
  return modelSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = getModel(slug);

  if (!model) {
    return { title: "Modèle introuvable" };
  }

  return {
    title: model.name,
    description: model.tagline || `Découvrez le ${model.name}.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModel(slug);

  if (!model) {
    notFound();
  }

  return (
    <>
      <ModelHero model={model} />
      <ColorVariantSwitcher variants={model.colorVariants} name={model.name} />
      <FeatureSection
        eyebrow="Confort"
        heading="Le confort à bord"
        features={model.comfort}
      />
      <FeatureSection
        eyebrow="Équipement"
        heading="Équipements & technologies"
        features={model.equipment}
        alt
      />
      <CinematicSequence data={model.cinematic3d} name={model.name} />
      <ModelGallery images={model.gallery} name={model.name} />
      <Specifications specs={model.specs} pdf={model.pdf} id="specifications" />
      <ModelCta name={model.name} />
    </>
  );
}
