import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { showrooms } from "@/content/showrooms";

export function ShowroomTeaser() {
  return (
    <section className="bg-field py-20 lg:py-28">
      <Container>
        <Reveal>
          <Eyebrow>Nos showrooms</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
            8 villes, 8 showrooms
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <ul className="mt-10 flex flex-wrap gap-3">
            {showrooms.map((showroom) => (
              <li key={showroom.slug}>
                <span className="inline-flex items-center rounded-full border border-sky px-4 py-2 text-[15px] text-ink">
                  {showroom.city}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-10">
            <Button href="/showrooms">Trouver un showroom</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
