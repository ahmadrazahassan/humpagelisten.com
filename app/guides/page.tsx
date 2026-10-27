import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/blocks";
import { Container, Photo } from "@/components/ui";
import { getGuides } from "@/lib/content";
import { formatDate } from "@/lib/site";

export const metadata: Metadata = {
  title: "Audiobook guides",
  description: "Plain guides to audiobook credits, free trials, library apps, narrators and family listening.",
};

export default function GuidesPage() {
  const guides = getGuides();
  const tints = ["mint", "blush", "butter", "cloud"] as const;
  return (
    <>
      <PageIntro label="Guides" title="Guides for better listening" intro="Short, sourced answers to the questions people ask before they pay for an audiobook app." />
      <section className="pb-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g, i) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="glass card-lift flex flex-col overflow-hidden rounded-[var(--radius-card)]">
                <Photo src={g.image} alt="" className="aspect-[3/2]" sizes="(max-width: 768px) 100vw, 400px" tint={tints[i % 4]} />
                <div className="flex flex-1 flex-col p-7">
                  <span className="self-start rounded-full bg-primary-soft px-3 py-1 text-xs text-primary-ink">{g.category}</span>
                  <h2 className="mt-4 font-display text-xl leading-snug tracking-tight">{g.title}</h2>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{g.excerpt}</p>
                  <p className="mt-auto pt-6 text-sm text-ink-soft">
                    {formatDate(g.publishedAt)} · {g.readingMinutes} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
