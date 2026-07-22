import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { FramedImage } from "@/components/ui/FramedImage";

export function ModelGallery({
  images,
  name,
}: {
  readonly images: string[];
  readonly name: string;
}) {
  if (images.length === 0) return null;

  return (
    <section className="bg-field">
      <Container className="py-16 lg:py-24">
        <Eyebrow>Galerie</Eyebrow>

        {/* Single column, large: each image shows the whole car at its true ratio. */}
        <div className="mt-10 flex flex-col gap-6 lg:mt-14 lg:gap-8">
          {images.map((image, i) => (
            <Reveal key={`${image}-${i}`}>
              <div className="group overflow-hidden rounded-[16px]">
                <FramedImage
                  src={image}
                  alt={`${name} — vue ${i + 1}`}
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  priority={i === 0}
                  imgClassName="transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
