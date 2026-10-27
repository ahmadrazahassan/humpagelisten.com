import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "@phosphor-icons/react/dist/ssr";
import { PageIntro } from "@/components/blocks";
import { ComparePicker } from "@/components/client";
import { ServiceComparer, type CompareItem } from "@/components/comparer";
import { partnerHref } from "@/config/partners";
import { BrandLogo, Container, Disclosure, PartnerButton, SectionHead } from "@/components/ui";
import { comparisons, getService, getServices } from "@/lib/content";
import { formatDate, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare audiobook apps",
  description: "Side by side comparison of nine audiobook services: price, trial, offline listening, and what you keep after cancelling.",
};

export default function ComparePage() {
  const services = getServices();
  const items: CompareItem[] = services.map((s) => ({
    slug: s.slug,
    name: s.name,
    logo: s.logo,
    score: s.score,
    badge: s.badge,
    verdict: s.verdict,
    model: s.model,
    priceFrom: s.priceFrom,
    trial: s.trial,
    offline: s.offline,
    keepNote: s.keepNote,
    bestFor: s.bestFor,
    notFor: s.notFor,
    pros: s.pros.slice(0, 3),
    cons: s.cons.slice(0, 3),
    href: partnerHref(s.partnerSlug),
    ctaLabel: s.ctaLabel,
  }));
  const cols = [
    { k: "Score", v: (s: (typeof services)[number]) => <span className="font-display text-lg">{s.score.toFixed(1)}</span> },
    { k: "How it works", v: (s: (typeof services)[number]) => s.model },
    { k: "Price from", v: (s: (typeof services)[number]) => s.priceFrom },
    { k: "Free trial", v: (s: (typeof services)[number]) => s.trial },
    {
      k: "Offline",
      v: (s: (typeof services)[number]) =>
        s.offline ? <Check size={20} className="text-[#0fa947]" aria-label="Yes" /> : <X size={18} weight="light" className="text-muted" aria-label="No" />,
    },
    { k: "After you cancel", v: (s: (typeof services)[number]) => s.keepNote },
    { k: "Best for", v: (s: (typeof services)[number]) => s.bestFor },
  ];

  return (
    <>
      <PageIntro label="Compare" title="Compare audiobook apps side by side" intro="Pick two to four services you are deciding between and see price, trial, ownership and my verdict next to each other.">
        <Disclosure className="mt-6" />
      </PageIntro>

      <section className="pb-24">
        <Container>
          <ServiceComparer items={items} />
        </Container>
      </section>

      <section className="border-t border-line pt-20 pb-20">
        <Container>
          <h2 className="mb-8 text-center text-[2rem] leading-tight font-normal sm:text-[2.5rem]">All nine at a glance</h2>
          <div className="glass no-scrollbar overflow-x-auto rounded-[var(--radius-card)]">
            <table className="w-full min-w-[1080px] text-left text-[0.95rem]">
              <thead>
                <tr className="border-b border-line bg-bg text-sm text-ink-soft">
                  <th className="sticky left-0 z-10 bg-bg px-5 py-4 font-normal">Service</th>
                  {cols.map((c) => (
                    <th key={c.k} className="px-4 py-4 font-normal">
                      {c.k}
                    </th>
                  ))}
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.slug} className="border-b border-line align-top last:border-0">
                    <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-5 font-normal">
                      <Link href={`/reviews/${s.slug}`} className="flex items-center gap-3 font-display">
                        <BrandLogo src={s.logo} name={s.name} size={32} className="ring-1 ring-line" />
                        {s.name}
                      </Link>
                    </th>
                    {cols.map((c) => (
                      <td key={c.k} className="max-w-[200px] px-4 py-5 leading-relaxed">
                        {c.v(s)}
                      </td>
                    ))}
                    <td className="px-5 py-5">
                      <PartnerButton partner={s.partnerSlug} variant="secondary" size="sm">
                        Visit
                      </PartnerButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-sm text-ink-soft">
            Prices checked {formatDate(site.pricesCheckedOn)} on each official site. Offers change, so confirm before you subscribe.
          </p>
        </Container>
      </section>

      <section id="picker" className="scroll-mt-8 bg-bg/60 py-24">
        <Container>
          <SectionHead label="Not sure?" title="Which one is for me?" intro="Four quick questions. Nothing is saved or tracked." />
          <div className="glass mx-auto mt-12 max-w-[720px] rounded-[var(--radius-card)] p-7 sm:p-10">
            <ComparePicker />
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHead label="Head to head" title="Detailed comparisons" />
          <div className="mx-auto mt-12 grid max-w-[900px] gap-4 sm:grid-cols-2">
            {comparisons.map((c) => {
              const a = getService(c.a)!;
              const b = getService(c.b)!;
              return (
                <Link
                  key={c.a + c.b}
                  href={`/compare/${c.a}-vs-${c.b}`}
                  className="glass card-lift flex items-center gap-4 rounded-[24px] p-6"
                >
                  <span className="flex -space-x-2">
                    <BrandLogo src={a.logo} name={a.name} size={40} className="ring-2 ring-white" />
                    <BrandLogo src={b.logo} name={b.name} size={40} className="ring-2 ring-white" />
                  </span>
                  <span className="font-display text-lg">
                    {a.name} vs {b.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
