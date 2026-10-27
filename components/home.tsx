import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  CurrencyDollar,
  DeviceMobile,
  Microphone,
  SignOut,
  X,
} from "@phosphor-icons/react/dist/ssr";
import {
  BrandLogo,
  ButtonLink,
  Container,
  Cover,
  Label,
  PartnerButton,
  Photo,
  Score,
  SectionHead,
  Stars,
  TextLink,
  tintClass,
} from "@/components/ui";
import { Carousel, NewsletterForm, QuoteRotator } from "@/components/client";
import { subscribe } from "@/app/actions";
import { getBooks, getFeaturedServices, getGuides, getHomeFaqs, getService, getServices } from "@/lib/content";
import { formatDate, formatMonthYear, site } from "@/lib/site";
import type { Service } from "@/lib/types";

function HeroCard({ s, cta }: { s: Service; cta: string }) {
  return (
    <div className="glass-clear rounded-[24px] p-6 lg:w-[370px] lg:p-7">
      <div className="flex items-center justify-between">
        <Label>{s.badge}</Label>
        <Score value={s.score} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <BrandLogo src={s.logo} name={s.name} size={44} />
        <p className="font-display text-2xl tracking-tight">{s.name}</p>
      </div>
      <p className="mt-3 leading-relaxed text-ink-soft">{s.verdict}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <PartnerButton partner={s.partnerSlug} size="sm">
          {cta}
        </PartnerButton>
        <TextLink href={`/reviews/${s.slug}`}>Full review</TextLink>
      </div>
    </div>
  );
}

