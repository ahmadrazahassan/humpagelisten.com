"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { ArrowUpRight, Check, Plus, X } from "@phosphor-icons/react";

export type CompareItem = {
  slug: string;
  name: string;
  logo: string;
  score: number;
  badge: string;
  verdict: string;
  model: string;
  priceFrom: string;
  trial: string;
  offline: boolean;
  keepNote: string;
  bestFor: string;
  notFor: string;
  pros: string[];
  cons: string[];
  href: string;
  ctaLabel: string;
};

const MIN = 2;
const MAX = 4;
const DEFAULT = ["audiobooks-com", "audible", "libby"];

function Logo({ src, name, size }: { src: string; name: string; size: number }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[30%] bg-white ring-1 ring-line" style={{ width: size, height: size }}>
      <Image src={src} alt={`${name} logo`} width={size} height={size} unoptimized={src.endsWith(".svg")} className={src.endsWith(".svg") ? "p-[18%]" : "h-full w-full object-contain"} />
    </span>
  );
}

export function ServiceComparer({ items }: { items: CompareItem[] }) {
  const [selected, setSelected] = useState<string[]>(DEFAULT);

  // Read a shared selection from ?vs= once. The URL is only rewritten when the visitor changes the selection.
  useEffect(() => {
    const vs = new URLSearchParams(window.location.search).get("vs");
    if (!vs) return;
    const valid = vs.split(",").filter((s) => items.some((i) => i.slug === s)).slice(0, MAX);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one time read of the shared URL after hydration
    if (valid.length >= MIN) setSelected(valid);
  }, [items]);

  const toggle = (slug: string) => {
    const next = selected.includes(slug)
      ? selected.length > MIN
        ? selected.filter((s) => s !== slug)
        : selected
      : selected.length < MAX
        ? [...selected, slug]
        : selected;
    if (next === selected) return;
    setSelected(next);
    const url = new URL(window.location.href);
    url.searchParams.set("vs", next.join(","));
    window.history.replaceState(null, "", url);
  };

  const chosen = selected.map((s) => items.find((i) => i.slug === s)!).filter(Boolean);
  const topScore = Math.max(...chosen.map((c) => c.score));
  const full = selected.length >= MAX;

  const rows: { label: string; render: (s: CompareItem) => React.ReactNode }[] = [
    {
      label: "HumPage Listen score",
      render: (s) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-3xl tracking-tight">{s.score.toFixed(1)}</span>
          <span className="text-sm text-ink-soft">/10</span>
          {s.score === topScore && <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs text-primary-ink">Top score</span>}
        </div>
      ),
    },
    { label: "Best known for", render: (s) => s.badge },
    { label: "How it works", render: (s) => s.model },
    { label: "Price from", render: (s) => <span className="font-display text-lg">{s.priceFrom}</span> },
    { label: "Free trial", render: (s) => s.trial },
    {
      label: "Offline listening",
      render: (s) =>
        s.offline ? (
          <span className="flex items-center gap-1.5">
            <Check size={18} className="text-[#0fa947]" /> Yes
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-ink-soft">
            <X size={16} weight="light" /> No
          </span>
        ),
    },
    { label: "After you cancel", render: (s) => s.keepNote },
    { label: "Best for", render: (s) => s.bestFor },
    { label: "Skip it if", render: (s) => s.notFor },
    {
      label: "What I like",
      render: (s) => (
        <ul className="space-y-1.5">
          {s.pros.map((p) => (
            <li key={p} className="flex gap-2">
              <Check size={16} className="mt-1 shrink-0 text-[#0fa947]" />
              {p}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Watch out for",
      render: (s) => (
        <ul className="space-y-1.5">
          {s.cons.map((c) => (
            <li key={c} className="flex gap-2">
              <X size={14} weight="light" className="mt-1.5 shrink-0 text-ink-soft" />
              {c}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div>
      <div className="glass rounded-[var(--radius-card)] p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-lg">Pick the services to compare</p>
          <p className="text-sm text-ink-soft" aria-live="polite">
            {selected.length} of {MAX} selected{full ? ". Remove one to add another" : ""}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {items.map((s) => {
            const on = selected.includes(s.slug);
            const blocked = !on && full;
            return (
              <button
                key={s.slug}
                type="button"
                aria-pressed={on}
                disabled={blocked}
                onClick={() => toggle(s.slug)}
                className={clsx(
                  "flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-[0.95rem] transition-all",
                  on ? "glass-pill text-ink ring-2 ring-primary" : "border border-line bg-white/50 text-ink-soft hover:bg-white",
                  blocked && "cursor-not-allowed opacity-40",
                )}
              >
                <Logo src={s.logo} name={s.name} size={28} />
                <span className="font-display">{s.name}</span>
                {on ? <Check size={15} className="text-[#0fa947]" /> : <Plus size={14} weight="light" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="no-scrollbar mt-6 overflow-x-auto">
        <div
          className="grid min-w-full gap-x-3"
          style={{ gridTemplateColumns: `minmax(120px, 170px) repeat(${chosen.length}, minmax(230px, 1fr))` }}
        >
          <div />
          {chosen.map((s) => (
            <div key={s.slug} className="glass-edge reveal rounded-t-[24px] bg-primary-soft/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Logo src={s.logo} name={s.name} size={44} />
                  <p className="font-display text-xl leading-tight tracking-tight">{s.name}</p>
                </div>
                {selected.length > MIN && (
                  <button type="button" onClick={() => toggle(s.slug)} aria-label={`Remove ${s.name}`} className="text-ink-soft hover:text-ink">
                    <X size={18} weight="light" />
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.verdict}</p>
            </div>
          ))}

          {rows.map((r) => (
            <div key={r.label} className="contents">
              <div className="border-t border-line py-4 pr-3 text-sm text-ink-soft">{r.label}</div>
              {chosen.map((s) => (
                <div key={s.slug} className="border-t border-line px-5 py-4 text-[0.95rem] leading-relaxed">
                  {r.render(s)}
                </div>
              ))}
            </div>
          ))}

          <div className="border-t border-line" />
          {chosen.map((s) => (
            <div key={s.slug} className="flex flex-col items-start gap-3 border-t border-line px-5 pt-5">
              <a href={s.href} target="_blank" rel="sponsored nofollow noopener" className="btn btn-primary btn-sm">
                {s.ctaLabel}
                <ArrowUpRight size={15} aria-hidden />
              </a>
              <Link href={`/reviews/${s.slug}`} className="text-sm underline underline-offset-4">
                Full {s.name} review
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
