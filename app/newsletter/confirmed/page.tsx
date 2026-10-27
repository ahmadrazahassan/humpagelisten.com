import type { Metadata } from "next";
import { ButtonLink, Container, HeadphonesDoodle } from "@/components/ui";

export const metadata: Metadata = { title: "Subscription confirmed", robots: { index: false } };

export default function Confirmed() {
  return (
    <section className="py-28">
      <Container>
        <div className="glass mx-auto max-w-[560px] rounded-[var(--radius-card)] px-8 py-14 text-center">
          <HeadphonesDoodle className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-6 text-[2.2rem] leading-tight font-normal tracking-[-0.04em]">You are on the list</h1>
          <p className="mt-3 text-lg text-ink-soft">Thanks for confirming. The next HumPage Listen email arrives at the start of next month, and every email has a one click unsubscribe link.</p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/reviews">Read the latest reviews</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
