"use client";

import { useCallback, useEffect, useRef, useState, useActionState } from "react";
import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

function RoundArrow({ dir, onClick, dark, disabled }: { dir: "prev" | "next"; onClick: () => void; dark?: boolean; disabled?: boolean }) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className={clsx(
        "flex h-12 w-12 items-center justify-center rounded-full transition-all disabled:opacity-35",
        dark ? "bg-white text-ink hover:scale-105" : "glass-pill text-ink hover:bg-white",
      )}
    >
      <Icon size={20} weight="light" />
    </button>
  );
}

/** Scroll snap carousel. Controls render either in the header row or under the track. */
export function Carousel({
  children,
  header,
  dark,
  progress,
  aside,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  dark?: boolean;
  progress?: boolean;
  aside?: React.ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ ratio: 0, atStart: true, atEnd: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPos({ ratio: max > 0 ? el.scrollLeft / max : 1, atStart: el.scrollLeft < 8, atEnd: el.scrollLeft > max - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: "smooth" });
  };

  const controls = (
    <div className="flex items-center gap-3">
      <RoundArrow dir="prev" onClick={() => go(-1)} dark={dark} disabled={pos.atStart} />
      <RoundArrow dir="next" onClick={() => go(1)} dark={dark} disabled={pos.atEnd} />
    </div>
  );

  return (
    <div>
      {header && (
        <div className="mb-10 flex items-end justify-between gap-6">
          {header}
          <div className="hidden shrink-0 sm:block">{controls}</div>
        </div>
      )}
      <div
        ref={track}
        onScroll={update}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:-mx-8 sm:px-8"
      >
        {children}
      </div>
      {(!header || progress) && (
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className={clsx(header && "sm:hidden")}>{controls}</div>
          {progress && (
            <div className="h-[3px] w-full max-w-[340px] overflow-hidden rounded-full bg-line" aria-hidden>
              <div className="h-full rounded-full bg-ink transition-all duration-300" style={{ width: `${Math.max(18, pos.ratio * 100)}%` }} />
            </div>
          )}
          {aside && <div className="sm:ml-auto">{aside}</div>}
        </div>
      )}
      {header && !progress && <div className="mt-6 sm:hidden">{controls}</div>}
    </div>
  );
}

/** Reference 1 style card: quote cycles with bare outline arrows. */
export function QuoteRotator({
  items,
}: {
  items: { quote: string; name: string; meta: string; href: string; cta: string }[];
}) {
  const [i, setI] = useState(0);
  const it = items[i];
  return (
    <div>
      <p key={i} className="reveal font-display text-[1.45rem] leading-[1.22] tracking-[-0.03em] text-ink sm:text-[1.8rem]">
        “{it.quote}”
      </p>
      <a href={it.href} className="mt-6 inline-flex rounded-full bg-primary-soft px-4 py-2 font-display text-sm text-primary-ink transition-colors hover:bg-[#d3f7de]">
        {it.cta}
      </a>
      <div className="mt-7 flex items-end justify-between border-t border-line pt-5">
        <div>
          <p className="font-display text-ink">{it.name}</p>
          <p className="text-sm text-ink-soft">{it.meta}</p>
        </div>
        <div className="flex gap-4">
          <button type="button" aria-label="Previous quote" onClick={() => setI((i - 1 + items.length) % items.length)} className="text-ink hover:text-ink-soft">
            <ArrowLeft size={26} weight="light" />
          </button>
          <button type="button" aria-label="Next quote" onClick={() => setI((i + 1) % items.length)} className="text-ink hover:text-ink-soft">
            <ArrowRight size={26} weight="light" />
          </button>
        </div>
      </div>
    </div>
  );
}

// values and at let a failed submit remount the form with what the visitor typed (React resets forms after an action).
type FormState = { ok: boolean; message: string; values?: Record<string, string>; at?: number } | null;

export function NewsletterForm({ action }: { action: (prev: FormState, data: FormData) => Promise<FormState> }) {
  const [state, formAction, pending] = useActionState(action, null);
  if (state?.ok) {
    return <p className="rounded-2xl bg-primary-soft px-5 py-4 text-primary-ink">{state.message}</p>;
  }
  return (
    <form key={state?.at ?? 0} action={formAction} className="mx-auto max-w-[520px]">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          name="email"
          defaultValue={state?.values?.email}
          type="email"
          required
          placeholder="you@example.com"
          className="h-[52px] flex-1 rounded-full glass-input px-5 outline-none"
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button className="btn btn-primary h-[52px]" disabled={pending}>
          {pending ? "Sending" : "Subscribe"}
        </button>
      </div>
      <label className="mt-4 flex items-start gap-3 text-left text-sm text-ink-soft">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#14E25B]" />
        <span>
          Yes, send me the monthly HumPage Listen newsletter. I can unsubscribe any time. Read the{" "}
          <a href="/privacy-policy" className="underline underline-offset-4">
            privacy policy
          </a>
          .
        </span>
      </label>
      {state && !state.ok && <p className="mt-3 text-sm text-[#b42318]">{state.message}</p>}
    </form>
  );
}

