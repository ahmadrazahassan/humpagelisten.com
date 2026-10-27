> **Not used.** The site now runs without a database: content is in `lib/data`, the contact form and newsletter both run on Resend. Keep this file only if you ever want an admin panel.

# BACKEND BUILD PROMPT: Supabase for the Audiobook Review Website

> Run this in the same project **after** `frontend-prompt.md` has been built.
> It replaces the local MDX content layer with Supabase, adds the newsletter, contact form, affiliate click tracking, a private admin area for the owner, and the privacy and compliance plumbing the Audiobooks.com affiliate agreement expects.
> Replace every `{{PLACEHOLDER}}` first.

---

## 0. Your role

You are a senior full stack engineer who has run Supabase in production for content and affiliate sites. You write SQL migrations by hand, you turn on Row Level Security for every table, and you never ship a secret key to the browser. You build only what this site needs. No microservices, no queues it does not need, no speculative features.

Before writing code:

1. Read this whole file and the existing project, especially `/lib/content/index.ts`, `/lib/content/schema.ts`, `/config/partners.ts`, and the stubbed server actions for the newsletter and contact form.
2. Run `npm view next version`, `npm view @supabase/supabase-js version`, `npm view @supabase/ssr version` and use the latest stable versions. Check the current Supabase docs for the key naming (publishable key and secret key) and auth helpers. Do not use the deprecated `@supabase/auth-helpers-nextjs`.
3. Print a short plan (migrations, tables, policies, functions, routes, env vars), then build it.

---

## 1. Project facts (fill these in)

| Key | Value |
|---|---|
| Site name | `{{SITE_NAME}}` |
| Domain | `{{DOMAIN}}` |
| Owner admin email | `{{ADMIN_EMAIL}}` |
| Sending email address (own domain) | `{{FROM_EMAIL}}` (for example `hello@{{DOMAIN}}`) |
| Business physical address (not a PO Box) | `{{PHYSICAL_ADDRESS}}` |
| Supabase project ref | `{{SUPABASE_PROJECT_REF}}` |
| Supabase region | choose the region closest to the main audience (US East for a US audience) |
| Transactional email provider | Resend (default) unless the owner says otherwise |

---

## 2. Goals and non goals

### Goals

1. **Content in Postgres.** Services, service facts, books, guides, pages, FAQs, comparisons, authors. Same shape as the current zod schemas so components do not change.
2. **Owner admin area** at `/admin` to write and update reviews, verify facts, mark books as available on Audiobooks.com, and publish. Only the owner can sign in.
3. **Newsletter** with double opt in, consent records, one click unsubscribe, and a suppression list.
4. **Contact form** with spam protection and email notification to the owner.
5. **Affiliate redirects** at `/go/[partner]` read from the database, with privacy friendly click counts.
6. **Compliance plumbing:** consent logs, data retention jobs, data export and deletion on request, publish guards that block unverified content.
7. **Freshness:** reminders when a price or fact has not been checked in 60 days.

### Non goals (do not build)

- Public user accounts, comments, or reader reviews. Fake or thin user generated content hurts affiliate approval. Leave a note in the README on how to add moderated reader reviews later.
- Scraping, price feeds, or any job that fetches data from Audiobooks.com, Audible, Spotify, Storytel, or any store. The affiliate agreement forbids data extraction tools. Prices are typed by the owner.
- Storing or serving audio samples.
- Training or running AI models on any book or audio content.
- Payment processing.

---

## 3. Stack and setup

- Supabase (Postgres, Auth, Storage, Edge Functions only if needed, `pg_cron`).
- Supabase CLI for local development: `supabase init`, `supabase start`, migrations in `/supabase/migrations`, seed in `/supabase/seed.sql`.
- Generate types with `supabase gen types typescript --local > lib/supabase/database.types.ts` and add an npm script `db:types`.
- `@supabase/ssr` clients:
  - `lib/supabase/server.ts`: server client using cookies, for server components, server actions, and route handlers.
  - `lib/supabase/browser.ts`: browser client, used only inside `/admin` client components.
  - `lib/supabase/admin.ts`: secret key client, imported only in server only modules (`import "server-only"`). Used for the newsletter, contact, and click logging inserts.
  - `lib/supabase/public.ts`: a cookieless anon client for public, cacheable content reads.
