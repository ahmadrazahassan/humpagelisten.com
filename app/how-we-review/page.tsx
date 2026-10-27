import type { Metadata } from "next";
import { PageIntro } from "@/components/blocks";
import { tests, weights } from "@/components/home";
import { Container, Label, Photo } from "@/components/ui";
import { getBooks } from "@/lib/content";

export const metadata: Metadata = {
  title: "How we review audiobook apps",
  description: "The five tests, the weighted scoring rubric, and the update and corrections policy behind every HumPage Listen review.",
};

const benchmark = [
  "Recent bestsellers in fiction and nonfiction",
  "Long epic fantasy and science fiction",
  "Celebrity and political memoirs read by the author",
  "Classics in modern recordings",
  "Children's and family titles",
  "Titles from smaller independent audio publishers",
];

export default function HowWeReview() {
  const books = getBooks();
  return (
    <>
      <PageIntro
        label="Method"
        title="How I review audiobook apps"
        intro="The same tests, the same titles and the same scoring for every service, so an 8.6 on one review means the same as an 8.6 on another."
      />
      <Container>
        <Photo src="/images/sections/how-we-review.png" alt="A laptop and a leather notebook resting on the grass in a sunny park" className="mx-auto aspect-[16/7] max-w-[1000px] rounded-[var(--radius-card)]" sizes="1000px" tint="butter" />

        <section className="mx-auto max-w-[900px] py-20">
          <h2 className="text-center text-[2.2rem] font-normal">The five tests</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {tests.map((t, i) => (
              <li key={t.title} className="glass rounded-[24px] p-7">
                <div className="flex items-center justify-between">
                  <t.icon size={28} weight="light" />
                  <span className="font-display text-sm text-ink-soft">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-xl">{t.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{t.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto grid max-w-[900px] gap-10 border-t border-line py-20 md:grid-cols-2">
          <div>
            <Label>Scoring</Label>
            <h2 className="mt-4 text-[2rem] font-normal leading-tight">How the score out of 10 is built</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Each area is scored out of 10, then weighted. Value is judged on the real cost of twelve months for someone who finishes about one book a month. Cancelling and ownership rewards services that let you keep what you paid for.
            </p>
          </div>
          <ul className="space-y-4 self-center">
            {weights.map(([k, v]) => (
              <li key={k}>
                <div className="flex justify-between text-sm">
                  <span>{k}</span>
                  <span className="text-ink-soft">{v}%</span>
                </div>
                <span className="mt-2 block h-2 overflow-hidden rounded-full bg-black/5">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${v * 4}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-[900px] border-t border-line py-20">
          <Label>Catalog check</Label>
          <h2 className="mt-4 text-[2rem] font-normal leading-tight">The benchmark list</h2>
          <p className="mt-4 max-w-[640px] leading-relaxed text-ink-soft">
            I search a fixed list of 40 audiobooks on every service. It mixes the groups below so no service wins just because it is strong in one genre. These titles from my book reviews are part of it:
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {benchmark.map((b) => (
              <li key={b} className="rounded-full bg-bg px-4 py-2.5 text-[0.95rem]">
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-ink-soft">{books.map((b) => b.title).join(", ")}.</p>
        </section>

        <section className="mx-auto mb-24 grid max-w-[900px] gap-5 md:grid-cols-2">
          <div className="glass-edge rounded-[var(--radius-card)] bg-primary-soft p-8">
            <h2 className="font-display text-2xl">Updates</h2>
            <p className="mt-3 leading-relaxed">
              Prices and plans are rechecked at least every 60 days, and immediately when a service announces a change. Each review shows the date it was last checked.
            </p>
          </div>
          <div className="glass rounded-[var(--radius-card)] p-8">
            <h2 className="font-display text-2xl">Money and independence</h2>
            <p className="mt-3 leading-relaxed">
              Some links earn a commission. That never changes a score, and free services are reviewed with the same care. Read the full affiliate disclosure for details.
            </p>
          </div>
        </section>
      </Container>
    </>
  );
}
