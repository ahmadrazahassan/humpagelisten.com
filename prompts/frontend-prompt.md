# FRONTEND BUILD PROMPT: Audiobook Review Website

> Paste this whole file into Claude Code at the root of an empty folder.
> Replace every `{{PLACEHOLDER}}` before you start, or Claude Code will ask you for them.
> The backend (Supabase) prompt comes in a second file. This phase builds the full frontend with a local content layer that can later be swapped to Supabase without touching components.

---

## 0. Your role

You are a senior full stack engineer and editorial product designer. You have shipped content and review sites that passed affiliate network reviews (Impact, CJ, Post Affiliate Pro, ShareASale). You write production code, not demos. You care about real content, accessibility, speed, and legal compliance as much as visuals.

Before writing any code:

1. Read this entire file.
2. Run `npm view next version` and use that latest stable Next.js release. Use the App Router, TypeScript (strict), and Tailwind CSS v4.
3. Print a short plan (folders, routes, components, content files) and then build it. Do not stop to ask questions unless a placeholder is missing.

---

## 1. Project facts (fill these in)

| Key | Value |
|---|---|
| Site name | `{{SITE_NAME}}` (suggestions if you have none: *Earmarked*, *Listen Shelf*, *Narrated*) |
| Domain | `{{DOMAIN}}` |
| Owner / main reviewer (real person) | `{{AUTHOR_NAME}}` |
| Author short bio (real) | `{{AUTHOR_BIO}}` |
| Contact email (on own domain) | `{{CONTACT_EMAIL}}` |
| Business physical address (not a PO Box) | `{{PHYSICAL_ADDRESS}}` |
| Country of operation | `{{COUNTRY}}` |

Never invent a person, a credential, a team member, a testimonial, a reader count, a rating count, or an award. If a value is unknown, render a clearly marked TODO in development and fail the production build (see section 11).

---

## 2. Why this site exists (read carefully, it drives every decision)

The business goal is approval into the **Audiobooks.com Affiliate Program** (run on Post Affiliate Pro), plus other audiobook programs later. Affiliate reviewers open the site and check, within about two minutes, whether it is a real, trustworthy publication or a thin template. Build for that reviewer.

### 2.1 What the Audiobooks.com agreement requires, and how the site satisfies it

| Agreement clause | What we build |
|---|---|
| Site content restrictions (no adult, violence, discrimination, illegal content, IP violations) | Editorial guidelines page; only family safe book selections; no pirated or "free download" language anywhere. |
| "Promoting content that is not available on Audiobooks.com" is disqualifying | Every book we review gets an `availableOnAudiobooksCom` boolean that the owner verifies by hand. Only `true` books get an Audiobooks.com CTA. Books exclusive to another store are not featured on the home page. |
| Content usage: promotional content must be sourced from Audiobooks.com unedited; do not modify cover images | Cover images are displayed **unmodified**: no cropping, no filters, no overlays, no rounded masking that cuts the art, no text on top. Use `object-fit: contain` on a neutral tile. After approval, covers and banners are swapped for official creatives from the affiliate dashboard. |
| Do not collect or use product listings, descriptions, or prices; no scraping, robots, or spiders | **No scraping of any store.** No copied publisher blurbs. All book descriptions are written originally. Prices are never pulled automatically; service prices are entered by hand with a "last checked" date and a "check current price" link. |
| Do not train AI on audio content; do not upload samples without written consent | No embedded audio samples. Use a "Listen to the sample on Audiobooks.com" outbound button instead. |
| Email: opt in only, opt out link, physical address, privacy policy compliant with FTC, CAN SPAM, CASL, GDPR | Newsletter form with explicit unticked consent checkbox, double opt in noted in UI copy, privacy link next to the field, physical address in the footer and in every email template. |
| Must have a proper privacy policy | Full Privacy Policy, Cookie Policy, Terms of Use, Affiliate Disclosure pages. |
| Fraud / aggressive marketing | No fake urgency timers, no "only 3 left", no misleading "free" claims. Free trial copy always says what happens after the trial ends. |

### 2.2 FTC and affiliate best practice

