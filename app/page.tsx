import {
  BookCarousel,
  FaqAndLatest,
  GuidesGrid,
  Hero,
  HowWeReview,
  ListeningNotes,
  Newsletter,
  QuickCompare,
  TestedStrip,
  TopServices,
  TrialCards,
} from "@/components/home";
import { BannerBand } from "@/components/banners";
import { JsonLd } from "@/components/ui";
import { getHomeFaqs } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />
      <TestedStrip />
      <TopServices />
      <QuickCompare />
      <BannerBand className="pt-16 sm:pt-20" />
      <HowWeReview />
      <BookCarousel />
      <ListeningNotes />
      <GuidesGrid />
      <TrialCards />
      <BannerBand format="feature" className="pb-24 sm:pb-32" />
      <FaqAndLatest />
      <Newsletter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: getHomeFaqs().map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
