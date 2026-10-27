import type { Metadata } from "next";
import { BookCard, PageIntro } from "@/components/blocks";
import { Container } from "@/components/ui";
import { getBooks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Audiobook reviews",
  description: "Spoiler free audiobook reviews with separate scores for the story and the narration.",
};

export default function BooksPage() {
  const books = getBooks();
  return (
    <>
      <PageIntro
        label="Book reviews"
        title="Audiobooks, reviewed for the ears"
        intro="Every review scores the story and the narration separately, because a great book can be ruined by the wrong voice, and the right voice can lift a good one."
      />
      <section className="pb-24">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((b) => (
              <BookCard key={b.slug} b={b} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
