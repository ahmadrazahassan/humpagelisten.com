# HumPage Listen

Honest audiobook app and audiobook reviews. Next.js 16 (App Router), Tailwind CSS 4, TypeScript.

## Run it

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npm run lint:copy` (fails on dashes and AI cliches in visible copy).

## Where things live

| What | Where |
|---|---|
| Site name, owner, email | `lib/site.ts` |
| Service reviews (prices, facts with sources, pros, cons, body) | `lib/data/services.ts` |
| Book reviews | `lib/data/books.ts` |
| Guides and home FAQs | `lib/data/guides.ts` |
| Legal and guideline pages | `lib/data/pages.ts` |
| Affiliate links | `config/partners.ts` (links go through `/go/[slug]`, except Amazon links which go direct) |
| Data access layer | `lib/content.ts` |
| Contact form and newsletter (no database) | `app/actions.ts`, `lib/mail.ts` |
| Logos | `public/logos/` (each service's own icon) |
| Book covers | `public/covers/` (Open Library, unedited) |
| Your images | `public/images/...` (paths listed in `CONTENT_TODO.md`) |

## Before you apply to affiliate programs

Work through `CONTENT_TODO.md`. The site is built to pass a reviewer's check, but it needs your own bio and hands on testing notes to be honest.

## Backend: no database

All content lives in `lib/data` as code. Editing a review means editing that file and deploying again.
Every email goes through [Resend](https://resend.com):

| Feature | How it works |
|---|---|
| Contact form | Each message is emailed to `CONTACT_TO_EMAIL`, with reply to set to the visitor |
| Newsletter signup | Resend emails a confirm link (signed, valid 3 days). Tapping it adds the person to your Resend contacts |
| Sending the newsletter | Write a Broadcast in the Resend dashboard to your contacts. Resend adds the unsubscribe link |

Setup: copy `.env.example` to `.env.local`, add `RESEND_API_KEY`, `EMAIL_FROM` and `CONTACT_TO_EMAIL`, and add the same keys in your hosting dashboard (for example Vercel).
Verify your domain in Resend before launch, otherwise newsletter confirm emails can only reach your own address.
Email law requires a postal address in the footer of every Broadcast (not on the website).
