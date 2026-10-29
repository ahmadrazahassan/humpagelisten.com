import type { Metadata } from "next";
import { Headphones, BookmarkSimple, Scales } from "@phosphor-icons/react/dist/ssr";
import { initials } from "@/components/blocks";
import { ButtonLink, Container, Label, Photo } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About HumPage Listen",
  description: "Who is behind HumPage Listen, why it exists, and how it is funded.",
};

const values = [
  { icon: Headphones, title: "Listen first", body: "Reviews start from listening, not from press releases or store pages." },
  { icon: Scales, title: "Same rules for everyone", body: "One rubric for every app, whether it pays us or not." },
  { icon: BookmarkSimple, title: "Show the receipts", body: "Every price links to its source and shows when it was checked." },
];

export default function About() {
  return (
    <>
      <section className="pt-10 pb-16 sm:pt-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <Label>About</Label>
              <h1 className="mt-5 text-[2.6rem] leading-[1.03] font-normal tracking-[-0.045em] sm:text-[3.8rem]">A small, honest guide to listening well</h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-soft">
                HumPage Listen started with a simple frustration: every audiobook app comparison I found was either a thinly disguised advert or years out of date. So I started keeping my own notes, with sources and dates, and this site is those notes tidied up.
              </p>
            </div>
            <Photo src="/images/about/workspace.png" alt="A person lying with arms spread wide in a green field" className="aspect-[4/3] rounded-[var(--radius-card)]" sizes="(max-width: 1024px) 100vw, 560px" tint="mint" />
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-20">
        <Container>
          <div className="mx-auto grid max-w-[900px] gap-10 md:grid-cols-[180px_1fr]">
            <span className="glass-edge flex h-[180px] w-[180px] items-center justify-center rounded-[28px] bg-primary-soft font-display text-6xl tracking-tight text-primary-ink" aria-hidden>
              {initials(site.author.name)}
            </span>
            <div>
              <p className="font-display text-2xl">{site.author.name}</p>
              <p className="text-ink-soft">{site.author.role}</p>
              <div className="prose-ph mt-6">
                <p>{site.author.bio}</p>
                <p>
                  I care most about two things that store pages rarely tell you: how a narrator sounds after ten hours, and what really happens to your library when you stop paying. Those two questions shape every review here.
                </p>
                <p>
                  HumPage Listen is funded by affiliate commissions from some of the services we review. HumPage Listen is an abc affiliate. I explain exactly how that works on the affiliate disclosure page, and why it never changes a score.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-bg/60 py-20">
        <Container>
          <div className="mx-auto grid max-w-[1000px] gap-5 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="glass rounded-[var(--radius-card)] p-8">
                <v.icon size={30} weight="light" />
                <h2 className="mt-6 font-display text-xl">{v.title}</h2>
                <p className="mt-2 leading-relaxed text-ink-soft">{v.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/how-we-review">How I review</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
