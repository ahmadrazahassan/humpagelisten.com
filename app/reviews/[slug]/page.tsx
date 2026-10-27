import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox, BookCard, FactsTable, FaqList, FinalCta, ProsCons, Prose, ServiceCard } from "@/components/blocks";
import { BrandLogo, Breadcrumbs, ButtonLink, Container, Disclosure, JsonLd, Label, PartnerButton, Score } from "@/components/ui";
import { comparisons, getBooks, getService, getServices } from "@/lib/content";
import { formatDate, site } from "@/lib/site";

// Every slug is prerendered from generateStaticParams, so a blocking render is fine.
export const instant = false;

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/reviews/[slug]">): Promise<Metadata> {
  const s = getService((await props.params).slug);
  if (!s) return {};
  return { title: `${s.name} review`, description: s.verdict };
}

export default async function ServiceReview(props: PageProps<"/reviews/[slug]">) {
  const s = getService((await props.params).slug);
  if (!s) notFound();
  const alternatives = s.alternatives.map((a) => getService(a)!).filter(Boolean);
  const vs = comparisons.filter((c) => c.a === s.slug || c.b === s.slug);
  const books = getBooks().slice(0, 3);

  return (
    <article>
      <Container className="pt-6">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/reviews", label: "Reviews" }, { label: s.name }]} />
      </Container>

      <header className="pt-10 pb-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <BrandLogo src={s.logo} name={s.name} size={64} className="ring-1 ring-line" />
                <Label>{s.badge}</Label>
              </div>
              <h1 className="mt-6 text-[2.2rem] leading-[1.04] font-normal tracking-[-0.045em] break-words sm:text-[3.6rem]">{s.name} review</h1>
              <p className="mt-5 max-w-[620px] text-xl leading-relaxed text-ink-soft">{s.verdict}</p>
              <p className="mt-5 text-sm text-ink-soft">
                By {site.author.name} · Updated {formatDate(s.updatedAt)}
              </p>
            </div>
            <div className="glass rounded-[var(--radius-card)] p-7">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-ink-soft">HumPage Listen score</p>
                  <Score value={s.score} size="lg" />
                </div>
                <p className="text-right text-sm text-ink-soft">
                  {s.priceFrom}
                  <br />
                  {s.model}
                </p>
              </div>
              <Disclosure className="mt-6 text-xs" />
              <div className="mt-5 flex flex-col gap-3">
                <PartnerButton partner={s.partnerSlug} className="w-full">
                  {s.ctaLabel}
                </PartnerButton>
                <ButtonLink href="/compare" variant="secondary" className="w-full">
                  Compare alternatives
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <div className="grid gap-12 border-t border-line pt-14 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div className="min-w-0 space-y-12">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-[24px] p-6">
                <p className="text-sm text-ink-soft">Who it is for</p>
                <p className="mt-2 font-display text-lg leading-snug">{s.bestFor}</p>
              </div>
              <div className="glass rounded-[24px] p-6">
                <p className="text-sm text-ink-soft">Who should skip it</p>
                <p className="mt-2 font-display text-lg leading-snug">{s.notFor}</p>
              </div>
            </div>
            <FactsTable s={s} />
            <ProsCons pros={s.pros} cons={s.cons} />
            <div className="max-w-[680px]">
              <Prose sections={s.sections} />
            </div>
            <div className="max-w-[680px]">
              <FaqList faqs={s.faqs} />
            </div>
            <FinalCta s={s} />
            <AuthorBox />
          </div>

          <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
            <div className="glass rounded-[24px] p-6">
              <p className="font-display">On this page</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                {s.sections.map((sec) => (
                  <li key={sec.heading}>
                    <a href={`#${sec.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} className="hover:text-ink">
                      {sec.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {vs.length > 0 && (
              <div className="glass rounded-[24px] p-6">
                <p className="font-display">Head to head</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {vs.map((c) => (
                    <li key={c.a + c.b}>
                      <Link href={`/compare/${c.a}-vs-${c.b}`} className="underline underline-offset-4">
                        {getService(c.a)!.name} vs {getService(c.b)!.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>

      <section className="mt-24 bg-bg/60 py-20">
        <Container>
          <h2 className="text-[2rem] font-normal">Alternatives worth a look</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {alternatives.map((a) => (
              <ServiceCard key={a.slug} s={a} />
            ))}
          </div>
          <h2 className="mt-20 text-[2rem] font-normal">Good first listens</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {books.map((b) => (
              <BookCard key={b.slug} b={b} />
            ))}
          </div>
        </Container>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: { "@type": "Service", name: s.name },
          author: { "@type": "Person", name: site.author.name },
          reviewRating: { "@type": "Rating", ratingValue: s.score, bestRating: 10, worstRating: 0 },
          datePublished: s.updatedAt,
          reviewBody: s.verdict,
          publisher: { "@type": "Organization", name: "HumPage Listen" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </article>
  );
}
