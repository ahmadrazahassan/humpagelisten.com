import type { Section } from "@/lib/types";
import { AMAZON_DISCLOSURE } from "@/config/partners";
import { site } from "@/lib/site";

type Page = { title: string; label: string; intro: string; updated: string; sections: Section[] };

const U = "2026-10-24";

export const pages: Record<string, Page> = {
  "affiliate-disclosure": {
    label: "Legal",
    title: "Affiliate disclosure",
    intro: "How HumPage Listen makes money, which programs we are part of, and how we keep that money away from our verdicts.",
    updated: U,
    sections: [
      {
        heading: "The short version",
        paragraphs: [
          "HumPage Listen is free to read and is supported by its readers. Some links on this site are affiliate links. If you click one and then start a free trial, buy an audiobook or subscribe, the company may pay HumPage Listen a commission. The price you pay is exactly the same as going to the site directly.",
          `${AMAZON_DISCLOSURE}`,
        ],
      },
      {
        heading: "Amazon Associates and Audible",
        paragraphs: [
          "HumPage Listen is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Links to Audible on this site are Amazon Associates links. When you start an Audible trial or make a qualifying purchase through them, HumPage Listen may earn a fee.",
          "Audible prices and offers change often and the price shown on Audible or Amazon at the time you sign up is the one that applies. Amazon, Audible and their logos are trademarks of Amazon.com, Inc. or its affiliates.",
        ],
      },
      {
        heading: "Other programs",
        paragraphs: [],
        list: [
          "Audiobooks.com: we are part of its affiliate program, so links to Audiobooks.com earn a commission on free trial sign ups, at no extra cost to you.",
          "We may join affiliate programs from other services we review. This page will list each one when that happens.",
          "Services we do not earn from, such as Libby, are still reviewed and recommended when they are the better choice.",
        ],
      },
      {
        heading: "How to spot a commercial link",
        paragraphs: [
          "Every page that contains affiliate links shows a short disclosure near the top, before the first link. Buttons that lead to a service are marked with a small arrow, open in a new tab, and are tagged as sponsored for search engines.",
        ],
      },
      {
        heading: "What affiliate money never changes",
        paragraphs: [],
        list: [
          "Scores come from the same weighted rubric for every service, described on the How we review page.",
          "We review and recommend services that pay us nothing, such as Libby, and we say so when a free option is the better choice.",
          "Every review lists real downsides, including for services we earn from.",
          "No company sees or approves a review before it is published.",
        ],
      },
      {
        heading: "Questions",
        paragraphs: [`Email ${site.email} and we will answer plainly.`],
      },
    ],
  },
  "privacy-policy": {
    label: "Legal",
    title: "Privacy policy",
    intro: "What we collect, why, how long we keep it, and how to ask us to delete it.",
    updated: U,
    sections: [
      {
        heading: "Who we are",
        paragraphs: [`HumPage Listen (${site.url}) is an independent review site. Contact: ${site.email}.`],
      },
      {
        heading: "What we collect",
        paragraphs: [],
        list: [
          "HumPage Listen has no user accounts and no database of its own.",
          "Newsletter: your email address and the date you confirmed. We email you a confirmation link first and only add you once you tap it. Confirmed subscribers are stored with our email provider, Resend.",
          "Contact form: your name, email, topic, message and IP address. The form sends this to our inbox as an email through Resend. We do not store it anywhere else.",
          "Server logs kept by our hosting provider for security, for a short period.",
        ],
      },
      {
        heading: "Why we use it (legal bases)",
        paragraphs: [
          "Newsletter emails are sent only with your consent, which you can withdraw at any time with the unsubscribe link in every email. Contact form data is used to reply to you, which is our legitimate interest.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: ["We do not use advertising cookies. See the [cookie policy](/cookie-policy) for details."],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "We use a small number of service providers to run the site: our hosting provider, and Resend, which sends our emails and keeps the newsletter list. They process data only on our instructions. When you click an affiliate link, you go to that company's site and its own privacy policy applies. We never sell your personal information.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [],
        list: [
          "Newsletter subscribers: until you unsubscribe with the link in any email. Your address is then marked as unsubscribed so you are never emailed again.",
          "Contact messages: kept in our inbox for up to 12 months after the conversation ends, then deleted.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          `Depending on where you live, including under the GDPR, UK GDPR and California law, you can ask to access, correct or delete your data, object to processing, or withdraw consent. Email ${site.email} or use the contact form and choose Privacy request. We reply within 30 days. You can also complain to your local data protection authority.`,
        ],
      },
      {
        heading: "Children",
        paragraphs: ["HumPage Listen is not directed at children under 13, and we do not knowingly collect their data."],
      },
      {
        heading: "Changes",
        paragraphs: ["If we change this policy, we update the date at the top of the page. Significant changes are also noted at the top of this page."],
      },
    ],
  },
  "cookie-policy": {
    label: "Legal",
    title: "Cookie policy",
    intro: "HumPage Listen keeps cookies to a minimum.",
    updated: U,
    sections: [
      {
        heading: "What we use",
        paragraphs: [
          "HumPage Listen does not set advertising or cross site tracking cookies. The site may set strictly necessary cookies, for example to keep a private admin area signed in. These do not need consent.",
          "If we ever add analytics that use cookies, we will ask for your consent first with a banner where Reject is as easy as Accept, and we will list each cookie here.",
        ],
      },
      {
        heading: "Cookies on other sites",
        paragraphs: [
          "When you follow a link to a service such as Audiobooks.com, that site may set its own cookies, including affiliate tracking cookies, under its own policy.",
        ],
      },
    ],
  },
  terms: {
    label: "Legal",
    title: "Terms of use",
    intro: "The rules for using HumPage Listen.",
    updated: U,
    sections: [
      {
        heading: "Information only",
        paragraphs: [
          "Reviews and guides on HumPage Listen are our honest opinion and general information. Prices, trials and catalogs change often. Always confirm the current terms on the official site before you subscribe.",
        ],
      },
      {
        heading: "Our content",
        paragraphs: [
          "Text on HumPage Listen is ours. You may quote short passages with a link back. Brand names, logos and book covers belong to their owners and are shown only to identify the products we review.",
        ],
      },
      {
        heading: "Links to other sites",
        paragraphs: ["We are not responsible for the content, offers or policies of sites we link to."],
      },
      {
        heading: "Liability",
        paragraphs: [
          "We work hard to be accurate, but the site is provided as is. To the extent the law allows, we are not liable for losses arising from your use of it.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [`Email ${site.email}.`],
      },
    ],
  },
  "editorial-guidelines": {
    label: "HumPage Listen",
    title: "Editorial guidelines",
    intro: "The rules every review and guide on HumPage Listen follows.",
    updated: U,
    sections: [
      {
        heading: "Accuracy",
        paragraphs: [],
        list: [
          "Every price, trial and plan detail comes from the service's own page, with a link and a checked date.",
          "Book details such as narrator and publisher are checked against the publisher or a library record.",
          "Descriptions are written in our own words. We never copy store listings or publisher blurbs.",
          "Book covers are shown exactly as published, never cropped, edited or overlaid.",
        ],
      },
      {
        heading: "Independence",
        paragraphs: [
          "Affiliate relationships never affect scores. No company reviews our work before publication. We include free options such as Libby even though they earn us nothing.",
        ],
      },
      {
        heading: "Content we do not publish",
        paragraphs: [
          "No pirated or unofficial downloads, no content that promotes hate, violence or discrimination, and no fake reviews or testimonials.",
        ],
      },
      {
        heading: "Corrections",
        paragraphs: [
          "If you spot a mistake, use the contact form and choose Correction. We fix confirmed errors quickly and note significant corrections at the end of the page.",
        ],
      },
    ],
  },
};
