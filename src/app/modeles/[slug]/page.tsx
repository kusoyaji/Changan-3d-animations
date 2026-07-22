import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModelHero } from "@/components/sections/model/ModelHero";
import { ConfortSection } from "@/components/sections/model/ConfortSection";
import { EquipmentSection } from "@/components/sections/model/EquipmentSection";
import { CinematicSequence } from "@/components/sections/model/CinematicSequence";
import { ModelGallery } from "@/components/sections/model/ModelGallery";
import { Configurator } from "@/components/sections/model/Configurator";
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
      <ConfortSection
        eyebrow="Habitacle"
        heading="Le confort à bord"
        items={model.comfort}
      />
      <EquipmentSection
        eyebrow="Équipement"
        heading="Technologies embarquées"
        items={model.equipment}
      />
      <CinematicSequence data={model.cinematic3d} name={model.name} />
      <ModelGallery images={model.gallery} name={model.name} />
      <Configurator
        variants={model.colorVariants}
        specs={model.specs}
        pdf={model.pdf}
        name={model.name}
        id="specifications"
      />
      <ModelCta name={model.name} />
    </>
  );
}