export function ContactForm({ action }: { action: (prev: FormState, data: FormData) => Promise<FormState> }) {
  const [state, formAction, pending] = useActionState(action, null);
  const v = state?.values;
  if (state?.ok) return <p className="rounded-2xl bg-primary-soft px-5 py-4 text-primary-ink">{state.message}</p>;
  const field = "glass-input w-full rounded-2xl px-4 py-3.5 outline-none";
  return (
    <form key={state?.at ?? 0} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-ink-soft">Name</span>
          <input name="name" required defaultValue={v?.name} className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-ink-soft">Email</span>
          <input name="email" type="email" required defaultValue={v?.email} className={field} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink-soft">Topic</span>
        <select name="topic" className={field} defaultValue={v?.topic ?? "question"}>
          <option value="question">A question</option>
          <option value="correction">A correction</option>
          <option value="partnership">Partnership</option>
          <option value="privacy_request">Privacy request</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink-soft">Message</span>
        <textarea name="message" required minLength={10} rows={6} defaultValue={v?.message} className={field} />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#14E25B]" />
        <span>I agree that HumPage Listen may use these details to reply to my message, as described in the privacy policy.</span>
      </label>
      {state && !state.ok && <p className="text-sm text-[#b42318]">{state.message}</p>}
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Sending" : "Send message"}
      </button>
    </form>
  );
}

const questions = [
  { id: "budget", q: "What do you want to spend each month?", options: [["free", "Nothing"], ["low", "Under $10"], ["mid", "About $15"], ["high", "More, I listen a lot"]] },
  { id: "keep", q: "Do you want to keep your books if you cancel?", options: [["yes", "Yes, I want to own them"], ["no", "No, access is fine"]] },
  { id: "pace", q: "How many books do you finish a month?", options: [["one", "About one"], ["many", "Two or more"]] },
  { id: "spotify", q: "Do you already pay for Spotify Premium?", options: [["yes", "Yes"], ["no", "No"]] },
] as const;

type Answers = Partial<Record<(typeof questions)[number]["id"], string>>;

function recommend(a: Answers): { slug: string; name: string; why: string } {
  if (a.budget === "free") return { slug: "libby", name: "Libby", why: "It is free with a library card, and you can add a paid app later for new releases." };
  if (a.spotify === "yes" && a.pace === "one" && a.keep === "no")
    return { slug: "spotify", name: "Spotify", why: "Your Premium plan already includes 15 hours a month, enough for about one book." };
  if (a.pace === "many" && a.keep === "no") return { slug: "everand", name: "Everand", why: "Unlocks plus a large set of included titles suit people who listen a lot." };
  if (a.budget === "low") return { slug: "chirp", name: "Chirp", why: "No subscription. Buy discounted books when deals appear and keep them." };
  if (a.pace === "many") return { slug: "audible", name: "Audible", why: "Premium pairs a monthly credit with an included catalog for the extra listening." };
  return { slug: "audiobooks-com", name: "Audiobooks.com", why: "One credit a month, books you keep, and a trial with three books to start." };
}

export function ComparePicker() {
  const [a, setA] = useState<Answers>({});
  const done = questions.every((q) => a[q.id]);
  const rec = done ? recommend(a) : null;
  return (
    <div className="space-y-8">
      {questions.map((q, n) => (
        <fieldset key={q.id}>
          <legend className="font-display text-lg">
            <span className="mr-2 text-ink-soft">{n + 1}.</span>
            {q.q}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {q.options.map(([v, label]) => (
              <button
                key={v}
                type="button"
                aria-pressed={a[q.id] === v}
                onClick={() => setA((p) => ({ ...p, [q.id]: v }))}
                className={clsx(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  a[q.id] === v ? "border-primary bg-primary-soft text-primary-ink" : "glass-pill border-transparent hover:bg-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <div aria-live="polite" className="glass rounded-[24px] p-6">
        {rec ? (
          <div className="reveal">
            <p className="text-sm text-ink-soft">My suggestion</p>
            <p className="mt-1 font-display text-3xl tracking-tight">{rec.name}</p>
            <p className="mt-2 text-ink-soft">{rec.why}</p>
            <a href={`/reviews/${rec.slug}`} className="btn btn-primary btn-sm mt-5">
              Read the {rec.name} review
            </a>
          </div>
        ) : (
          <p className="text-ink-soft">Answer the four questions and I will suggest a service, with the reason.</p>
        )}
      </div>
    </div>
  );
}