- A short, plain disclosure appears **above the first affiliate link** on every page that has one: "We may earn a commission if you sign up through our links. It never changes our verdicts. How we make money."
- Every affiliate link: `rel="sponsored nofollow noopener"`, `target="_blank"`, routed through an internal redirect path `/go/[partner]` (implemented as a Next.js route handler that 302 redirects to a URL from config). This keeps links swappable after approval.
- Until approval, `/go/audiobooks-com` points to the plain official homepage.

---

## 3. Content rules (non negotiable)

The site must read like a small, opinionated publication run by a real listener. Not like an AI generated SEO farm.

### 3.1 Accuracy

1. Every factual claim about a service (price, trial length, catalog size, credits, offline listening, platforms, countries, cancellation rules) must come from that service's official page. Store it in the content file with `sourceUrl` and `checkedOn` (ISO date). Render "Prices checked {month year}" on the page.
2. If you cannot verify a fact through web research right now, do **not** guess. Insert `TODO_VERIFY: <what to check>` and list every TODO in a generated `CONTENT_TODO.md` at the end of the build.
3. Hands on observations (app bugs, narration quality, how long support took to reply) can only come from the owner. Write the structure and leave `TODO_OWNER_NOTE` markers with a guiding question, for example: "TODO_OWNER_NOTE: How did the sleep timer behave on Android when the screen locked?"
4. Book facts (author, narrator, publisher of the audio edition, runtime, release year, ISBN) must be verified against the publisher or Open Library and stored with a source.

### 3.2 Voice

- First person singular from `{{AUTHOR_NAME}}`, or "we" only if the owner confirms a real team.
- Short sentences. Specific numbers. Admit downsides in every review. Every service review must include at least three genuine cons.
- Give a clear verdict and who the service is **not** for.
- Center aligned headings and intros on marketing sections; left aligned body text inside articles for readability.

### 3.3 Banned in all visible copy

- **No hyphens or dashes in visible text.** No em dash (—), no en dash (–), no spaced hyphen ( - ). Rewrite sentences instead ("free trial", "well known", "one of a kind" are fine without hyphens; "audiobook" is one word). URLs and slugs may contain hyphens.
- Banned words and phrases: delve, elevate, seamless, unlock, unleash, embark, journey (as metaphor), tapestry, realm, game changer, revolutionize, cutting edge, next level, in today's fast paced world, look no further, whether you're a, dive in, treasure trove, curated just for you, it's worth noting, ultimately.
- No emoji in body copy. No exclamation marks in headings.
- No fake social proof: no "Trusted by 50,000 readers", no star counts from imaginary users, no stock testimonials with stock faces.

Add a script `npm run lint:copy` that scans `/content` and `/app` for `—`, `–`, ` - ` in visible strings and for the banned word list, and fails CI if any are found.

---

## 4. Visual direction

### 4.1 Reference analysis (what to borrow from each)

**Reference 1 (Ageeva testimonial card):** a white rounded card (radius ~28px) overlapping a full bleed photo, large quote set in tight negative tracking (around `-0.03em`), a small pill "Read more" button, name and company under a hairline divider, and thin outline arrow controls bottom right with no circle behind them. Borrow for: the **Listening Notes** section and the hero feature card.

**Reference 2 (student stories carousel):** a dark section with a two line bold heading on the left and round prev/next buttons top right; horizontally scrolling cards that peek off the edge; cards mix text cards (small avatar, quote, name, meta) with one image card containing a soft round play button; one pastel tinted card. Borrow for: the **Book Reviews** carousel (covers instead of avatars).

**Reference 3 (BrainwaveBoard case studies):** the whole page sits in a large white rounded container on a soft background; centered pill navigation; a very large light weight headline aligned right; a carousel where the first card is large (image plus title plus description plus small pill counters) and the next cards are smaller tinted tiles with a round white arrow button; a slim progress bar under the carousel; a supporting paragraph with an underlined "Explore in details" text link with arrow. Borrow for: the **Top Services** carousel and overall container feel.

**Reference 4 (ElevenLabs agents page):** huge whitespace, tiny uppercase section labels with a hairline rule, centered section headlines, alternating two column blocks (text left, product visual right), a logo strip, one dark contrast block, two side by side CTA cards, an FAQ accordion next to a "Latest posts" list, and a dense multi column footer. Borrow for: page rhythm, the **How we review** block, **FAQ plus Latest articles**, and the footer.

