// Single data access layer. All content lives in lib/data as code, so there is no database to run.
import { books } from "@/lib/data/books";
import { guides, homeFaqs } from "@/lib/data/guides";
import { featuredOrder, services } from "@/lib/data/services";

export function getServices() {
  return [...services].sort((a, b) => b.score - a.score);
}
export function getFeaturedServices() {
  return featuredOrder.map((s) => services.find((x) => x.slug === s)!).filter(Boolean);
}
export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
export function getBooks() {
  return books;
}
export function getBook(slug: string) {
  return books.find((b) => b.slug === slug);
}
export function getGuides() {
  return [...guides].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
export function getHomeFaqs() {
  return homeFaqs;
}

export const comparisons = [
  { a: "audiobooks-com", b: "audible" },
  { a: "audible", b: "spotify" },
  { a: "libro-fm", b: "audible" },
  { a: "audiobooks-com", b: "libro-fm" },
];

export function getComparison(slug: string) {
  const c = comparisons.find((x) => `${x.a}-vs-${x.b}` === slug);
  if (!c) return undefined;
  const a = getService(c.a);
  const b = getService(c.b);
  if (!a || !b) return undefined;
  return { slug, a, b };
}
