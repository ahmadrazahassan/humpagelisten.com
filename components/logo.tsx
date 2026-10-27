import Link from "next/link";
import clsx from "clsx";

export function LogoMark({ className }: { className?: string }) {
  // An open page with a small sound wave rising from it.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="10" fill="#14E25B" />
      <path d="M8 20.5c2.6-1.4 5.4-1.4 8 0 2.6-1.4 5.4-1.4 8 0V12c-2.6-1.4-5.4-1.4-8 0-2.6-1.4-5.4-1.4-8 0z" fill="#fff" />
      <path d="M16 12v8.5" stroke="#0B3D1C" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.5 8.2c1-.9 2.2-1.4 3.5-1.4s2.5.5 3.5 1.4" stroke="#0B3D1C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={clsx("inline-flex items-center gap-2", className)} aria-label="HumPage Listen home">
      <LogoMark className="h-8 w-8" />
      <span className={clsx("font-display text-[1.35rem] tracking-[-0.04em] whitespace-nowrap", dark ? "text-white" : "text-ink")}>
        <span className="font-medium">humpage</span>
        <span className={clsx("font-normal", dark ? "text-white/55" : "text-ink-soft")}>listen</span>
      </span>
    </Link>
  );
}