- `middleware.ts` (or `proxy.ts`, whichever the installed Next.js version uses) refreshes the auth session **only** for `/admin` routes and redirects signed out users to `/admin/login`.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=            # server only, never NEXT_PUBLIC
RESEND_API_KEY=
EMAIL_FROM="{{SITE_NAME}} <{{FROM_EMAIL}}>"
OWNER_NOTIFY_EMAIL={{ADMIN_EMAIL}}
SITE_URL=https://{{DOMAIN}}
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
IP_HASH_SALT=                   # random 32 byte string, rotated monthly is fine
REVALIDATE_SECRET=
```

Add `.env.example` with every key and a comment. Validate env vars at startup with zod in `lib/env.ts`; the build fails with a clear message if one is missing.

---

## 4. Database schema

Write it as ordered SQL migrations. Use `uuid` primary keys (`gen_random_uuid()`), `timestamptz` everywhere, `created_at` and `updated_at` with a shared `set_updated_at()` trigger, and `text` with `check` constraints instead of Postgres enums (easier to change later). Slugs are unique, lowercase, and validated with a check (`slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'`).

### 4.1 People and roles

```
profiles
  id uuid pk references auth.users on delete cascade
  role text check (role in ('owner','editor')) not null default 'editor'
  display_name text not null

authors                          -- public bylines, real people only
  id, slug, name, bio, photo_path, website_url, social_urls jsonb,
  profile_id uuid null references profiles
```

A helper `is_staff()` SQL function (security definer, `stable`, fixed `search_path`) returns true when `auth.uid()` has a profile row. `is_owner()` checks `role = 'owner'`.

Sign up is **disabled** in Supabase Auth settings. The owner account is created once via the dashboard or a script; the seed inserts its profile with role `owner`. Login is by email magic link or email plus password with MFA (TOTP) enabled. Document both in the README.

### 4.2 Content

```
services
  id, slug, name, verdict, score numeric(3,1) check (score between 0 and 10),
  best_for, not_for,
  model text check (model in ('credits','unlimited','hours','a_la_carte','library')),
  pros text[] not null, cons text[] not null,
  body_mdx text not null,
  partner_id uuid null references partners,
  author_id uuid not null references authors,
  status text check (status in ('draft','in_review','published','archived')) default 'draft',
  published_at, updated_at, created_at,
  seo_title, seo_description

service_facts                    -- every number shown on a review
  id, service_id references services on delete cascade,
  label, value, source_url text not null, checked_on date not null,
  sort_order int

books
  id, slug, title, authors text[], narrators text[], audio_publisher,
  runtime_minutes int, release_year int, isbn_audio text, genres text[],
  story_rating numeric(2,1), narration_rating numeric(2,1),
  summary_mdx text, narration_mdx text, body_mdx text,
  available_on_audiobooks_com boolean not null default false,
  availability_checked_on date,
  cover_path text, cover_source text not null,      -- where the unmodified cover came from
  author_id references authors, status, published_at, updated_at, seo_title, seo_description

book_stores
  id, book_id references books on delete cascade,
  store_name, url, partner_id null references partners, checked_on date

guides
  id, slug, title, excerpt, category, reading_minutes, image_path,
  body_mdx, sources jsonb not null default '[]',    -- [{title,url,accessed_on}]
  author_id, status, published_at, updated_at, seo_title, seo_description

comparisons                      -- /compare/[a]-vs-[b]
  id, slug, service_a_id, service_b_id, verdict, body_mdx, status, published_at, updated_at
  unique (service_a_id, service_b_id)

faqs
  id, scope text check (scope in ('home','service','book','guide','compare')),
  ref_id uuid null, question, answer_mdx, source_url, sort_order

pages                            -- about, how-we-review, legal pages
  id, slug, title, body_mdx, status, last_reviewed_on date, updated_at

related_links                    -- curated internal linking
  id, from_type, from_id, to_type, to_id, sort_order

corrections                      -- public corrections log, builds trust
  id, content_type, content_id, summary, corrected_on date

content_revisions                -- simple history for every publish
  id, content_type, content_id, snapshot jsonb, edited_by uuid, created_at
```

