import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox, Prose } from "@/components/blocks";
import { Breadcrumbs, Container, Disclosure, JsonLd, Label, Photo } from "@/components/ui";
import { getGuide, getGuides } from "@/lib/content";
import { formatDate, site } from "@/lib/site";

// Every slug is prerendered from generateStaticParams, so a blocking render is fine.
export const instant = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const g = getGuide((await props.params).slug);
  if (!g) return {};
  return { title: g.title, description: g.excerpt };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const g = getGuide((await props.params).slug);
  if (!g) notFound();
  const more = getGuides().filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <article>
      <Container className="pt-6">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/guides", label: "Guides" }, { label: g.category }]} />
      </Container>
      <header className="pt-10 pb-12">
        <Container>
          <div className="mx-auto max-w-[760px] text-center">
            <Label>{g.category}</Label>
            <h1 className="mt-5 text-[2.3rem] leading-[1.06] font-normal tracking-[-0.04em] sm:text-[3.2rem]">{g.title}</h1>
            <p className="mx-auto mt-5 max-w-[600px] text-lg leading-relaxed text-ink-soft">{g.excerpt}</p>
            <p className="mt-5 text-sm text-ink-soft">
              By {site.author.name} · {formatDate(g.publishedAt)} · {g.readingMinutes} min read
            </p>
          </div>
        </Container>
      </header>
      <Container>
        <Photo src={g.image} alt="" className="mx-auto aspect-[16/8] max-w-[1000px] rounded-[var(--radius-card)]" sizes="1000px" tint="mint" />
        <div className="mx-auto mt-12 max-w-[680px] pb-20">
          <Disclosure />
          <Prose sections={g.sections} />
          {g.sources.length > 0 && (
            <div className="glass mt-12 rounded-[24px] p-6">
              <p className="font-display">Sources</p>
              <ul className="mt-3 space-y-2 text-sm">
                {g.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener" className="underline underline-offset-4">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-soft">Accessed {formatDate(site.pricesCheckedOn)}</p>
            </div>
          )}
          <div className="mt-10">
            <AuthorBox />
          </div>
          <div className="mt-16">
            <p className="font-display text-xl">Keep reading</p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {more.map((m) => (
                <li key={m.slug}>
                  <Link href={`/guides/${m.slug}`} className="block py-4 hover:underline hover:underline-offset-4">
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          datePublished: g.publishedAt,
          author: { "@type": "Person", name: site.author.name },
          publisher: { "@type": "Organization", name: "HumPage Listen" },
        }}
      />
    </article>
  );
}