Overall mood: **soft, cute, calm, editorial.** Rounded everything, generous padding, light weight large type, quiet hairlines, small playful touches (a tiny headphones doodle, a bookmark notch on cards). It must never feel like a SaaS AI landing page.

### 4.2 Design tokens

Define in `app/globals.css` with Tailwind v4 `@theme`:

```css
@theme {
  --color-primary: #14E25B;        /* brand green, buttons, active states, focus ring */
  --color-primary-ink: #0B3D1C;    /* text on green */
  --color-primary-soft: #E4FBEB;   /* flat tint for chips and soft cards */
  --color-muted: #BFBFBF;          /* hairlines, disabled, secondary icons */
  --color-bg: #F1F1F1;             /* page background */
  --color-surface: #FFFFFF;        /* cards and the main rounded container */
  --color-ink: #141414;            /* headings and body text */
  --color-ink-soft: #5C5C5C;       /* meta text */
  --color-night: #121212;          /* the single dark section */
  --radius-card: 28px;
  --radius-pill: 999px;
}
```

Soft card tints (flat colours only, used sparingly on carousel tiles to echo references 2 and 3): mint `#E4FBEB`, cloud `#E9E9E9`, blush `#F6E6EA`, butter `#F7F1DE`. All flat. **No gradients anywhere except buttons.** No glassmorphism, no blurred blobs, no glow, no noise overlays.

Text on `#14E25B` must use `--color-primary-ink`, never white (white fails contrast).

### 4.3 Typography

- Headings and UI: **Google Sans**. Body and long reading: **Inter**.
- Load via `next/font/google` (`Google_Sans`, `Inter`). If the installed Next.js version does not list Google Sans yet, load it with a `<link>` to `https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap` in the root layout and keep Inter on `next/font`.
- Scale (desktop): display 72/76 weight 400 tracking `-0.035em`; h1 56; h2 44; h3 28; body 18/30 Inter; meta 14. Mobile: display 44, h2 32.
- Headings are light or regular weight, not heavy bold. Bold is for card titles only.

### 4.4 Buttons (the only gradients on the site)

Glossy and shiny pills:

- **Primary:** `background: linear-gradient(180deg, #5CF28C 0%, #14E25B 48%, #0FC94F 100%)`, text `--color-primary-ink`, weight 500, padding `14px 26px`, radius pill, `box-shadow: inset 0 1px 0 rgba(255,255,255,.65), inset 0 -2px 0 rgba(0,0,0,.08), 0 6px 16px rgba(20,226,91,.28)`. A `::after` shine strip (white at 35% opacity, skewed) sweeps across on hover over 600ms. Press state translates 1px down. Respect `prefers-reduced-motion`.
- **Secondary:** white to `#F4F4F4` vertical gradient, 1px `#E2E2E2` border, same inset highlight, ink text.
- **Dark:** `#2A2A2A` to `#111` vertical gradient, white text, for the dark section.
- **Text link button:** underline with 1px offset 4px plus a thin arrow, like "Explore in details" in reference 3.

Every CTA label is concrete: "Start the Audiobooks.com free trial", "Visit Libro.fm", "Read the full review", "Compare all services". Never "Click here" or "Get started".

### 4.5 Icons

- Use **Phosphor Icons** (`@phosphor-icons/react`) in the **Light** weight, 20 to 24px, colour `--color-ink` or `--color-muted`.
- Icons sit **bare**: no circle, no square, no tinted background behind them. The only round elements are actual buttons (carousel arrows, play button), matching references 1 and 3.
- **Banned icons:** Sparkle, Sparkles, Star burst used decoratively, Lightning, Zap, MagicWand, Robot, Brain, Atom, Rocket, Fire. Star icons are allowed only inside rating displays.
- Preferred set: Headphones, BookOpen, BookmarkSimple, Microphone (narrator), Clock (runtime), DownloadSimple (offline), DevicesMobile, Tag (price), ArrowLeft/ArrowRight, ArrowUpRight (outbound), Check, X, MagnifyingGlass, EnvelopeSimple, MapPin.

### 4.6 Layout system

