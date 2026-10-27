import Image from "next/image";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="py-28">
      <Container>
        <div className="mx-auto max-w-[560px] text-center">
          <Image src="/images/misc/404.png" alt="A small blue character with one tear rolling down its cheek" width={220} height={220} className="mx-auto" priority />
          <h1 className="mt-8 text-[2.4rem] leading-tight font-normal tracking-[-0.04em] sm:text-[3.2rem]">This page wandered off mid chapter</h1>
          <p className="mt-4 text-lg text-ink-soft">The link may be old, or the page has moved. Let us get you back to something good.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/">Back home</ButtonLink>
            <ButtonLink href="/reviews" variant="secondary">
              Browse reviews
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
