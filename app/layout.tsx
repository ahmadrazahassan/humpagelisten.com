import type { Metadata } from "next";
import { Google_Sans, Inter } from "next/font/google";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/ui";
import { site } from "@/lib/site";
import "./globals.css";

const googleSans = Google_Sans({ variable: "--font-google-sans", subsets: ["latin"], weight: ["400", "500", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "HumPage Listen: honest audiobook app and audiobook reviews", template: "%s · HumPage Listen" },
  description: site.description,
  openGraph: { siteName: "HumPage Listen", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${googleSans.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <div className="bg-primary-soft px-4 py-2 text-center text-[13px] text-primary-ink">
          Reader supported. As an Amazon Associate I earn from qualifying purchases.{" "}
          <Link href="/affiliate-disclosure" className="underline underline-offset-4">
            Learn how
          </Link>
        </div>
        <div className="px-2 pt-2 sm:px-4 sm:pt-4">
          <div className="mx-auto max-w-[1320px] overflow-hidden rounded-[var(--radius-card)] bg-surface">
            <Header />
            <main id="main">{children}</main>
          </div>
        </div>
        <div className="px-2 sm:px-4">
          <div className="mx-auto max-w-[1320px]">
            <Footer />
          </div>
        </div>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "HumPage Listen",
            url: site.url,
            publisher: { "@type": "Organization", name: "HumPage Listen", url: site.url },
          }}
        />
      </body>
    </html>
  );
}