### 4.3 Affiliate

```
partners
  id, slug unique, name, network text,          -- e.g. 'post_affiliate_pro'
  destination_url text not null,                -- official homepage until approved
  affiliate_url text null,                      -- tracking link after approval
  status text check (status in ('not_applied','pending','approved','rejected','paused')),
  approved_on date, notes text

affiliate_clicks                                -- privacy friendly, no raw IP stored
  id bigint generated always as identity pk,
  partner_id references partners,
  source_path text,                             -- page the click came from
  placement text,                               -- 'hero','review_header','compare_table', etc
  ip_hash text,                                 -- sha256(ip + IP_HASH_SALT), truncated
  country text null,                            -- from the hosting platform header only
  device text check (device in ('mobile','tablet','desktop','unknown')),
  is_bot boolean default false,
  created_at timestamptz default now()
```

Rules for `/go/[partner]`:

- Route handler. Look up the partner, pick `affiliate_url` when `status = 'approved'` else `destination_url`, respond `302` with `Cache-Control: no-store`, `X-Robots-Tag: noindex, nofollow`.
- Log the click **after** the response is scheduled (use `after()` from `next/server`) so the redirect is never slowed.
- Do not log obvious bots (user agent check) as real clicks; set `is_bot = true`.
- Do not append personal data to the destination URL. Only append a `subid` made of placement and page slug if the network supports it, and only after approval.
- Disallow `/go/` in `robots.ts`.

### 4.4 Newsletter and contact

```
subscribers
  id, email citext unique not null,
  status text check (status in ('pending','confirmed','unsubscribed','bounced','complained')),
  confirm_token_hash text, confirm_token_expires_at timestamptz,
  unsubscribe_token text unique not null,       -- random, long, used for one click unsubscribe
  confirmed_at, unsubscribed_at, created_at, updated_at,
  source_path text

consent_events                                  -- proof of opt in, the agreement can ask for it within 24h
  id, subscriber_id references subscribers on delete cascade,
  event text check (event in ('signup','confirm','unsubscribe','resubscribe')),
  consent_text text not null,                   -- exact checkbox wording shown
  privacy_policy_version text not null,
  ip_hash text, user_agent text, page_url text, created_at

suppression_list
  email citext pk, reason text, created_at

contact_messages
  id, name, email citext, topic text check (topic in ('correction','partnership','question','privacy_request')),
  message text check (char_length(message) between 10 and 5000),
  consent boolean not null, status text check (status in ('new','replied','closed','spam')) default 'new',
  ip_hash, created_at

privacy_requests
  id, email citext, request_type text check (request_type in ('access','delete','correct')),
  status text check (status in ('received','verified','completed','rejected')),
  verified_at, completed_at, created_at

rate_limits
  key text pk, window_start timestamptz, count int
```

Note: the Audiobooks.com agreement says an affiliate must be able, within 24 hours of a request, to provide the name, date, time, IP address and URL where a person gave email permission. Storing only an IP hash cannot satisfy the IP part. Make the choice explicit: store the raw IP in `consent_events.ip_address inet` (restricted column, only readable with the secret key, deleted when the subscriber is deleted) and explain this in the Privacy Policy as a legal obligation of email marketing. Ask the owner to confirm this before the first migration runs and default to storing it.

### 4.5 Indexes

Unique on every `slug`. Index `status, published_at desc` on content tables, `partner_id, created_at` on `affiliate_clicks`, `email` on subscribers, `checked_on` on `service_facts`. Full text search: a generated `tsvector` column on services, books, guides (title, summary, body) with a GIN index, used by the site search.

---

## 5. Row Level Security

Enable RLS on **every** table, with no exceptions. Write a test for each policy.

