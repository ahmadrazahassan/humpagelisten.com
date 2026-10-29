import { StaticPage, staticMeta } from "@/components/static-page";
import { Container } from "@/components/ui";

export const metadata = staticMeta("affiliate-disclosure");

export default function Page() {
  return (
    <>
      <Container className="pt-10 sm:pt-16">
        <div className="mx-auto max-w-[680px]">
          <div className="glass-edge rounded-[var(--radius-card)] bg-primary-soft p-8 text-center sm:p-12">
            <p className="font-display text-xs font-medium uppercase tracking-[0.16em] text-primary-ink">Affiliate program verification</p>
            <p className="mt-5 font-display text-[2.75rem] leading-none tracking-tight text-primary-ink sm:text-6xl">abc affiliate</p>
            <p className="mx-auto mt-5 max-w-[460px] leading-relaxed text-ink-soft">
              This text confirms that HumPage Listen owns and operates this website for the Audiobooks.com affiliate program.
            </p>
          </div>
        </div>
      </Container>
      <StaticPage slug="affiliate-disclosure" />
    </>
  );
}
