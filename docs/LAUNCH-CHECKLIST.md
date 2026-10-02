# Agency Privé launch checklist

Use this checklist for the single unified deployment containing the public website, agency workspace, and private owner operations portal.

## 1. Production environment

- Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin without a trailing slash.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the production Supabase project.
- Set `SUPABASE_SERVICE_ROLE_KEY` only if a server operation explicitly requires it. Never expose it with a `NEXT_PUBLIC_` prefix.
- Add Stripe secrets only when live billing and webhook handling are implemented.
- Confirm `.env.local`, `.env`, and all secret values are excluded from source control.

## 2. Supabase

- Apply migrations in the order documented in `DATABASE-MIGRATION-ORDER.md`.
- Set the Supabase Site URL to the production origin.
- Add `https://YOUR-DOMAIN/auth/callback` to allowed redirect URLs.
- Confirm email confirmation templates link to the production callback.
- Confirm both Agency Privé owner accounts have the intended `super_admin` role.
- Test agency membership roles with separate non-owner accounts.
- Confirm Row Level Security remains enabled on all private and operational tables.
- Confirm the `editorial-media` storage bucket and its policies match the intended public-cover/private-admin workflow.

## 3. Canonical routes

- Public website: `/`
- Agency login and registration: `/agency/login`, `/agency/register`
- Agency workspace: `/agency/dashboard`
- Agency Privé owner login: `/owners/login`
- Agency Privé owner operations: `/owners/dashboard`
- Confirm legacy `/dashboard` and `/admin` bookmarks redirect correctly.

## 4. End-to-end acceptance test

- Register a new agency-owner account and confirm the email.
- Sign in, create a private agency profile, save it, and submit it for moderation.
- Confirm editing is locked during moderation.
- Request changes, revise, resubmit, approve, and publish as separate actions.
- Confirm only published profiles appear in the public directory.
- Submit, review, and reject a controlled verification request; confirm publication is unchanged.
- Submit and moderate a review with evidence; test report, agency response, dispute, and fraud workflows.
- Confirm every owner action creates the expected audit record.
- Submit a public inquiry and confirm privacy-protected and entitled agency inbox behavior.
- Test subscription and sponsored-placement workflows without changing verification or objective ranking.
- Create, schedule, publish, and view an editorial article with a cover image and disclosure.

## 5. Public launch content

- Replace the generic Trustpilot URL with the official Agency Privé profile URL when available.
- Add approved Privacy, Terms, Cookie, and Acceptable Use pages reviewed for the operating jurisdictions.
- Add official LinkedIn, Instagram, and X URLs or remove their icons until accounts exist.
- Connect the demo-request form to an approved destination; it currently identifies itself as a non-submitting preview.
- Add a monitored reporting/contact channel for public concerns.
- Remove controlled test profiles, reviews, verification records, inquiries, and editorial drafts from production.

## 6. Deployment verification

- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npm run build`.
- Test at 360 px, 390 px, 768 px, 1024 px, 1440 px, and a large desktop width.
- Test Chrome, Edge, Safari, and Firefox where available.
- Verify `/robots.txt` and `/sitemap.xml` use the production domain.
- Verify private portal pages return `noindex, nofollow`.
- Verify security headers are present on the deployed domain.
- Verify HTTPS, custom-domain redirects, email delivery, and Supabase callback behavior.

## Launch decision

Do not announce the site as fully operational until the legal links, official contact destinations, production credentials, email delivery, and complete end-to-end acceptance test are finished on the deployed preview domain.
