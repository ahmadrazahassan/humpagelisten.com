import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/blocks";
import { BrandLogo, Breadcrumbs, Container, Disclosure, Label, PartnerButton, Score } from "@/components/ui";
import { comparisons, getComparison } from "@/lib/content";
import { formatDate, site } from "@/lib/site";
import type { Service } from "@/lib/types";

// Every slug is prerendered from generateStaticParams, so a blocking render is fine.
export const instant = false;

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: `${c.a}-vs-${c.b}` }));
}

export async function generateMetadata(props: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const c = getComparison((await props.params).slug);
  if (!c) return {};
  return { title: `${c.a.name} vs ${c.b.name}`, description: `${c.a.name} or ${c.b.name}? Price, trial, catalog model and what you keep, side by side.` };
}

function verdict(a: Service, b: Service) {
  const winner = a.score >= b.score ? a : b;
  const other = winner === a ? b : a;
  return `${winner.name} scores higher overall, ${winner.score.toFixed(1)} against ${other.score.toFixed(1)}. Still, ${other.name} is the better pick for one group: ${other.bestFor.charAt(0).toLowerCase() + other.bestFor.slice(1)}.`;
}

export default async function VsPage(props: PageProps<"/compare/[slug]">) {
  const c = getComparison((await props.params).slug);
  if (!c) notFound();
  const { a, b } = c;
  const rows: [string, (s: Service) => React.ReactNode][] = [
    ["HumPage Listen score", (s) => <Score value={s.score} />],
    ["How it works", (s) => s.model],
    ["Price from", (s) => s.priceFrom],
    ["Free trial", (s) => s.trial],
    ["Offline listening", (s) => (s.offline ? "Yes" : "No")],
    ["After you cancel", (s) => s.keepNote],
    ["Best for", (s) => s.bestFor],
    ["Skip it if", (s) => s.notFor],
  ];

  return (
    <article>
      <Container className="pt-6">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/compare", label: "Compare" }, { label: `${a.name} vs ${b.name}` }]} />
      </Container>
      <header className="pt-10 pb-12">
        <Container>
          <div className="mx-auto max-w-[780px] text-center">
            <div className="flex justify-center -space-x-3">
              <BrandLogo src={a.logo} name={a.name} size={64} className="ring-4 ring-white" />
              <BrandLogo src={b.logo} name={b.name} size={64} className="ring-4 ring-white" />
            </div>
            <h1 className="mt-6 text-[2.4rem] leading-[1.05] font-normal tracking-[-0.045em] sm:text-[3.4rem]">
              {a.name} vs {b.name}
            </h1>
            <p className="mt-4 text-sm text-ink-soft">
              By {site.author.name} · Prices checked {formatDate(site.pricesCheckedOn)}
            </p>
            <Disclosure className="mt-5" />
          </div>
        </Container>
      </header>
      <Container>
        <div className="mx-auto max-w-[900px] pb-24">
          <div className="glass-edge rounded-[var(--radius-card)] bg-primary-soft p-7 sm:p-9">
            <Label className="text-primary-ink">Short answer</Label>
            <p className="mt-3 font-display text-xl leading-snug tracking-tight sm:text-2xl">{verdict(a, b)}</p>
          </div>

          <div className="glass no-scrollbar mt-10 overflow-x-auto rounded-[var(--radius-card)]">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line bg-bg">
                  <th className="w-[30%] px-5 py-4 text-sm font-normal text-ink-soft" />
                  {[a, b].map((s) => (
                    <th key={s.slug} className="px-5 py-4 font-display font-normal">
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([k, f]) => (
                  <tr key={k} className="border-b border-line align-top last:border-0">
                    <th scope="row" className="px-5 py-4 text-sm font-normal text-ink-soft">
                      {k}
                    </th>
                    <td className="px-5 py-4 leading-relaxed">{f(a)}</td>
                    <td className="px-5 py-4 leading-relaxed">{f(b)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[a, b].map((s) => (
              <div key={s.slug} className="glass flex flex-col rounded-[var(--radius-card)] p-7">
                <p className="font-display text-xl">{s.name}</p>
                <p className="mt-2 leading-relaxed text-ink-soft">{s.verdict}</p>
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                  <PartnerButton partner={s.partnerSlug} size="sm">
                    {s.ctaLabel}
                  </PartnerButton>
                  <Link href={`/reviews/${s.slug}`} className="text-sm underline underline-offset-4">
                    Full review
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <AuthorBox />
          </div>
        </div>
      </Container>
    </article>
  );
}
