import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Spec } from "@/content/types";

function groupSpecs(specs: Spec[]) {
  const groups = new Map<string, Spec[]>();
  for (const spec of specs) {
    const existing = groups.get(spec.group);
    if (existing) {
      existing.push(spec);
    } else {
      groups.set(spec.group, [spec]);
    }
  }
  return groups;
}

export function Specifications({
  specs,
  pdf,
  id,
}: {
  specs: Spec[];
  pdf?: string;
  id?: string;
}) {
  if (specs.length === 0 && !pdf) {
    return null;
  }

  const groups = groupSpecs(specs);

  return (
    <section id={id ?? "specifications"} className="bg-field">
      <Container className="py-16 lg:py-24">
        <Eyebrow>Spécifications</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.02em] text-ink">
          Caractéristiques techniques
        </h2>

        {groups.size > 0 ? (
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {Array.from(groups.entries()).map(([group, groupSpecs]) => (
              <div key={group}>
                <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                  {group}
                </h3>
                <dl className="mt-3">
                  {groupSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-4 border-t border-line py-3"
                    >
                      <dt className="text-muted">{spec.label}</dt>
                      <dd className="font-display text-ink">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        ) : null}

        {pdf ? (
          <div className="mt-12">
            <Button href={pdf}>Télécharger la fiche technique</Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
