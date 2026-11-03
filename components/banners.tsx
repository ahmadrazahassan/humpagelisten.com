/* eslint-disable @next/next/no-img-element -- partner creatives must load unedited from the network, with their impression pixel */
import clsx from "clsx";
import { getPartner } from "@/config/partners";

// Approved Audiobooks.com creatives (Post Affiliate Pro, Banners & Links). Shown as supplied: never crop, recolour or re-encode.
const PAP = "https://audiobookscom.postaffiliatepro.com";
const AID = "cvlsn1nvnilg6";

type Creative = { bid: string; w: number; h: number };

const creatives = {
  leaderboard: { bid: "7914dd9c", w: 728, h: 90 },
  mobileLeaderboard: { bid: "5aa59a72", w: 320, h: 50 },
  feature: { bid: "4eea55b5", w: 700, h: 390 },
  box: { bid: "ce38436d", w: 300, h: 250 },
  tall: { bid: "717ca34a", w: 320, h: 480 },
} satisfies Record<string, Creative>;

const clickUrl = (bid: string) => `${PAP}/scripts/kcd5fq4o7?a_aid=${AID}&a_bid=${bid}`;
const imageUrl = (bid: string) => `${PAP}/accounts/default1/kbd5fq4o7/${bid}.jpg`;
const pixelUrl = (bid: string) => `${PAP}/scripts/kid5fq4o7?a_aid=${AID}&a_bid=${bid}`;

function Pixel({ bid }: { bid: string }) {
  return <img src={pixelUrl(bid)} width={1} height={1} alt="" aria-hidden className="pointer-events-none absolute h-px w-px opacity-0" />;
}

function BannerLink({ c, className, children }: { c: Creative; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={clickUrl(c.bid)}
      target="_blank"
      rel="sponsored nofollow noopener"
      aria-label="Audiobooks.com offer, opens in a new tab"
      className={clsx("block overflow-hidden rounded-[14px] transition-opacity hover:opacity-90", className)}
    >
      {children}
    </a>
  );
}

function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <aside aria-label="Sponsored" className={clsx("glass relative rounded-[24px] p-3 sm:p-4", className)}>
      <p className="mb-2.5 px-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-soft">Sponsored · Audiobooks.com</p>
      {children}
    </aside>
  );
}

export type BannerFormat = "leaderboard" | "feature" | "box" | "tall";

/** Audiobooks.com partner banner. Renders nothing until the program is approved in config/partners.ts. */
export function AudiobooksBanner({ format, className }: { format: BannerFormat; className?: string }) {
  if (getPartner("audiobooks-com")?.status !== "approved") return null;

  if (format === "leaderboard") {
    const c = creatives.leaderboard;
    const m = creatives.mobileLeaderboard;
    return (
      <Frame className={clsx("mx-auto w-fit max-w-full", className)}>
        <BannerLink c={c}>
          <picture>
            <source media="(max-width: 767px)" srcSet={imageUrl(m.bid)} width={m.w} height={m.h} />
            <img
              src={imageUrl(c.bid)}
              width={c.w}
              height={c.h}
              alt="Audiobooks.com: get 3 audiobooks free"
              loading="lazy"
              className="h-auto w-full max-w-[728px]"
            />
          </picture>
        </BannerLink>
        <Pixel bid={c.bid} />
      </Frame>
    );
  }

  const c = creatives[format];
  return (
    <Frame className={clsx(format === "feature" ? "mx-auto max-w-[732px]" : "mx-auto w-fit max-w-full", className)}>
      <BannerLink c={c}>
        <img
          src={imageUrl(c.bid)}
          width={c.w}
          height={c.h}
          alt="Audiobooks.com: get 3 audiobooks free"
          loading="lazy"
          className="h-auto w-full"
          style={{ maxWidth: c.w }}
        />
      </BannerLink>
      <Pixel bid={c.bid} />
    </Frame>
  );
}

/** Full width band between page sections. */
export function BannerBand({ format = "leaderboard", className }: { format?: BannerFormat; className?: string }) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>
      <AudiobooksBanner format={format} />
    </div>
  );
}
