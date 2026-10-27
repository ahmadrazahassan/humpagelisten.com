# HumPage Listen: owner checklist before applying to Audiobooks.com

Everything below needs a real person. Nothing here should be guessed or invented.

## 1. Identity (edit `lib/site.ts`)
- [x] Author: Ilyas Jan, founder and lead reviewer
- [ ] `author.bio`: rewrite in your own words so it is true for you
- [ ] Create the inbox hello@humpagelisten.com at your domain provider (it is shown across the site), or change `email` in `lib/site.ts`
- [x] Domain bought: humpagelisten.com (already the default site URL)
- Address and author photo were removed from the site at your request. Before sending any newsletter, email law (CAN SPAM) and the Audiobooks.com agreement still require a postal address inside each marketing email, so add one to the email template then.

## 2. Do the tests the site says you do
The home page and How we review page describe five tests and a 40 title catalog check. Before applying:
- [ ] Sign up for each service you review (trials are fine) and run the tests
- [ ] Add your own hands on notes to each review in `lib/data/services.ts` (app bugs, narration quality, how cancelling actually went)
- [ ] Adjust scores if your testing disagrees with the current numbers

## 3. Verify facts (checked 24 October 2026, recheck before launch)
- [ ] Audiobooks.com: confirm books bought with credits stay after cancelling, and look up prices of the 2 and 3 credit plans
- [ ] Spotify: confirm the current US Premium Individual price (third party sources said $12.99 in August 2026; the site does not state it)
- [ ] Kobo Plus: add US prices for Listen and Read and Listen, and the trial length (kobo.com blocked automated checks)
- [ ] Storytel: confirm current country list
- [ ] Chirp: confirm whether a paid membership now exists
- [ ] Each book: confirm narrator(s) and runtime of the current audio edition
- [ ] Each book: search the title on Audiobooks.com by hand and confirm it is available. Remove any that are not (the agreement forbids promoting content not on Audiobooks.com)

## 4. Images
Your uploaded images are placed and renamed in `public/images/` (hero, sections, about, guides, misc/404). Still missing:
- [ ] Optional: a dedicated image for the library guide (it reuses `sections/how-we-review.png`) and the contact page (it reuses `guides/compare.png`)

## 5. After approval
- [ ] In `config/partners.ts`, paste the Audiobooks.com tracking link into `affiliateUrl` and set `status: "approved"`
- [ ] Replace book covers with official creatives from the affiliate dashboard
- [ ] Create a free Resend account, verify your domain, and add the keys (see README, Backend: no database)

## 6. Amazon Associates (Audible link is live)
- [x] Audible buttons link straight to your Amazon Associates link (tag pageturnaudio-20), not through /go/, because Amazon does not allow hiding its links behind your own redirect
- [x] "As an Amazon Associate I earn from qualifying purchases." shows in the top bar, footer, every page disclosure and the Affiliate disclosure page
- [ ] Amazon closes new accounts without 3 qualifying sales in the first 180 days, so share the site once it is live
- [ ] Do not put Amazon links in the newsletter, PDFs or anywhere offline; Amazon does not allow it
- [ ] Amazon's rules limit showing Amazon prices that are not pulled live from their API. The Audible review states $8.99 and $14.95 with a checked date. If your Associates account is ever flagged for this, remove those numbers from the Audible review and say "see the current price on Audible" instead
