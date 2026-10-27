import Link from "next/link";
import { Logo } from "@/components/logo";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";

export function Footer() {
  const services = getServices();
  const cols = [
    { title: "Reviews", links: services.slice(0, 6).map((s) => ({ href: `/reviews/${s.slug}`, label: s.name })) },
    {
      title: "Read",
      links: [
        { href: "/books", label: "Book reviews" },
        { href: "/guides", label: "Guides" },
        { href: "/compare", label: "Compare apps" },
        { href: "/compare/audiobooks-com-vs-audible", label: "Audiobooks.com vs Audible" },
      ],
    },
    {
      title: "HumPage Listen",
      links: [
        { href: "/about", label: "About" },
        { href: "/how-we-review", label: "How we review" },
        { href: "/editorial-guidelines", label: "Editorial guidelines" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
        { href: "/privacy-policy", label: "Privacy policy" },
        { href: "/cookie-policy", label: "Cookie policy" },
        { href: "/terms", label: "Terms of use" },
      ],
    },
  ];

  return (
    <footer className="mt-6 rounded-t-[var(--radius-card)] bg-night text-white/80">
      <div className="mx-auto max-w-[1200px] px-5 pt-16 pb-10 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-sm leading-relaxed text-white/60">{site.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="font-display text-sm text-white">{c.title}</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-white/60 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm leading-relaxed text-white/50">
          <p className="max-w-3xl">
            HumPage Listen is reader supported. When you sign up for a service through some links on this site, we may earn a commission at no
            extra cost to you. As an Amazon Associate I earn from qualifying purchases. HumPage Listen participates in the Amazon Services LLC Associates Program. HumPage Listen is independent and is not owned by any of the services we review. Logos and book covers belong to
            their owners and are used to identify the products we review.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </p>
            <p>© {site.pricesCheckedOn.slice(0, 4)} HumPage Listen</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
