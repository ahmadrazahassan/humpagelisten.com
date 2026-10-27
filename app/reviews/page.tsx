import type { Metadata } from "next";
import { PageIntro, ServiceCard } from "@/components/blocks";
import { Container, Disclosure } from "@/components/ui";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Audiobook app reviews",
  description: "Reviews of Audiobooks.com, Audible, Spotify, Libro.fm, Storytel, Everand, Kobo Plus, Chirp and Libby, scored with the same rubric.",
};

export default function ReviewsPage() {
  const services = getServices();
  return (
    <>
      <PageIntro
        label="Reviews"
        title="Every audiobook app, scored the same way"
        intro="Nine services, one rubric. Each review lists its sources and the date every price was checked."
      >
        <Disclosure className="mt-6" />
      </PageIntro>
      <section className="pb-24">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} s={s} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
