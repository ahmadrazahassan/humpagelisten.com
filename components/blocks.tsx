import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, Check, Clock, Microphone, X } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo, Container, Cover, Label, PartnerButton, Score, Stars, tintClass } from "@/components/ui";
import { site } from "@/lib/site";
import type { Book, Faq, Section, Service } from "@/lib/types";

export function PageIntro({ label, title, intro, children }: { label: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="pt-10 pb-14 sm:pt-16 sm:pb-20">
      <Container>
        <div className="reveal mx-auto max-w-[780px] text-center">
          <Label>{label}</Label>
          <h1 className="mt-5 text-[2.5rem] leading-[1.04] font-normal tracking-[-0.045em] sm:text-[3.75rem]">{title}</h1>
          {intro && <p className="mx-auto mt-6 max-w-[600px] text-lg leading-relaxed text-ink-soft">{intro}</p>}
          {children}
        </div>
      </Container>
    </section>
  );
}

/** Paragraph text with minimal [label](href) link support. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return p;
        return m[2].startsWith("/") ? (
          <Link key={i} href={m[2]}>
            {m[1]}
          </Link>
        ) : (
          <a key={i} href={m[2]} target="_blank" rel="noopener">
            {m[1]}
          </a>
        );
      })}
    </>
  );
}

export function Prose({ sections }: { sections: Section[] }) {
  return (
    <div className="prose-ph">
      {sections.map((s) => (
        <div key={s.heading}>
          <h2 id={slugify(s.heading)}>{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="mt-4">
              <Rich text={p} />
            </p>
          ))}
          {s.list && (
            <ul className="mt-4">
              {s.list.map((li) => (
                <li key={li}>
                  <Rich text={li} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function FaqList({ faqs, title = "Frequently asked questions" }: { faqs: Faq[]; title?: string }) {
  return (
    <div>
      <h2 className="text-[1.75rem] font-normal">{title}</h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[1.05rem] [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="text-xl text-ink-soft transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 pr-8 leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="glass-edge rounded-[24px] bg-primary-soft p-6">
        <p className="font-display text-lg text-primary-ink">What I like</p>
        <ul className="mt-4 space-y-3">
          {pros.map((p) => (
            <li key={p} className="flex gap-3 leading-relaxed">
              <Check size={18} weight="regular" className="mt-1 shrink-0 text-[#0fa947]" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="glass rounded-[24px] p-6">
        <p className="font-display text-lg">What could be better</p>
        <ul className="mt-4 space-y-3">
          {cons.map((c) => (
            <li key={c} className="flex gap-3 leading-relaxed">
              <X size={16} weight="light" className="mt-1.5 shrink-0 text-ink-soft" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AuthorBox() {
  return (
    <div className="glass flex flex-col gap-5 rounded-[24px] p-6 sm:flex-row sm:items-center">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft font-display text-xl text-primary-ink">
        {initials(site.author.name)}
      </span>
      <div>
        <p className="font-display text-lg">{site.author.name}</p>
        <p className="text-sm text-ink-soft">{site.author.role}</p>
        <p className="mt-2 leading-relaxed text-ink-soft">
          {site.author.bio}{" "}
          <Link href="/about" className="text-ink underline underline-offset-4">
            More about me
          </Link>
        </p>
      </div>
    </div>
  );
}

export function ServiceCard({ s }: { s: Service }) {
  return (
    <Link href={`/reviews/${s.slug}`} className={clsx("glass-edge card-lift flex flex-col rounded-[var(--radius-card)] p-7", tintClass[s.tint])}>
      <div className="flex items-center justify-between">
        <BrandLogo src={s.logo} name={s.name} size={48} />
        <Score value={s.score} />
      </div>
      <p className="mt-6 text-sm text-ink-soft">{s.badge}</p>
      <h3 className="mt-1 font-display text-2xl tracking-tight">{s.name}</h3>
      <p className="mt-3 leading-relaxed">{s.verdict}</p>
      <p className="mt-auto pt-6 text-sm text-ink-soft">{s.priceFrom}</p>
    </Link>
  );
}

export function BookCard({ b }: { b: Book }) {
  return (
    <Link href={`/books/${b.slug}`} className="glass card-lift flex flex-col rounded-[var(--radius-card)] p-5">
      <Cover src={b.cover} title={b.title} tile={tintClass[b.tint]} />
      <div className="flex flex-1 flex-col px-1 pt-5">
        <p className="text-sm text-ink-soft">{b.genres.join(" · ")}</p>
        <h3 className="mt-1 font-display text-xl leading-snug tracking-tight">{b.title}</h3>
        <p className="mt-1 text-ink-soft">{b.authors.join(", ")}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Microphone size={15} weight="light" />
            {b.narrators[0]}
            {b.narrators.length > 1 ? " and others" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={15} weight="light" />
            {b.runtime.replace("About ", "")}
          </span>
        </div>
        <div className="mt-3">
          <Stars value={b.storyRating} label="Story" />
        </div>
      </div>
    </Link>
  );
}

export function FactsTable({ s }: { s: Service }) {
  return (
    <div className="glass overflow-hidden rounded-[24px]">
      <div className="flex items-center justify-between border-b border-line bg-black/[0.025] px-6 py-4">
        <p className="font-display">At a glance</p>
        <p className="text-xs text-ink-soft">Checked {new Date(s.updatedAt + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
      </div>
      <dl className="divide-y divide-line">
        {s.facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[120px_1fr_auto] items-start gap-4 px-6 py-4 sm:grid-cols-[160px_1fr_auto]">
            <dt className="text-sm text-ink-soft">{f.label}</dt>
            <dd className="text-[0.97rem] leading-relaxed">{f.value}</dd>
            <a href={f.sourceUrl} target="_blank" rel="noopener" className="text-ink-soft hover:text-ink" aria-label={`Source for ${f.label}`}>
              <ArrowUpRight size={16} weight="light" />
            </a>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function FinalCta({ s }: { s: Service }) {
  return (
    <div className={clsx("glass-edge rounded-[var(--radius-card)] p-8 text-center sm:p-12", tintClass[s.tint])}>
      <BrandLogo src={s.logo} name={s.name} size={56} className="mx-auto" />
      <h2 className="mx-auto mt-5 max-w-[520px] text-[1.9rem] leading-tight font-normal">Ready to try {s.name}?</h2>
      <p className="mx-auto mt-3 max-w-[480px] text-ink-soft">
        {s.priceFrom}. Trial: {s.trial}. Check the current offer on the official site before you sign up.
      </p>
      <div className="mt-7">
        <PartnerButton partner={s.partnerSlug}>{s.ctaLabel}</PartnerButton>
      </div>
    </div>
  );
}

