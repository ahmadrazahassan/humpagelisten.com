export type Section = { heading: string; paragraphs: string[]; list?: string[] };
export type Faq = { q: string; a: string };
export type Fact = { label: string; value: string; sourceUrl: string };
export type Tint = "mint" | "cloud" | "blush" | "butter";

export type Service = {
  slug: string;
  name: string;
  logo: string;
  partnerSlug: string;
  score: number;
  badge: string;
  verdict: string;
  pullQuote: string;
  bestFor: string;
  notFor: string;
  model: string;
  priceFrom: string;
  trial: string;
  offline: boolean;
  keepAfterCancel: "yes" | "partly" | "no";
  keepNote: string;
  facts: Fact[];
  pros: string[];
  cons: string[];
  sections: Section[];
  faqs: Faq[];
  alternatives: string[];
  ctaLabel: string;
  tint: Tint;
  updatedAt: string;
  long: boolean;
};

export type Book = {
  slug: string;
  title: string;
  authors: string[];
  narrators: string[];
  runtime: string;
  year: number;
  genres: string[];
  storyRating: number;
  narrationRating: number;
  quote: string;
  summary: string[];
  narration: string[];
  loveIt: string;
  skipIt: string;
  cover: string;
  coverSource: string;
  related: string[];
  tint: Tint;
  updatedAt: string;
};

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
  image: string;
  publishedAt: string;
  sections: Section[];
  sources: { title: string; url: string }[];
};
