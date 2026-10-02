# Agency Privé unified website

The original public Agency Privé website and the secure Next.js/Supabase platform are combined in this single deployable project. See `docs/UNIFIED-WEBSITE.md` for the complete route map, setup, and deployment notes.

## Access routes

- `/agency/login` — agency/company owners and invited employees
- `/agency/register` — new agency-owner registration
- `/agency/dashboard` — role-protected agency workspace
- `/owners/login` — Agency Privé platform owners only
- `/owners/dashboard` — role-protected owner operations (`super_admin` required)
- `/owner` — memorable alias for the private owner login

Old `/login`, `/register`, `/dashboard`, and `/admin` bookmarks remain compatibility routes, but must not be used for new links.

## Local setup

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local`.
3. Fill in `NEXT_PUBLIC_SITE_URL`, the Supabase project URL, and the Supabase publishable key.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never prefix it with `NEXT_PUBLIC_`.
5. Run `npm install`.
6. Run `npm run dev`.
7. Open `http://localhost:3000`.

## What is implemented

- Cookie-based Supabase email/password authentication.
- Email confirmation callback.
- Protected dashboard route.
- User profiles, agency memberships, platform staff roles, and security audit schema.
- Row-level security and server authorization helpers.
- A separate publication state and moderation case foundation.
- The exact original public site, including its pages, styles, scripts, images, and SEO files.
- Live public-directory loading through the secure `ap_public_agencies` database view.
- Integrated redirects from the original login, registration, and dashboard links.

## Production deployment

Deploy this folder as one Next.js project. Add every required value from `.env.example` to the Vercel project and use the same Supabase project that contains the migrations in `supabase/migrations/`. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin without a trailing slash. Add that origin and `/auth/callback` to Supabase Authentication URL configuration.

Before launch, provide approved Privacy, Terms, Cookie, and Acceptable Use policies, official social URLs, the official Trustpilot profile URL, and a monitored address for public concerns. Do not point public links at placeholders.