- Page background `#F1F1F1`. The main content sits in a white rounded container (`--radius-card`, max width 1320px, 16px margin on mobile, 24px on desktop) like reference 3. The dark section and footer break out of it.
- Content column for marketing intros is centered, max width 720px. Article body max width 680px.
- Section vertical rhythm: 120px desktop, 72px mobile.
- Small uppercase section labels with a hairline above (reference 4): `HOW WE REVIEW`, `TOP SERVICES`, `BOOK REVIEWS`.
- Fully responsive down to 360px. No horizontal page scroll. Carousels scroll with touch and snap (`scroll-snap-type: x mandatory`), with keyboard arrow support and visible focus.

### 4.7 Motion

Subtle only: cards lift 2px with a softer shadow on hover, carousel slides ease 400ms, section content fades up 12px once on enter (IntersectionObserver, no heavy libraries). Everything disabled under `prefers-reduced-motion`.

---

## 5. Information architecture

```
/                               Home
/reviews                        All service reviews (filterable grid)
/reviews/[slug]                 Service review (audiobooks-com, audible, spotify, storytel, libro-fm, everand, kobo-plus, chirp, libby)
/compare                        Full comparison table
/compare/[a]-vs-[b]             Head to head pages (start with audiobooks-com-vs-audible, audible-vs-spotify, libro-fm-vs-audible)
/books                          All book reviews (filter by genre, narrator, length)
/books/[slug]                   Book review
/guides                         Articles and guides index
/guides/[slug]                  Article
/how-we-review                  Methodology and scoring rubric
/about                          About the real owner
/contact                        Contact form, email, address
/affiliate-disclosure
/privacy-policy
/cookie-policy
/terms
/editorial-guidelines
/go/[partner]                   Affiliate redirect route handler (not a page)
not-found                       Custom 404
```

### Shared layout pieces

- **Announcement bar** (thin, ink text on `#E4FBEB`): "Reader supported. We may earn a commission from links on this site. Learn how."
- **Header:** logo left (wordmark in Google Sans plus a small headphones mark you draw as an SVG, not an icon library glyph); centered pill nav on a `#F1F1F1` pill with items Reviews, Books, Compare, Guides, About; right side a search button (bare MagnifyingGlass) and a primary button "Find my audiobook app" linking to `/compare`. Mobile: menu opens a full height sheet with large links.
- **Footer:** dark `--color-night` block with rounded top corners. Columns: Reviews, Books, Guides, Company (About, How we review, Editorial guidelines, Contact), Legal (Disclosure, Privacy, Cookies, Terms). Below: full affiliate disclosure paragraph, `{{PHYSICAL_ADDRESS}}`, `{{CONTACT_EMAIL}}`, copyright, and a line stating the site is independent and not owned by any service reviewed.

---

## 6. Home page, section by section

Build every section as its own component in `components/home/`. The home page must feel finished with zero lorem ipsum.

### 6.1 Hero (centered)

- Label: `HONEST AUDIOBOOK APP REVIEWS`
- Headline (display, centered, two lines): "Find the audiobook app that fits how you actually listen"
- Subtext (max 560px): "I test every service with a paid account, real commutes and real bedtime listening, then tell you which one is worth your money and which one is not."
- Buttons: primary "Compare the services" → `/compare`; secondary "See my top pick" → `/reviews/audiobooks-com`.
- A tiny line under the buttons: "Updated {month year}. Prices checked by hand."
- Below: a wide rounded hero image (`/images/hero/hero-listening.jpg`, 16:7) with a white card overlapping its left edge, styled exactly like reference 1: inside it a short pull quote from the owner's own Audiobooks.com review verdict, a pill "Read the review" button, a hairline, the reviewer's name and "Editor, {{SITE_NAME}}", and bare outline arrows that cycle between three verdict quotes (Audiobooks.com, Libro.fm, Spotify).

### 6.2 "Services I've tested" strip

