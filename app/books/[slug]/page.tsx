import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Microphone } from "@phosphor-icons/react/dist/ssr";
import { AuthorBox, BookCard } from "@/components/blocks";
import { Breadcrumbs, Container, Cover, Disclosure, JsonLd, Label, PartnerButton, Stars, tintClass } from "@/components/ui";
import { getBook, getBooks } from "@/lib/content";
import { formatDate, site } from "@/lib/site";

// Every slug is prerendered from generateStaticParams, so a blocking render is fine.
export const instant = false;

export function generateStaticParams() {
  return getBooks().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: PageProps<"/books/[slug]">): Promise<Metadata> {
  const b = getBook((await props.params).slug);
  if (!b) return {};
  return { title: `${b.title} audiobook review`, description: b.quote };
}

export default async function BookReview(props: PageProps<"/books/[slug]">) {
  const b = getBook((await props.params).slug);
  if (!b) notFound();
  const related = b.related.map((r) => getBook(r)!).filter(Boolean);

  return (
    <article>
      <Container className="pt-6">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/books", label: "Books" }, { label: b.title }]} />
      </Container>

      <header className="pt-10 pb-16">
        <Container>
          <div className="grid gap-10 md:grid-cols-[340px_1fr] md:gap-16">
            <Cover src={b.cover} title={b.title} tile={tintClass[b.tint]} className="md:sticky md:top-8" sizes="340px" />
            <div>
              <Label>{b.genres.join(" · ")}</Label>
              <h1 className="mt-5 text-[2.5rem] leading-[1.05] font-normal tracking-[-0.045em] sm:text-[3.4rem]">{b.title}</h1>
              <p className="mt-3 text-xl text-ink-soft">by {b.authors.join(", ")}</p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-ink-soft">
                <li className="flex items-center gap-2">
                  <Microphone size={18} weight="light" />
                  Narrated by {b.narrators.join(", ")}
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={18} weight="light" />
                  {b.runtime}
                </li>
                <li>First published {b.year}</li>
              </ul>
              <div className="mt-8 grid max-w-[460px] grid-cols-2 gap-4">
                <div className="glass rounded-[20px] p-5">
                  <p className="text-sm text-ink-soft">Story</p>
                  <div className="mt-2">
                    <Stars value={b.storyRating} label="Story" />
                  </div>
                </div>
                <div className="glass rounded-[20px] p-5">
                  <p className="text-sm text-ink-soft">Narration</p>
                  <div className="mt-2">
                    <Stars value={b.narrationRating} label="Narration" />
                  </div>
                </div>
              </div>
              <blockquote className="mt-10 border-l-2 border-primary pl-6 font-display text-[1.5rem] leading-snug tracking-tight">“{b.quote}”</blockquote>

              <div className="prose-ph mt-12 max-w-[640px]">
                <h2>The story, without spoilers</h2>
                {b.summary.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <h2>The narration</h2>
                {b.narration.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-10 grid max-w-[640px] gap-4 sm:grid-cols-2">
                <div className="glass-edge rounded-[24px] bg-primary-soft p-6">
                  <p className="text-sm text-primary-ink">You will love it if</p>
                  <p className="mt-2 leading-relaxed">{b.loveIt}</p>
                </div>
                <div className="glass rounded-[24px] p-6">
                  <p className="text-sm text-ink-soft">Maybe skip it if</p>
                  <p className="mt-2 leading-relaxed">{b.skipIt}</p>
                </div>
              </div>

              <div className="glass mt-10 max-w-[640px] rounded-[var(--radius-card)] p-7">
                <p className="font-display text-xl">Where to listen</p>
                <Disclosure className="mt-2 text-xs" />
                <div className="mt-5 flex flex-wrap gap-3">
                  <PartnerButton partner="audiobooks-com" size="sm">
                    Find it on Audiobooks.com
                  </PartnerButton>
                  <PartnerButton partner="audible" variant="secondary" size="sm">
                    Try Audible free
                  </PartnerButton>
                  <PartnerButton partner="libro-fm" variant="secondary" size="sm">
                    Libro.fm
                  </PartnerButton>
                  <PartnerButton partner="libby" variant="secondary" size="sm">
                    Borrow free with Libby
                  </PartnerButton>
                </div>
                <p className="mt-4 text-xs text-ink-soft">Availability changes. Search the title in the app before spending a credit.</p>
              </div>

              <p className="mt-10 text-sm text-ink-soft">
                Reviewed by {site.author.name} · Updated {formatDate(b.updatedAt)} · Cover via {b.coverSource}, shown unedited
              </p>
              <div className="mt-6 max-w-[640px]">
                <AuthorBox />
              </div>
            </div>
          </div>
        </Container>
      </header>

      <section className="bg-bg/60 py-20">
        <Container>
          <h2 className="text-[2rem] font-normal">If you liked this, try</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {related.map((r) => (
              <BookCard key={r.slug} b={r} />
            ))}
          </div>
        </Container>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: {
            "@type": "Book",
            name: b.title,
            author: b.authors.map((a) => ({ "@type": "Person", name: a })),
            workExample: { "@type": "Book", bookFormat: "https://schema.org/AudiobookFormat", readBy: b.narrators.map((n) => ({ "@type": "Person", name: n })) },
          },
          author: { "@type": "Person", name: site.author.name },
          reviewRating: { "@type": "Rating", ratingValue: b.storyRating, bestRating: 5 },
          reviewBody: b.quote,
        }}
      />
    </article>
  );
}