| Table | anon / authenticated public | staff (`is_staff()`) |
|---|---|---|
| services, books, guides, comparisons, pages | `select` where `status = 'published'` | full CRUD |
| service_facts, book_stores, faqs, related_links | `select` when the parent is published | full CRUD |
| authors, corrections | `select` all | full CRUD |
| partners | `select` of `slug, name, status` only through a `public_partners` view; never expose `affiliate_url` or notes | full CRUD (owner only for delete) |
| affiliate_clicks | none | `select` only; inserts happen via the secret key server client |
| subscribers, consent_events, suppression_list, contact_messages, privacy_requests, rate_limits | none | `select` and `update` for the owner only; inserts only through server actions using the secret key |
| content_revisions | none | `select`, insert via trigger |
| profiles | user can read own row | owner can manage |

Every `security definer` function sets `search_path = ''` and uses fully qualified names. Run the Supabase database linter (`supabase db lint`) and fix every warning before finishing.

---

## 6. Publish guards (the content honesty rules, enforced in the database)

A `before insert or update` trigger on each content table blocks `status = 'published'` when:

- Any text field contains `TODO_VERIFY`, `TODO_OWNER_NOTE`, or `{{`.
- A service has fewer than 3 `cons`, or any of its `service_facts` lacks `source_url` or `checked_on`, or a fact was checked more than 90 days ago.
- A book has no `cover_source`, no `isbn_audio`, or no narrator, or `availability_checked_on` is empty.
- Any visible text contains an em dash (U+2014), an en dash (U+2013), or a spaced hyphen (` - `). Use a single `contains_banned_copy(text)` SQL function that also checks the banned word list from the frontend prompt (stored in a small `banned_phrases` table so the owner can edit it).

The trigger raises a readable error, for example `Cannot publish "Audible review": 2 facts have no source URL (Price, Free trial).` The admin UI shows this message as is.

Keep the existing `npm run lint:copy` for MDX files in the repo; the database rule covers content edited in the admin.

---

## 7. Data access layer swap

Rewrite `/lib/content/index.ts` so every exported function keeps **the same name and return type** but reads from Supabase:

- Public reads use the cookieless public client so pages stay statically cacheable.
- Use the caching model of the installed Next.js version (Cache Components with `"use cache"`, `cacheTag` and `cacheLife` if available, otherwise `unstable_cache` with tags). Tag by entity: `service:{slug}`, `services`, `book:{slug}`, `books`, `guides`, `partners`.
- Parse every row through the existing zod schemas so a bad row fails loudly in development and is skipped with a logged error in production.
- MDX bodies are compiled on the server with the same MDX components the frontend already uses.
- `generateStaticParams` reads published slugs from Supabase.

### Revalidation

- After any admin save, the server action calls `revalidateTag` for the affected tags.
- A route `POST /api/revalidate` protected by `REVALIDATE_SECRET` for manual or webhook use.

### Migration from MDX

A one time script `scripts/import-mdx.ts` reads `/content/**`, validates with zod, and upserts into Supabase (by slug) using the secret key. It is idempotent. It uploads local covers and images to Storage and rewrites paths. After a successful import, the MDX files stay in the repo as a backup but the site reads only from the database. Add `npm run db:import`.

---

## 8. Storage

Buckets:

- `covers` (public read): unmodified book covers. Upload validation: JPG, PNG or WebP, max 2MB. The upload code must **not** resize with cropping, recolour, or overlay anything. Only lossless format conversion or proportional downscale is allowed. Store the source in `books.cover_source`.
- `images` (public read): generated lifestyle images and author photos. Max 1MB after compression.
- `private` (no public access): any exports for privacy requests.

Storage policies: public `select` on `covers` and `images`, write only for staff.

Configure `next.config` `images.remotePatterns` for the Supabase Storage host.

---

## 9. Server actions and routes

All in `app/actions/*` or route handlers. Each validates input with zod, checks the honeypot field, verifies Cloudflare Turnstile on the server, applies a rate limit, and returns a typed result `{ ok: true } | { ok: false, error: string }`. Error messages shown to visitors are friendly and never leak internals.

