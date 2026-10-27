import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import clsx from "clsx";
import { ArrowUpRight, Star } from "@phosphor-icons/react/dist/ssr";
import { AMAZON_DISCLOSURE, partnerHref } from "@/config/partners";
import type { Tint } from "@/lib/types";

export const tintClass: Record<Tint, string> = {
  mint: "bg-primary-soft",
  cloud: "bg-cloud",
  blush: "bg-blush",
  butter: "bg-butter",
};

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={clsx("font-display text-xs font-medium uppercase tracking-[0.16em] text-ink-soft", className)}>
      {children}
    </p>
  );
}

export function SectionHead({
  label,
  title,
  intro,
  center = true,
}: {
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={clsx("max-w-[720px]", center && "mx-auto text-center")}>
      <div className={clsx("mb-5 flex items-center gap-3", center && "justify-center")}>
        <span className="h-px w-8 bg-muted" />
        <Label>{label}</Label>
        {center && <span className="h-px w-8 bg-muted" />}
      </div>
      <h2 className="text-[2rem] leading-[1.08] font-normal sm:text-[2.75rem]">{title}</h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</p>}
    </div>
  );
}

type BtnProps = {
  href: string;
  variant?: "primary" | "secondary" | "dark";
  size?: "md" | "sm";
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({ href, variant = "primary", size = "md", className, children }: BtnProps) {
  return (
    <Link href={href} className={clsx("btn", `btn-${variant}`, size === "sm" && "btn-sm", className)}>
      {children}
    </Link>
  );
}

/** Outbound partner link: always through /go, always marked sponsored. */
export function PartnerButton({
  partner,
  variant = "primary",
  size = "md",
  className,
  children,
}: Omit<BtnProps, "href"> & { partner: string }) {
  return (
    <a
      href={partnerHref(partner)}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={clsx("btn", `btn-${variant}`, size === "sm" && "btn-sm", className)}
    >
      {children}
      <ArrowUpRight size={16} weight="regular" aria-hidden />
    </a>
  );
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "group inline-flex items-center gap-2 font-display text-[0.95rem] text-ink underline decoration-muted underline-offset-[6px] transition-colors hover:decoration-primary",
        className,
      )}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export function Score({ value, size = "md" }: { value: number; size?: "md" | "lg" }) {
  return (
    <span className="inline-flex items-baseline gap-1 font-display">
      <span className={clsx(size === "lg" ? "text-6xl font-normal tracking-tight" : "text-2xl")}>{value.toFixed(1)}</span>
      <span className="text-sm text-ink-soft">/10</span>
    </span>
  );
}

export function Stars({ value, label, dark }: { value: number; label?: string; dark?: boolean }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${label ?? "Rating"} ${value} out of 5`}>
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} weight={i < full ? "fill" : "light"} className={i < full ? (dark ? "text-white" : "text-ink") : dark ? "text-white/30" : "text-muted"} />
        ))}
      </span>
      <span className={clsx("text-sm", dark ? "text-white/60" : "text-ink-soft")}>{value.toFixed(1)}</span>
    </span>
  );
}

export function BrandLogo({ src, name, size = 40, className }: { src: string; name: string; size?: number; className?: string }) {
  const isSvg = src.endsWith(".svg");
  return (
    <span
      className={clsx("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[30%] bg-white", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={clsx(isSvg ? "p-[18%]" : "h-full w-full object-contain")}
        unoptimized={isSvg}
      />
    </span>
  );
}

export function Cover({
  src,
  title,
  className,
  sizes,
  tile = "bg-[#f6f6f6]",
}: {
  src: string;
  title: string;
  className?: string;
  sizes?: string;
  tile?: string;
}) {
  // Covers are shown unmodified: contain, no crop, no overlays.
  return (
    <div className={clsx("relative flex aspect-[4/5] items-center justify-center rounded-[20px] p-5", tile, className)}>
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={`Cover of ${title} audiobook`}
          fill
          sizes={sizes ?? "(max-width: 768px) 60vw, 280px"}
          className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.14)]"
        />
      </div>
    </div>
  );
}

const publicDir = path.join(process.cwd(), "public");

/** Shows the image when the owner has added it to /public, otherwise a calm placeholder. */
export function Photo({
  src,
  alt,
  className,
  sizes,
  priority,
  tint = "cloud",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tint?: Tint;
}) {
  const exists = fs.existsSync(path.join(publicDir, src));
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      {exists ? (
        <Image src={src} alt={alt} fill sizes={sizes ?? "100vw"} priority={priority} className="object-cover" />
      ) : (
        <div className={clsx("absolute inset-0 flex flex-col items-center justify-center gap-3", tintClass[tint])} role="img" aria-label={alt}>
          <HeadphonesDoodle className="h-16 w-16 text-ink/25" />
          {process.env.NODE_ENV !== "production" && (
            <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] text-ink-soft">{src}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function HeadphonesDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className} aria-hidden>
      <path d="M12 38v-6a20 20 0 0 1 40 0v6" />
      <rect x="8" y="36" width="10" height="16" rx="5" />
      <rect x="46" y="36" width="10" height="16" rx="5" />
      <path d="M27 44c2 2 8 2 10 0" />
    </svg>
  );
}

export function Disclosure({ className }: { className?: string }) {
  return (
    <p className={clsx("text-sm leading-relaxed text-ink-soft", className)}>
      HumPage Listen is reader supported. We may earn a commission when you sign up or buy through links on this page, at no extra cost to you, and it never changes our scores. {AMAZON_DISCLOSURE}{" "}
      <Link href="/affiliate-disclosure" className="underline underline-offset-4">
        How we make money
      </Link>
    </p>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.href ? (
              <Link href={it.href} className="hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span className="text-ink">{it.label}</span>
            )}
            {i < items.length - 1 && <span className="text-muted">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
