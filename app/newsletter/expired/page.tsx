import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = { title: "Link expired", robots: { index: false } };

export default function Expired() {
  return (
    <section className="py-28">
      <Container>
        <div className="glass mx-auto max-w-[560px] rounded-[var(--radius-card)] px-8 py-14 text-center">
          <h1 className="text-[2.2rem] leading-tight font-normal tracking-[-0.04em]">This link has expired</h1>
          <p className="mt-3 text-lg text-ink-soft">Confirmation links work for three days. Sign up again from the home page and a fresh link will be on its way.</p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/#newsletter">Sign up again</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
