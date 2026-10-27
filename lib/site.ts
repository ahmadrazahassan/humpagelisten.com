// Fill the owner fields before applying to affiliate programs. See CONTENT_TODO.md.
export const site = {
  name: "HumPage Listen",
  tagline: "Honest audiobook app reviews",
  description:
    "HumPage Listen compares audiobook apps and reviews audiobooks with a close ear on narration, real yearly cost, and what you keep when you cancel.",
  // Vercel serves the site on www, so links in the sitemap and metadata use www too.
  url: process.env.SITE_URL ?? "https://www.humpagelisten.com",
  email: "hello@humpagelisten.com",
  author: {
    name: "Ilyas Jan",
    role: "Founder and lead reviewer",
    bio: "I listen to audiobooks on walks, on long drives and at bedtime, and I started HumPage Listen to compare the apps with the same tests every time.",
  },
  pricesCheckedOn: "2026-10-24",
};

export function formatMonthYear(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
