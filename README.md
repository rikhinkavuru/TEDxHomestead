# TEDxHomesteadHighSchool

Website for the TEDx event at Homestead High School, Fort Wayne, IN — Friday, October 2, 2026, 5–8 PM. Free admission, capped at 100 attendees per TEDx rules.

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

The "smart ticket" flow lives in `src/lib/tickets.ts`. The current shell enforces one ticket per device and per normalized email (gmail dot/plus-alias tricks are collapsed), with a honeypot + time-to-fill bot check in the form.

**Important:** real capacity enforcement across all visitors needs a small backend — a browser can't see other people's reservations. Every ticket function is async and isolated in `tickets.ts` with `TODO(backend)` markers, so wiring up Supabase/Firebase/a serverless function later means changing only that file.
