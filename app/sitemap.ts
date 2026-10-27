import type { MetadataRoute } from "next";
import { comparisons, getBooks, getGuides, getServices } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/reviews",
    "/books",
    "/guides",
    "/compare",
    "/how-we-review",
    "/about",
    "/contact",
    "/affiliate-disclosure",
    "/privacy-policy",
    "/cookie-policy",
    "/terms",
    "/editorial-guidelines",
  ];
  return [
    ...staticPaths.map((p) => ({ url: `${site.url}${p}`, lastModified: site.pricesCheckedOn })),
    ...getServices().map((s) => ({ url: `${site.url}/reviews/${s.slug}`, lastModified: s.updatedAt })),
    ...getBooks().map((b) => ({ url: `${site.url}/books/${b.slug}`, lastModified: b.updatedAt })),
    ...getGuides().map((g) => ({ url: `${site.url}/guides/${g.slug}`, lastModified: g.publishedAt })),
    ...comparisons.map((c) => ({ url: `${site.url}/compare/${c.a}-vs-${c.b}`, lastModified: site.pricesCheckedOn })),
  ];
}
