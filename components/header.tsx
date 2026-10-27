"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "@/components/logo";

const nav = [
  { href: "/reviews", label: "Reviews" },
  { href: "/books", label: "Books" },
  { href: "/compare", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="relative z-40">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Logo />
        <nav aria-label="Main" className="glass hidden rounded-full p-1.5 md:block">
          <ul className="flex items-center">
            {nav.map((n) => {
              const active = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "block rounded-full px-4 py-2 font-display text-[0.92rem] transition-colors",
                      active ? "glass-pill text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/compare#picker" className="btn btn-primary btn-sm hidden whitespace-nowrap lg:inline-flex">
            Find my audiobook app
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} weight="light" /> : <List size={24} weight="light" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white px-6 pb-10 md:hidden">
          <div className="flex items-center justify-between py-5">
            <Logo />
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center">
              <X size={24} weight="light" />
            </button>
          </div>
          <ul className="flex flex-col">
            {nav.map((n) => (
              <li key={n.href} className="border-b border-line">
                <Link href={n.href} onClick={() => setOpen(false)} className="block py-5 font-display text-3xl tracking-tight">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/compare#picker" onClick={() => setOpen(false)} className="btn btn-primary mt-8 w-full">
            Find my audiobook app
          </Link>
        </div>
      )}
    </header>
  );
}
