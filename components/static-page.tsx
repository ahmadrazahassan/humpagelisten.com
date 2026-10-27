import { Prose } from "@/components/blocks";
import { Container, Label } from "@/components/ui";
import { pages } from "@/lib/data/pages";
import { formatDate } from "@/lib/site";

export function StaticPage({ slug }: { slug: keyof typeof pages }) {
  const p = pages[slug];
  return (
    <article className="pb-24">
      <header className="pt-10 pb-10 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-[680px]">
            <Label>{p.label}</Label>
            <h1 className="mt-5 text-[2.5rem] leading-[1.05] font-normal tracking-[-0.045em] sm:text-[3.4rem]">{p.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{p.intro}</p>
            <p className="mt-4 text-sm text-ink-soft">Last updated {formatDate(p.updated)}</p>
          </div>
        </Container>
      </header>
      <Container>
        <div className="mx-auto max-w-[680px] border-t border-line">
          <Prose sections={p.sections} />
        </div>
      </Container>
    </article>
  );
}

export function staticMeta(slug: keyof typeof pages) {
  return { title: pages[slug].title, description: pages[slug].intro };
}