### 9.1 `subscribe(formData)`

1. Validate email and that the consent checkbox is ticked. Reject if the email is in `suppression_list` (respond with the same generic success message to avoid leaking who is suppressed).
2. Rate limit: 5 attempts per IP hash per hour.
3. Upsert subscriber as `pending`, create a random confirm token (store only its SHA 256 hash), expires in 48 hours.
4. Insert a `consent_events` row with the exact checkbox text and current privacy policy version.
5. Send the confirmation email via Resend.
6. Always return the same message: "Check your inbox to confirm your subscription."

### 9.2 `GET /newsletter/confirm?token=`

Hash the token, find the pending subscriber, mark `confirmed`, log a `confirm` consent event, redirect to a friendly confirmation page. Expired or used tokens show a page that lets them request a new email.

### 9.3 Unsubscribe

- `GET /newsletter/unsubscribe?token=` shows a one button confirmation page.
- `POST /newsletter/unsubscribe` (also used for RFC 8058 `List-Unsubscribe-Post: List-Unsubscribe=One-Click`) marks `unsubscribed`, logs the event, adds to `suppression_list`. Works without login. Completes immediately.

### 9.4 `sendContact(formData)`

Validate, Turnstile, rate limit (3 per hour per IP hash), insert into `contact_messages`, email the owner with reply to set to the sender, and auto reply to the sender with the expected response time. Topic `privacy_request` also creates a `privacy_requests` row.

### 9.5 `GET /go/[partner]`

As specified in section 4.3.

### 9.6 Search

`GET /api/search?q=` uses the `tsvector` columns and returns the top 10 published results across services, books, and guides. Debounced on the client, cached briefly.

---

## 10. Email

