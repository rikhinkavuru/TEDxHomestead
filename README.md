# TEDxHomestead

Website for TEDxHomestead, an independently organized TEDx event in Fort Wayne, IN — Tuesday, October 27, 2026, 6–8 PM, at the Allen County Public Library Main Branch. Free admission, capped at 100 attendees per TEDx rules.

This independent TEDx event is operated under license from TED. It is not sponsored by, endorsed by, or affiliated with Homestead High School or Southwest Allen County Schools.

Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

## Filling in the blanks

- **Speakers** — edit `src/data/speakers.ts` (names, titles, talk titles, bios) and drop headshots into `public/headshots/` as `speaker-1.jpg` … `speaker-6.jpg`. Until an image exists, the card shows a clean placeholder.
- **Event details** — everything (theme, room, contact email, socials) lives in `src/data/event.ts`.

## Tickets

- **Form** — `src/components/Tickets.tsx`. Collects name, email, and phone. "Add another person" adds another set of fields, up to 6 people per submission. Each person is reserved separately, gets their own database row, and gets their own confirmation email.
- **Server** — `api/reserve.ts` (a Vercel Function) calls the Supabase `reserve_ticket()` function, then emails a confirmation through Resend. A failed email never loses the seat.
- **Database** — `supabase/schema.sql` for a fresh project. Existing projects apply the files in `supabase/migrations/` in date order through the Supabase SQL editor. Limits: 100 seats, one ticket per name per email, up to 6 tickets per email.
- **Env vars (Vercel)** — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `RESEND_API_KEY` (from the Resend integration), and optionally `RESEND_FROM` once a sending domain is verified in Resend, e.g. `TEDxHomestead <tickets@tedxhomestead.com>`.
- **Local dev** — `npm run dev` has no `/api`, so it reserves straight through Supabase and skips email.
