import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function ModelGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  if (images.length === 0) return null;

  return (
    <section className="bg-field">
      <Container className="py-16 lg:py-24">
        <Eyebrow>Galerie</Eyebrow>

        <Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, i) => (
              <div
                key={`${image}-${i}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-[16px]"
              >
                <Image
                  src={image}
                  alt={`${name} — vue ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