- Provider: Resend with the `{{DOMAIN}}` domain verified (SPF, DKIM, DMARC). Document the DNS records in the README.
- Templates built with React Email in `/emails`: `ConfirmSubscription`, `Welcome`, `ContactAutoReply`, `ContactNotifyOwner`, `MonthlyNewsletter` (layout only).
- Every marketing email includes: the site name in the From line (never "Audiobooks.com" or any partner's name in the From or Subject line, as the agreement requires), a plain unsubscribe link, the `List-Unsubscribe` and `List-Unsubscribe-Post` headers, the physical address `{{PHYSICAL_ADDRESS}}`, a short affiliate disclosure, and a link to the Privacy Policy.
- Visual style matches the site: `#F1F1F1` background, white rounded card, Google Sans or a system fallback, a single glossy green button. No gradients other than the button. No dashes in the copy.
- Sending the monthly newsletter is a manual owner action in `/admin/newsletter`: write in MDX, preview, send a test to the owner, then send to `confirmed` subscribers not in the suppression list, in batches that respect Resend limits. Store each send in a `newsletter_sends` table (`id, subject, body_mdx, sent_at, recipient_count`).
- Process Resend webhooks at `POST /api/webhooks/resend` (verify the signature): bounces set status `bounced`, complaints set `complained`, and both go into `suppression_list`.

---

## 11. Admin area (`/admin`)

Private, `noindex`, excluded from the sitemap. Built with the same design tokens as the site (white rounded cards on `#F1F1F1`, Google Sans headings, Inter body, bare Phosphor Light icons, glossy primary buttons only).

Screens:

1. **Login** with magic link or password plus TOTP.
2. **Dashboard:**
   - Counts of published, draft, and in review content.
   - **Freshness list:** facts and book availability checks older than 60 days, sorted by age, with a "Mark checked today" button that requires the owner to confirm the value and source URL.
   - Affiliate clicks in the last 30 days by partner and placement (simple table and a flat bar chart, no gradients).
   - New contact messages and privacy requests.
   - Newsletter subscriber counts by status.
3. **Services:** list and editor. Fields match the schema. Facts editor with source URL and checked date per row. MDX editor with live preview using the site components. "Publish" shows publish guard errors inline.
4. **Books:** list and editor, cover upload, the `available_on_audiobooks_com` toggle with a required checked date and a note reminding the owner to search the title on Audiobooks.com by hand, stores list.
5. **Guides, Comparisons, Pages, FAQs:** list and editors.
6. **Partners:** status, destination URL, affiliate URL, approval date. Changing a URL revalidates every page that links to it.
7. **Newsletter:** subscribers (search, export CSV of confirmed only), sends, compose.
8. **Inbox:** contact messages with status.
9. **Privacy requests:** verify, export a subscriber's data as JSON into the private bucket with a signed link valid for 7 days, or delete everything about that email (subscriber, consent events, contact messages), keeping only a suppression entry if they asked to never be emailed again.
10. **Corrections log:** add a public correction linked to a piece of content.

Every save writes a `content_revisions` snapshot via trigger. Show the last 10 revisions with a restore button.

---

## 12. Scheduled jobs (`pg_cron`)

- Daily: delete `pending` subscribers older than 7 days that never confirmed (and their consent events).
- Daily: delete `affiliate_clicks.ip_hash` values older than 30 days (set to null) and click rows older than 13 months.
- Daily: delete `contact_messages` marked `closed` or `spam` older than 12 months.
- Daily: clean `rate_limits` rows older than 1 day.
- Weekly: insert a summary row into `freshness_alerts` for facts older than 60 days; the dashboard reads it, and an optional weekly email to the owner lists them.

Document every retention period in the Privacy Policy page content (update it in the `pages` table through the import script).

---

## 13. Security checklist

- RLS on every table, policies tested.
- Secret key only in server only modules. Add an ESLint rule or a build script that fails if `SUPABASE_SECRET_KEY` appears in any client bundle.
- Strict security headers in `next.config`: Content Security Policy (allow Supabase, Turnstile, Google Fonts), `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` that disables camera, microphone, geolocation.
- All admin server actions re check `is_staff()` on the server; never trust the client.
- Turnstile on newsletter and contact forms; honeypot field; rate limits.
- Postgres functions use fixed `search_path`.
- Auth: sign ups disabled, MFA on the owner account, short session lifetime for admin.
- Backups: enable point in time recovery if the plan allows, otherwise document a weekly `supabase db dump` into the private bucket.

---

## 14. Testing

- **Database:** pgTAP tests in `/supabase/tests` for every RLS policy (anon cannot read drafts, anon cannot read subscribers, staff can publish only when guards pass) and for every publish guard rule.
- **Unit:** Vitest for zod schemas, the data access layer (against local Supabase), token hashing, rate limiting.
- **End to end:** Playwright for: home page loads from the database, a review page renders facts with sources, `/go/audiobooks-com` redirects and logs one click, newsletter signup to confirm to unsubscribe flow (use Resend test mode or a mocked sender), contact form, admin login and publish blocked by a `TODO_VERIFY`.
- CI script `npm run check` runs typecheck, lint, `lint:copy`, unit tests, and `supabase db lint`.

---

## 15. Deliverables

1. `/supabase/migrations/*` and `/supabase/seed.sql` (seed creates partners: audiobooks-com with status `pending` and its official homepage as destination; audible, spotify, storytel, libro-fm, everand, kobo-plus, chirp, libby with `not_applied`).
2. The swapped data access layer, with no visual change to the frontend.
3. Server actions, route handlers, email templates, webhooks.
4. The `/admin` area.
5. `scripts/import-mdx.ts` and a successful import of the existing content.
6. Tests and the `npm run check` script.
7. `README.md` sections: local setup with Supabase CLI, env vars, creating the owner account, deploying (Vercel plus Supabase), DNS for email, how to swap to the affiliate tracking URL after approval (edit the partner in `/admin/partners`, nothing else), how to answer a 24 hour consent proof request from the affiliate manager (query in `/admin/newsletter` that shows name, date, time, IP, and page URL for an email), and how to handle a privacy request.
8. An updated `CONTENT_TODO.md` generated from the database (a script that lists every draft blocked by publish guards and why).

Build it now. Start with migrations and RLS, then the data layer swap and import, then the forms and redirects, then email, then admin, then tests.
