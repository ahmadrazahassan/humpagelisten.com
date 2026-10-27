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
import { JsonLd } from "@/components/ui";
import { getHomeFaqs } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />
      <TestedStrip />
      <TopServices />
      <QuickCompare />
      <HowWeReview />
      <BookCarousel />
      <ListeningNotes />
      <GuidesGrid />
      <TrialCards />
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