export function Hero() {
  const top = getService("audiobooks-com")!;
  const audible = getService("audible")!;
  return (
    <section className="pt-10 pb-20 sm:pt-16 sm:pb-28">
      <Container>
        <div className="reveal mx-auto max-w-[860px] text-center">
          <Label>Honest audiobook app reviews</Label>
          <h1 className="mt-6 text-[2.75rem] leading-[1.02] font-normal tracking-[-0.045em] sm:text-[4.6rem]">
            Find the audiobook app that fits how you actually listen
          </h1>
          <p className="mx-auto mt-7 max-w-[580px] text-lg leading-relaxed text-ink-soft">
            I compare every major service on the same five tests, check each price by hand, and tell you plainly which one is worth your
            money and which one is not.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/compare">Compare the services</ButtonLink>
            <ButtonLink href="/reviews" variant="secondary">
              Read the reviews
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-ink-soft">Prices checked by hand in {formatMonthYear(site.pricesCheckedOn)}</p>
        </div>

        {/* Cards sit in the lower corners so the three people on the hill stay visible in the middle. */}
        <div className="relative mt-16 sm:mt-20">
          <Photo
            src="/images/hero/hero-listening.png"
            alt="Three friends standing on top of a round green hill under a clear blue sky"
            className="aspect-[4/3] rounded-[var(--radius-card)] sm:aspect-[16/8] lg:aspect-[16/7]"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            tint="mint"
          />
          <div className="relative z-10 -mt-12 grid gap-4 px-3 sm:-mt-20 sm:grid-cols-2 sm:px-6 lg:absolute lg:inset-x-8 lg:bottom-8 lg:mt-0 lg:flex lg:justify-between lg:px-0">
            <HeroCard s={top} cta="Start the free trial" />
            <HeroCard s={audible} cta="Try Audible free" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function MarqueeRow({ items, reverse, speed }: { items: React.ReactNode[]; reverse?: boolean; speed: string }) {
  return (
    <div className="marquee">
      <div className="marquee-track" data-reverse={reverse || undefined} style={{ "--marquee-speed": speed } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1 || undefined}>
            {items.map((item, i) => (
              <li key={i} className="pr-3">
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function TestedStrip() {
  const list = getServices();
  const chip = "glass-pill group flex items-center gap-3 rounded-full py-2 pr-5 pl-2 transition-transform duration-300 hover:-translate-y-0.5";
  const top = list.map((s) => (
    <Link key={s.slug} href={`/reviews/${s.slug}`} className={chip} tabIndex={-1}>
      <BrandLogo src={s.logo} name={s.name} size={34} className="ring-1 ring-line" />
      <span className="font-display text-[0.98rem] whitespace-nowrap text-ink">{s.name}</span>
      <span className="rounded-full bg-black/[0.04] px-2 py-0.5 font-display text-xs whitespace-nowrap text-ink-soft">{s.score.toFixed(1)}</span>
    </Link>
  ));
  const bottom = [...list].reverse().map((s) => (
    <Link key={s.slug} href={`/reviews/${s.slug}`} className={chip} tabIndex={-1}>
      <BrandLogo src={s.logo} name={s.name} size={34} className="ring-1 ring-line" />
      <span className="text-[0.92rem] whitespace-nowrap text-ink-soft">
        <span className="font-display text-ink">{s.name}</span> · {s.badge}
      </span>
    </Link>
  ));
  return (
    <section className="border-y border-line bg-bg/50 py-14">
      <Container>
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-muted" />
          <p className="text-sm text-ink-soft">Services compared on HumPage Listen</p>
          <span className="h-px w-8 bg-muted" />
        </div>
      </Container>
      <div className="space-y-3">
        <MarqueeRow items={top} speed="48s" />
        <MarqueeRow items={bottom} speed="56s" reverse />
      </div>
      {/* Plain links for keyboard and screen reader users; the moving chips are skipped in tab order. */}
      <nav aria-label="Service reviews" className="sr-only">
        <ul>
          {list.map((s) => (
            <li key={s.slug}>
              <Link href={`/reviews/${s.slug}`}>{s.name} review</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function FeatureServiceCard({ s }: { s: Service }) {
  return (
    <article className={clsx("glass-edge flex w-[86vw] shrink-0 snap-start flex-col rounded-[var(--radius-card)] p-7 sm:w-[560px] sm:p-9", tintClass[s.tint])}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandLogo src={s.logo} name={s.name} size={52} />
          <div>
            <p className="text-sm text-ink-soft">{s.badge}</p>
            <h3 className="font-display text-[1.7rem] leading-tight tracking-tight">{s.name}</h3>
          </div>
        </div>
        <Score value={s.score} />
      </div>
      <p className="mt-6 text-lg leading-relaxed">{s.verdict}</p>
      <ul className="mt-6 flex flex-wrap gap-2 text-sm">
        <li className="glass-pill rounded-full px-3.5 py-1.5">{s.priceFrom}</li>
        <li className="glass-pill rounded-full px-3.5 py-1.5">Trial: {s.trial.split(",")[0]}</li>
        <li className="glass-pill rounded-full px-3.5 py-1.5">{s.offline ? "Offline listening" : "Streaming only"}</li>
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
        <PartnerButton partner={s.partnerSlug}>Start the free trial</PartnerButton>
        <TextLink href={`/reviews/${s.slug}`}>Read the full review</TextLink>
      </div>
    </article>
  );
}

function SmallServiceCard({ s }: { s: Service }) {
  return (
    <Link
      href={`/reviews/${s.slug}`}
      className={clsx("glass-edge card-lift group flex w-[70vw] shrink-0 snap-start flex-col rounded-[var(--radius-card)] p-7 sm:w-[290px]", tintClass[s.tint])}
    >
      <div className="flex items-center justify-between">
        <BrandLogo src={s.logo} name={s.name} size={44} />
        <Score value={s.score} />
      </div>
      <h3 className="mt-6 font-display text-[1.45rem] leading-tight tracking-tight">{s.name}</h3>
      <p className="mt-2 text-ink-soft">{s.badge}</p>
      <p className="mt-4 text-[0.95rem] leading-relaxed">{s.bestFor}.</p>
      <span className="mt-auto flex h-12 w-12 items-center justify-center self-start glass-pill rounded-full pt-0 transition-transform group-hover:translate-x-1 [margin-top:2rem]">
        <ArrowRight size={20} weight="light" />
      </span>
    </Link>
  );
}

export function TopServices() {
  const [first, ...rest] = getFeaturedServices();
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-muted" />
            <Label>Top services</Label>
          </div>
          <h2 className="text-[2.4rem] leading-[1.02] font-normal tracking-[-0.045em] sm:text-[4rem] lg:text-right">
            My shortlist for {site.pricesCheckedOn.slice(0, 4)}
          </h2>
        </div>
        <Carousel
          progress
          aside={
            <p className="max-w-[440px] text-ink-soft">
              Each pick wins a category, not a popularity contest. Scores come from the same weighted rubric for every app.{" "}
              <Link href="/how-we-review" className="text-ink underline underline-offset-4">
                How I score services
              </Link>
            </p>
          }
        >
          <FeatureServiceCard s={first} />
          {rest.map((s) => (
            <SmallServiceCard key={s.slug} s={s} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}

function YesNo({ v }: { v: boolean | "partly" }) {
  if (v === "partly") return <span className="text-sm text-ink-soft">Partly</span>;
  return v ? (
    <Check size={20} weight="regular" className="text-[#0fa947]" aria-label="Yes" />
  ) : (
    <X size={18} weight="light" className="text-muted" aria-label="No" />
  );
}

export function QuickCompare() {
  const rows = getFeaturedServices();
  return (
    <section className="bg-bg/60 py-24 sm:py-32">
      <Container>
        <SectionHead label="Compare" title="The short version" intro="How the six services I recommend most often stack up on the things people ask me about." />
        <div className="mt-14 glass hidden overflow-hidden rounded-[var(--radius-card)] lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-sm text-ink-soft">
                <th className="px-6 py-5 font-normal">Service</th>
                <th className="px-4 py-5 font-normal">How it works</th>
                <th className="px-4 py-5 font-normal">Price from</th>
                <th className="px-4 py-5 font-normal">Offline</th>
                <th className="px-4 py-5 font-normal">Keep books</th>
                <th className="px-4 py-5 font-normal">Best for</th>
                <th className="px-6 py-5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.slug} className="border-b border-line last:border-0">
                  <td className="px-6 py-5">
                    <Link href={`/reviews/${s.slug}`} className="flex items-center gap-3 font-display">
                      <BrandLogo src={s.logo} name={s.name} size={32} className="ring-1 ring-line" />
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-4 py-5 text-[0.95rem]">{s.model}</td>
                  <td className="px-4 py-5 text-[0.95rem]">{s.priceFrom}</td>
                  <td className="px-4 py-5">
                    <YesNo v={s.offline} />
                  </td>
                  <td className="px-4 py-5">
                    <YesNo v={s.keepAfterCancel === "partly" ? "partly" : s.keepAfterCancel === "yes"} />
                  </td>
                  <td className="max-w-[240px] px-4 py-5 text-[0.95rem] text-ink-soft">{s.badge}</td>
                  <td className="px-6 py-5 text-right">
                    <PartnerButton partner={s.partnerSlug} variant="secondary" size="sm">
                      Visit
                    </PartnerButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
          {rows.map((s) => (
            <div key={s.slug} className="glass rounded-[24px] p-6">
              <Link href={`/reviews/${s.slug}`} className="flex items-center gap-3 font-display text-lg">
                <BrandLogo src={s.logo} name={s.name} size={36} className="ring-1 ring-line" />
                {s.name}
              </Link>
              <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-ink-soft">How it works</dt>
                <dd>{s.model}</dd>
                <dt className="text-ink-soft">Price from</dt>
                <dd>{s.priceFrom}</dd>
                <dt className="text-ink-soft">Keep books</dt>
                <dd>{s.keepAfterCancel === "yes" ? "Yes" : s.keepAfterCancel === "partly" ? "Partly" : "No"}</dd>
              </dl>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-ink-soft">
            Prices checked {formatDate(site.pricesCheckedOn)}. Prices and trial offers change, so confirm on the official site.
          </p>
          <ButtonLink href="/compare" variant="secondary">
            See the full comparison
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export const tests = [
  { icon: BookOpen, title: "Catalog check", body: "I search the same 40 titles on every app, from new releases to backlist classics." },
  { icon: Microphone, title: "Narration and audio", body: "Sample quality, speed controls, and how well the player handles long books." },
  { icon: DeviceMobile, title: "App experience", body: "iOS, Android and web: downloads, sleep timer, bookmarks, and car playback." },
  { icon: CurrencyDollar, title: "Real yearly cost", body: "What twelve months actually costs, including credits, add ons and taxes." },
  { icon: SignOut, title: "Cancelling", body: "How easy it is to leave, and exactly what you keep afterwards." },
];

export const weights = [
  ["Catalog", 25],
  ["Value", 25],
  ["App", 20],
  ["Narration and audio", 15],
  ["Cancelling and ownership", 10],
  ["Support", 5],
] as const;

export function HowWeReview() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-muted" />
              <Label>How I review</Label>
            </div>
            <h2 className="text-[2rem] leading-[1.08] font-normal sm:text-[2.75rem]">Every review follows the same five tests</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Same titles, same devices, same questions. It is the only fair way to compare apps that work in very different ways.
            </p>
            <TextLink href="/how-we-review" className="mt-7">
              Read the full method
            </TextLink>
            <div className="glass mt-10 rounded-[24px] p-6">
              <p className="font-display">How the score is weighted</p>
              <ul className="mt-5 space-y-3.5">
                {weights.map(([k, v]) => (
                  <li key={k} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 text-sm">
                    <span>{k}</span>
                    <span className="text-ink-soft">{v}%</span>
                    <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-black/5">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${v * 4}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {tests.map((t, i) => (
              <li key={t.title} className="flex gap-6 py-8">
                <span className="font-display text-sm text-ink-soft">0{i + 1}</span>
                <t.icon size={28} weight="light" className="shrink-0 text-ink" />
                <div>
                  <h3 className="font-display text-xl">{t.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export function BookCarousel() {
  const books = getBooks();
  return (
    <section className="relative isolate overflow-hidden bg-night py-24 text-white sm:py-28">
      <Image src="/images/about/workspace.png" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-30" />
      <Container>
        <Carousel
          dark
          header={
            <div>
              <Label className="text-white/50">Book reviews</Label>
              <h2 className="mt-4 max-w-[560px] text-[2rem] leading-[1.08] font-normal text-white sm:text-[2.9rem]">
                Audiobooks I would press play on again
              </h2>
            </div>
          }
        >
          {books.map((b, i) => {
            const light = i === 2;
            const soft = light ? "text-ink-soft" : "text-white/60";
            return (
              <Link
                key={b.slug}
                href={`/books/${b.slug}`}
                className={clsx(
                  "card-lift flex w-[78vw] shrink-0 snap-start flex-col rounded-[24px] p-5 sm:w-[300px]",
                  light ? "glass-edge bg-blush text-ink" : "glass-dark text-white",
                )}
              >
                <Cover src={b.cover} title={b.title} tile={light ? "bg-white/60" : "bg-white/[0.06]"} />
                <p className="mt-5 text-[0.95rem] leading-relaxed">“{b.quote}”</p>
                <div className="mt-auto pt-6">
                  <p className="font-display text-lg leading-tight">{b.title}</p>
                  <p className={clsx("mt-1 text-sm", soft)}>
                    Narrated by {b.narrators.slice(0, 2).join(" and ")}
                    {b.narrators.length > 2 ? " and cast" : ""}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <Stars value={b.narrationRating} label="Narration" dark={!light} />
                    <span className={clsx("flex items-center gap-1 text-sm", soft)}>
                      <Clock size={15} weight="light" />
                      {b.runtime.replace("About ", "")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </Carousel>
        <div className="mt-10">
          <ButtonLink href="/books" variant="secondary">
            All book reviews
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function ListeningNotes() {
  const items = ["audiobooks-com", "libro-fm", "spotify", "libby"].map((slug) => {
    const s = getService(slug)!;
    return { quote: s.pullQuote, name: s.name, meta: `From my ${s.name} review`, href: `/reviews/${s.slug}`, cta: "Read the review" };
  });
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="relative">
          <Photo
            src="/images/sections/listening-notes.png"
            alt="A man walking alone across a wide green field under a soft cloudy sky"
            className="ml-auto aspect-[4/5] rounded-[var(--radius-card)] sm:aspect-[16/8] lg:w-[78%]"
            sizes="(max-width: 1024px) 100vw, 900px"
            tint="butter"
          />
          <div className="relative -mt-24 mx-4 glass-clear rounded-[var(--radius-card)] p-7 sm:mx-8 sm:p-10 lg:absolute lg:top-1/2 lg:left-0 lg:m-0 lg:w-[520px] lg:-translate-y-1/2">
            <Label className="mb-6">Listening notes</Label>
            <QuoteRotator items={items} />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function GuidesGrid() {
  const guides = getGuides().slice(0, 3);
  return (
    <section className="bg-bg/60 py-24 sm:py-32">
      <Container>
        <SectionHead label="Guides" title="Guides for better listening" intro="Plain answers to the questions that come up before you pay for anything." />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {guides.map((g, i) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="glass card-lift group flex flex-col overflow-hidden rounded-[var(--radius-card)]">
              <Photo src={g.image} alt="" className="aspect-[3/2]" sizes="(max-width: 768px) 100vw, 400px" tint={(["mint", "blush", "butter"] as const)[i % 3]} />
              <div className="flex flex-1 flex-col p-7">
                <span className="self-start rounded-full bg-primary-soft px-3 py-1 text-xs text-primary-ink">{g.category}</span>
                <h3 className="mt-4 font-display text-xl leading-snug tracking-tight">{g.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{g.excerpt}</p>
                <p className="mt-auto pt-6 text-sm text-ink-soft">{g.readingMinutes} min read</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/guides" variant="secondary">
            All guides
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function TrialCards() {
  const abc = getService("audiobooks-com")!;
  const libro = getService("libro-fm")!;
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHead label="Getting started" title="Start listening this week" />
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <div className="glass flex flex-col rounded-[var(--radius-card)] p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <BrandLogo src={abc.logo} name={abc.name} size={44} />
              <p className="font-display text-lg">New to audiobooks?</p>
            </div>
            <h3 className="mt-6 text-[1.9rem] leading-tight font-normal">Three books free for 30 days</h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              The Audiobooks.com trial includes one premium audiobook of your choice and two bonus VIP Rewards audiobooks. After 30 days it
              renews at $14.95 a month plus tax unless you cancel, and you can cancel any time.
            </p>
            <div className="mt-auto pt-8">
              <PartnerButton partner={abc.partnerSlug}>Start the Audiobooks.com free trial</PartnerButton>
              <p className="mt-4 text-xs text-ink-soft">Offer checked {formatDate(site.pricesCheckedOn)} on audiobooks.com/pricing.</p>
            </div>
          </div>
          <div className="glass-edge flex flex-col rounded-[var(--radius-card)] bg-primary-soft p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <BrandLogo src={libro.logo} name={libro.name} size={44} />
              <p className="font-display text-lg">Prefer to support bookshops?</p>
            </div>
            <h3 className="mt-6 text-[1.9rem] leading-tight font-normal">Credits that help your local store</h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Libro.fm costs $14.99 a month for one credit, and the independent bookstore you choose gets a share. Credits never expire and the
              audiobooks are free of DRM.
            </p>
            <div className="mt-auto pt-8">
              <PartnerButton partner={libro.partnerSlug} variant="secondary">
                Visit Libro.fm
              </PartnerButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FaqAndLatest() {
  const faqs = getHomeFaqs();
  const latest = getGuides().slice(0, 5);
  return (
    <section className="border-t border-line py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-[2rem] leading-tight font-normal">Questions people ask me</h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
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
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[2rem] leading-tight font-normal">Latest from the blog</h2>
              <ButtonLink href="/guides" variant="secondary" size="sm">
                View all
              </ButtonLink>
            </div>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {latest.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="group flex items-start justify-between gap-6 py-5">
                    <div>
                      <p className="text-sm text-ink-soft">{formatDate(g.publishedAt)}</p>
                      <p className="mt-1 font-display text-[1.05rem] group-hover:underline group-hover:underline-offset-4">{g.title}</p>
                    </div>
                    <ArrowRight size={20} weight="light" className="mt-6 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Newsletter() {
  return (
    <section id="newsletter" className="scroll-mt-8 pb-24 sm:pb-32">
      <Container>
        <div className="glass rounded-[var(--radius-card)] px-6 py-16 text-center sm:px-12">
          <Label>Newsletter</Label>
          <h2 className="mx-auto mt-5 max-w-[620px] text-[2rem] leading-[1.1] font-normal sm:text-[2.6rem]">
            One email a month. Only books worth your hours.
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-ink-soft">New reviews, price changes and the deals worth a credit. No spam, and you can leave any time.</p>
          <div className="mt-9">
            <NewsletterForm action={subscribe} />
          </div>
        </div>
      </Container>
    </section>
  );
}
