// Outbound service links go through /go/[slug], except programs that forbid redirecting their links (direct: true).
// After an affiliate program approves you, paste the tracking link into affiliateUrl and set status to "approved".
export type Partner = {
  slug: string;
  name: string;
  destinationUrl: string;
  affiliateUrl?: string;
  status: "not_applied" | "pending" | "approved";
  network?: string;
  /** Link straight to affiliateUrl. Amazon Associates links must not be hidden behind our own redirect. */
  direct?: boolean;
};

export const partners: Partner[] = [
  { slug: "audiobooks-com", name: "Audiobooks.com", destinationUrl: "https://www.audiobooks.com/", status: "pending", network: "Post Affiliate Pro" },
  {
    slug: "audible",
    name: "Audible",
    destinationUrl: "https://www.audible.com/",
    affiliateUrl: "https://link.amazon/A01l31h7M",
    status: "approved",
    network: "Amazon Associates",
    direct: true,
  },
  { slug: "spotify", name: "Spotify", destinationUrl: "https://www.spotify.com/us/audiobooks/", status: "not_applied" },
  { slug: "storytel", name: "Storytel", destinationUrl: "https://www.storytel.com/", status: "not_applied" },
  { slug: "libro-fm", name: "Libro.fm", destinationUrl: "https://libro.fm/", status: "not_applied" },
  { slug: "everand", name: "Everand", destinationUrl: "https://www.everand.com/", status: "not_applied" },
  { slug: "kobo-plus", name: "Kobo Plus", destinationUrl: "https://www.kobo.com/us/en/plus", status: "not_applied" },
  { slug: "chirp", name: "Chirp", destinationUrl: "https://www.chirpbooks.com/", status: "not_applied" },
  { slug: "libby", name: "Libby", destinationUrl: "https://libbyapp.com/", status: "not_applied" },
];

export function getPartner(slug: string) {
  return partners.find((p) => p.slug === slug);
}

export function partnerHref(slug: string) {
  const p = getPartner(slug);
  if (p?.direct && p.status === "approved" && p.affiliateUrl) return p.affiliateUrl;
  return `/go/${slug}`;
}

export function isEarning(slug: string) {
  return getPartner(slug)?.status === "approved";
}

export const AMAZON_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";