A single centered row of plain text wordmarks in `#BFBFBF` Google Sans (not the companies' logos, to avoid trademark issues before approval): Audiobooks.com, Audible, Spotify, Storytel, Libro.fm, Everand, Kobo Plus, Chirp, Libby. Each links to its review.

### 6.3 Top services carousel (reference 3 layout)

- Left: label `TOP SERVICES`, right aligned huge light headline "My shortlist for {year}".
- Carousel: first card large (mint tint), showing the #1 pick: name, one line verdict, score out of 10, three pill facts (e.g. trial length, monthly price, offline listening), primary CTA "Start the free trial" via `/go/audiobooks-com`, secondary text link "Read the full review". Following cards are smaller tinted tiles (cloud, blush, butter) for the next picks, each with name, "Best for …" line, score, and a round white arrow button.
- Under it: round prev/next buttons (flat `#F1F1F1`, bare arrow icons) and a slim progress bar (ink fill on `#E2E2E2` track).
- To the right of the controls, a short paragraph about how the shortlist is chosen with a text link "How I score services".
- Ranking must be justified by the scoring rubric on `/how-we-review`. Do not rank Audiobooks.com first unless its rubric score supports it. Honest ranking is what gets approved.

### 6.4 Quick comparison (centered)

- Heading: "The short version"
- A clean table on desktop, stacked cards on mobile. Rows: service. Columns: Model (credits, unlimited, a la carte, library), Price from, Free trial, Offline listening, Keep books after cancelling, Best for, CTA. Use Check and X icons, bare.
- Footnote: "Prices checked {date}. Prices and trial offers change, so confirm on the official site."
- Button: "See the full comparison".

### 6.5 How I review (reference 4 two column block)

- Left column: label, heading "Every review follows the same five tests", short paragraph, text link to `/how-we-review`.
- Right column: a numbered list of five tests with bare icons and one sentence each: Catalog check (I search the same 40 titles on every app), Narration and audio quality, App experience on iOS and Android, Real cost over twelve months, Cancelling and what you keep.
- Below: a soft white card showing the scoring weights as horizontal bars (flat green fills, no gradients).

### 6.6 Book reviews carousel (reference 2 layout, the one dark section)

- Background `--color-night`, white text. Heading left: "Audiobooks I'd press play on again". Round prev/next buttons top right (white, ink arrows).
- Cards (white, radius 24px) that peek off the right edge: unmodified cover on a neutral tile, title, author, "Narrated by …", runtime with Clock icon, a two sentence quote from the owner's review, rating, and "Read review". One card uses the blush tint like reference 2's pink card. One card can be an image card using a generated lifestyle photo with a soft round play style button that links to the review (it does not play audio).

### 6.7 Listening notes (reference 1 layout)

Full width photo (`/images/sections/listening-notes.jpg`) with an overlapping white card containing a rotating short essay excerpt from the owner, e.g. on why narration matters more than the book, with "Read more" pill, name, and bare outline arrows. These are the owner's own words from real articles, never fake reader testimonials.

### 6.8 Guides grid

Heading centered "Guides for better listening". Three to six cards: image top (generated), category chip in mint, title, two line excerpt, reading time. Starter guides (write them fully, original, accurate, with sources):

1. "Audiobook credits explained: how they work on each app"
2. "How to try audiobooks for free without forgetting to cancel"
3. "Audiobooks.com vs Audible: which subscription costs less over a year"
4. "Free audiobooks through your library with Libby"
5. "How to pick a narrator you will not get tired of"
6. "Best audiobook apps for kids and family sharing"

### 6.9 Free trial CTA band (two cards side by side, reference 4 "Start in days" area)

- Left card (white): "New to audiobooks?" short honest explanation of how the Audiobooks.com trial works, what you get, what it costs after, how to cancel. Primary button "Start the Audiobooks.com free trial". Fine print with `checkedOn` date. Every number here comes from the verified content file.
- Right card (mint): "Prefer to support bookstores?" Libro.fm summary with secondary button "Visit Libro.fm".

### 6.10 FAQ plus latest (reference 4 bottom layout)

Two columns. Left: accordion "Questions people ask me" (8 real questions, e.g. "Do I keep my audiobooks if I cancel?", "Which app has the biggest catalog?", "Can I listen offline?", "Is Spotify's audiobook time enough for one book a month?"). Answers are accurate and sourced. Right: "Latest from the blog" list with date and title, and "View all" pill. Add `FAQPage` JSON LD.

### 6.11 Newsletter

Centered card: heading "One email a month. Only books worth your hours." Email field, an **unticked** consent checkbox: "Yes, send me the monthly newsletter. I can unsubscribe anytime.", link to Privacy Policy, primary button "Subscribe". Success copy mentions a confirmation email (double opt in). In this phase the form posts to a stubbed server action that logs and returns success; Supabase wiring comes in the backend prompt.

---

## 7. Service review page template (`/reviews/[slug]`)

Sections, in order:

1. Breadcrumbs.
2. Affiliate disclosure line.
3. Header: service name, one sentence verdict, score out of 10 (large, light), "Reviewed by {{AUTHOR_NAME}}", "Last updated", "Tested on" devices, primary CTA via `/go/[slug]` and secondary "Compare alternatives".
4. **At a glance** card: price, trial, model, catalog size, platforms, offline, family sharing, countries. Every value shows a tiny source link icon (bare ArrowUpRight) with `sourceUrl`.
5. **Verdict box**: Who it is for / Who should skip it.
6. Pros and cons (at least three real cons).
7. Long form sections: How it works, Pricing explained with a twelve month cost example, Catalog test results (table of the same 40 benchmark titles: available yes/no, filled by owner, `TODO_OWNER_NOTE` until then), App experience, Narration and audio quality, Cancelling and what you keep, Customer support.
8. Alternatives grid (three other services).
9. FAQ (5 to 8 questions) with `FAQPage` JSON LD.
10. Final CTA card.
11. Author box (real photo, bio, link to About).
12. Schema: `Review` with `itemReviewed` as `Product` or `Service`, `author` as a real `Person`, `reviewRating`. Never add `aggregateRating` (we have no real aggregate).

Write full draft content for **Audiobooks.com, Audible, Spotify, Storytel, and Libro.fm** in this phase (minimum 1,800 words each, original, sourced, TODO markers for hands on notes). Everand, Kobo Plus, Chirp, Libby can be shorter (900 words) and marked `status: "draft"` (excluded from sitemap until finished).

Note for Storytel: confirm which countries it operates in and state clearly if it is not available in the US. Note for Spotify: describe the audiobook listening hours model exactly as the official help page describes it on the check date.

---

## 8. Book review page template (`/books/[slug]`)

1. Disclosure line.
2. Header: unmodified cover (contain, neutral tile, no crop), title, author, narrator(s), audio publisher, runtime, release year, genre, our rating for **story** and for **narration** separately.
3. Where to listen box: Audiobooks.com button only if `availableOnAudiobooksCom` is true, plus other verified stores, plus "Borrow free with Libby" if applicable.
4. Spoiler free summary (original words, never the publisher blurb).
5. "The narration" section: pace, voices, accents, whether speeding to 1.2x works.
6. Who will love it / who will not.
7. If you liked this, try (three books).
8. Author box and `Book` plus `Review` JSON LD with `workExample` of `bookFormat: AudiobookFormat`, `readBy` narrator.

### 8.1 Starter book list (verify every field before publishing)

Pick 12 widely available audiobooks from major audio publishers. Candidate list, each must be checked for: correct narrator, current availability on Audiobooks.com, and ISBN of the audio edition. Drop any that turn out to be exclusive to one store.

- Atomic Habits, James Clear (narrated by the author)
- Educated, Tara Westover (narrated by Julia Whelan)
- Becoming, Michelle Obama (narrated by the author)
- Where the Crawdads Sing, Delia Owens (narrated by Cassandra Campbell)
- The Midnight Library, Matt Haig (narrated by Carey Mulligan)
- Lessons in Chemistry, Bonnie Garmus (narrated by Miranda Raison)
- Tomorrow, and Tomorrow, and Tomorrow, Gabrielle Zevin (narrated by Jennifer Kim and Feodor Chin)
- Sapiens, Yuval Noah Harari (narrated by Derek Perkins)
- Dune, Frank Herbert (full cast edition, confirm cast)
- The Hobbit, J.R.R. Tolkien (narrated by Andy Serkis)
- Fourth Wing, Rebecca Yarros (confirm narrators)
- The Body Keeps the Score, Bessel van der Kolk (confirm narrator)

### 8.2 Cover images

- Before approval: fetch covers from the Open Library Covers API by ISBN (`https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg`), download once to `/public/covers/{slug}.jpg` with a small script, store `coverSource` in content. Do not crawl any store.
- After approval: replace with official creatives from the Audiobooks.com affiliate dashboard.
- Render with `next/image`, `object-fit: contain`, alt text "Cover of {title} audiobook".

---

## 9. Other pages

- **Compare:** sticky first column table, filters (budget, keep books, offline, family), and a "Which one is for me?" four question picker that recommends a service with a reason. Pure client logic, no tracking.
- **How we review:** rubric with weights (Catalog 25, Value 25, App 20, Narration and audio 15, Cancelling and ownership 10, Support 5), the 40 title benchmark list, update policy, corrections policy, and how affiliate money does and does not affect us.
- **About:** real photo of `{{AUTHOR_NAME}}` (owner supplies `/images/about/author.jpg`), their real listening story, what they listen to, why the site exists, how it is funded. Plus a generated workspace photo.
- **Contact:** form (name, email, topic select: Correction, Partnership, Question; message; consent checkbox), `{{CONTACT_EMAIL}}`, `{{PHYSICAL_ADDRESS}}`, expected reply time. Server action stub for now. Honeypot field for spam.
- **Legal pages:** real, readable, specific to this site: Affiliate Disclosure (names Audiobooks.com and any other programs once joined), Privacy Policy (what we collect: newsletter email, contact form data, cookies, analytics; legal bases for GDPR; CCPA rights; data retention; contact), Cookie Policy, Terms. Add a note at the top of each: "Last updated {date}". Recommend the owner has them reviewed by a professional; do not claim they are legal advice.
- **404:** cute illustration area (generated image), "This page wandered off mid chapter", buttons back home and to reviews.

---

## 10. Images

### 10.1 Rules

- People photos are lifestyle illustrations only. Never pair a generated face with a name, a quote, or the word "reader". Real people (the owner) use real photos.
- No text inside generated images. No logos of real companies inside images. No phone screens showing a real app's UI.
- Place files at the paths below. Use `next/image` with proper `sizes`, width, height, and descriptive alt text. Export as JPG or WebP, max 300KB after compression.

### 10.2 ChatGPT image prompts

Use this style suffix on every prompt:

> *Style: soft natural daylight, editorial lifestyle photography, shot on 35mm film with gentle grain, muted warm neutrals with one small accent of fresh green (#14E25B), calm and cozy mood, shallow depth of field, realistic skin texture, slightly imperfect candid framing, no text, no logos, no brand names, no visible app screens.*

| Path | Ratio | Prompt |
|---|---|---|
| `/images/hero/hero-listening.jpg` | 16:7 | A woman in her late twenties sitting on a sunlit window seat with over ear headphones, eyes half closed, smiling softly, a mug of tea and a folded knit blanket beside her, a small green plant on the sill. |
| `/images/sections/listening-notes.jpg` | 16:9 | A man in his thirties walking through a quiet tree lined street in early morning, wearing small wireless earbuds, hands in coat pockets, relaxed expression, light mist. |
| `/images/sections/book-card-lifestyle.jpg` | 4:5 | A young person lying on a soft grey sofa listening with headphones, one arm behind head, a paperback resting on their chest, afternoon light. |
| `/images/sections/how-we-review.jpg` | 4:3 | A tidy wooden desk from above with a notebook of handwritten notes, a pair of headphones, a phone face down, a pencil, and a small green sticky note. |
| `/images/guides/credits.jpg` | 3:2 | A ceramic dish holding a few paper coins and a pair of earbuds on a linen tablecloth, overhead shot. |
| `/images/guides/free-trial.jpg` | 3:2 | A paper wall calendar with one date circled in green pencil, headphones hanging from the corner, soft shadows. |
| `/images/guides/library.jpg` | 3:2 | A cozy public library corner with tall shelves, a person browsing on a tablet with headphones around their neck. |
| `/images/guides/narrator.jpg` | 3:2 | A vintage microphone in a small warmly lit home recording booth lined with soft grey foam. |
| `/images/guides/kids.jpg` | 3:2 | A parent and a child sharing one pair of headphones on a picnic blanket in a park, laughing. |
| `/images/about/workspace.jpg` | 3:2 | A calm reading nook with a armchair, a stack of books, headphones on the armrest and a green throw pillow. |
| `/images/contact/contact.jpg` | 4:3 | Hands writing a handwritten letter on a desk next to an envelope and a cup of coffee. |
| `/images/misc/404.jpg` | 1:1 | A pair of headphones lying alone on an empty park bench in soft morning light, playful and slightly whimsical. |

Until the owner adds the images, render a flat `#E9E9E9` rounded placeholder with the filename in small text in development only.

---

## 11. Technical requirements

### 11.1 Stack

- Next.js latest stable, App Router, React Server Components by default, TypeScript strict.
- Tailwind CSS v4. No UI kit that brings its own look. Build components yourself.
- `@phosphor-icons/react`, `clsx`, `zod`.
- Content: MDX files in `/content/{services,books,guides,pages}` with frontmatter validated by zod schemas in `/lib/content/schema.ts`. Read through a single data access layer `/lib/content/index.ts` exposing `getServices()`, `getService(slug)`, `getBooks()`, `getBook(slug)`, `getGuides()`, etc. Components never import files directly. This layer is what the backend phase will reimplement with Supabase.
- Affiliate config in `/config/partners.ts`: `{ slug, name, url, status: "pending" | "approved", network }`.

### 11.2 Content schemas (minimum)

```ts
Service {
  slug, name, verdict, score, bestFor, notFor,
  model: "credits" | "unlimited" | "hours" | "a_la_carte" | "library",
  facts: { label, value, sourceUrl, checkedOn }[],
  pros: string[], cons: string[] (min 3),
  partnerSlug, status: "published" | "draft", updatedAt
}
Book {
  slug, title, authors[], narrators[], audioPublisher, runtimeMinutes,
  releaseYear, isbnAudio, genres[], storyRating, narrationRating,
  availableOnAudiobooksCom: boolean, availabilityCheckedOn,
  stores: { name, partnerSlug? , url }[], coverSource, status, updatedAt
}
Guide { slug, title, excerpt, category, readingMinutes, image, status, publishedAt, updatedAt, sources[] }
```

### 11.3 Build guards

- Production build fails if any published content contains `TODO_VERIFY`, `TODO_OWNER_NOTE`, or an unfilled `{{PLACEHOLDER}}`, if a service has fewer than three cons, or if `lint:copy` fails. Drafts are allowed to contain TODOs.
- Generate `CONTENT_TODO.md` listing every open TODO with file and line.

### 11.4 SEO

- `generateMetadata` per route, unique titles and descriptions written naturally.
- `sitemap.ts` and `robots.ts` (published content only). Canonical URLs. Open Graph images generated with `next/og` using the site fonts and flat colours.
- JSON LD: `Organization`, `WebSite`, `Person` (author), `Review`, `Book`, `FAQPage`, `BreadcrumbList`, `Article`.
- Clean internal linking: every service review links to two comparisons and three book reviews; every book links to the services where it is available.

### 11.5 Quality bar

- Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO on mobile.
- WCAG 2.2 AA: contrast, focus rings (2px `#14E25B` outline with 2px offset), skip link, semantic landmarks, carousel controls with `aria-label`, accordion with proper `aria-expanded`.
- No layout shift from fonts or images. No client JS where a server component works.
- Cookie banner only if non essential cookies or analytics are added; if added, "Reject" is as prominent as "Accept" and nothing loads before consent.

---

## 12. Deliverables for this phase

1. The running Next.js project with every route in section 5.
2. Complete home page as specified in section 6.
3. Full draft content: 5 long service reviews, 4 short draft reviews, 12 book reviews (status `draft` until the owner verifies availability), 6 guides, all legal and company pages.
4. `CONTENT_TODO.md` with every fact to verify and every owner note to add.
5. `README.md` with: setup, how to add a review, how to swap `/go/` links after approval, where to drop images, and an **Affiliate application checklist**:
   - [ ] About page has real name and photo
   - [ ] Contact page shows real email on own domain and physical address
   - [ ] Privacy Policy, Terms, Cookie Policy, Affiliate Disclosure live
   - [ ] At least 10 published, complete reviews and guides with no TODOs
   - [ ] Every featured book verified as available on Audiobooks.com
   - [ ] No scraped text, no modified covers, no audio samples
   - [ ] Disclosure visible above the first affiliate link on every page
   - [ ] Site on its own domain with HTTPS, indexed in Google Search Console

Build it now. Start with the design tokens, layout shell, and home page, then the templates, then content.
