# Induction '26 — IIIT Delhi

Official induction portal for IIIT Delhi, Class of 2028/2030. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Pages

| Route             | Description                      |
| ----------------- | -------------------------------- |
| `/`               | Landing page                     |
| `/schedule-btech` | B.Tech induction schedule        |
| `/schedule-pg`    | M.Tech / Ph.D induction schedule |
| `/mentors`        | Induction buddies                |
| `/gallery`        | Photo gallery                    |
| `/contact`        | Contact form and directions      |

## Schedule Data

Schedule is pulled live from a Google Sheet published as CSV. Both tracks share one sheet, filtered by a `Track` column (`BTECH` / `PG` / `ALL`). Pages server-render on load (revalidated every 90s) and the client polls `/api/schedule` every 3 minutes for live updates.

## Environment Variables

```
NEXT_WEB3_KEY=your_web3forms_access_key
```

Get a free key at [web3forms.com](https://web3forms.com).

## Dev

```bash
npm install
npm run dev
```
