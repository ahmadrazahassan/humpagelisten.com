import type { Metadata } from "next";
import { Clock, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { sendContact } from "@/app/actions";
import { ContactForm } from "@/components/client";
import { Container, Label, Photo } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions, corrections, partnership enquiries and privacy requests for HumPage Listen.",
};

export default function Contact() {
  return (
    <section className="pt-10 pb-24 sm:pt-16">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Label>Contact</Label>
            <h1 className="mt-5 text-[2.6rem] leading-[1.03] font-normal tracking-[-0.045em] sm:text-[3.6rem]">Say hello</h1>
            <p className="mt-5 max-w-[440px] text-lg leading-relaxed text-ink-soft">
              Spotted a price that changed, a mistake, or a book I should review? I read every message.
            </p>
            <ul className="mt-10 space-y-5">
              <li className="flex items-start gap-4">
                <EnvelopeSimple size={24} weight="light" className="mt-0.5" />
                <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Clock size={24} weight="light" className="mt-0.5" />
                <span>I usually reply within three working days.</span>
              </li>
            </ul>
            <Photo src="/images/guides/compare.png" alt="A grassy path winding between two green hills" className="mt-12 hidden aspect-[4/3] rounded-[var(--radius-card)] lg:block" sizes="480px" tint="butter" />
          </div>
          <div className="glass rounded-[var(--radius-card)] p-7 sm:p-10">
            <ContactForm action={sendContact} />
          </div>
        </div>
      </Container>
    </section>
  );
}

