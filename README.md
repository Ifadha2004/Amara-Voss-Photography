# Amara Voss Photography

A full-stack portfolio site for a fictional street, landscape and portrait photographer. Visitors can browse and filter a gallery, save favourite photos, and book spots on photo walks and workshops. Sign-up and login are real, and everything is stored in a Postgres database.

- **Live site:** https://amara-voss-photography.vercel.app
- **Live API:** https://amara-voss-photography.onrender.com/api/photos

> The API runs on a free Render plan that sleeps after 15 minutes without traffic. The first request after a quiet period can take up to a minute.

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 (JavaScript, no TypeScript) |
| Backend | Node.js, Express 5 |
| Database | Postgres on Neon, accessed with `pg` and plain SQL |
| Auth | Better Auth (email and password, cookie sessions) |
| Hosting | Vercel (client), Render (server), Neon (database) |

## Features

- Gallery filtered by category (`useState`), favourites, a "Saved only" view and a lightbox
- Favourites saved per user in the database, so they survive reloads and follow the account to any device
- Events section with a spots stepper (a controlled component), live spots-left count and bookings stored per user
- Sign up, sign in and sign out, with sessions that survive a page refresh
- Responsive, mobile-first layout with no horizontal scroll at any width

## How it fits together

```
Browser (React on Vercel)
   │  fetch("/api/...")  same-origin, so the session cookie stays on one domain
   ▼
Vercel rewrite  ──►  Express API (Render)  ──SQL──►  Postgres (Neon)
                        ├─ /api/auth/*  Better Auth (users, sessions)
                        └─ requireAuth middleware protects favourites and bookings
```

The browser only ever talks to the Vercel address. `client/vercel.json` forwards anything starting with `/api` to the Render server. In development, Vite's proxy (`client/vite.config.js`) does the same job for `localhost:3000`.

## Folder structure

```
.
├── client/                    React app (Vite)
│   ├── public/images/         WebP photos
│   ├── src/
│   │   ├── components/        Header, Hero, Gallery, Events, EventCard, SpotStepper, ...
│   │   ├── lib/               api.js (fetch helpers), auth-client.js
│   │   └── index.css          Tailwind import and theme colours/fonts
│   └── vercel.json            Forwards /api to the Render server
├── server/                    Express API
│   ├── src/
│   │   ├── index.js           App setup, mounts routes
│   │   ├── db.js              Postgres connection pool
│   │   ├── auth.js            Better Auth configuration
│   │   ├── middleware/        requireAuth.js
│   │   └── routes/            photos, events, favourites, bookings
│   ├── db/
│   │   ├── schema.sql         Table definitions
│   │   ├── seed.js            Loads photos and events into the database
│   │   └── data/              Seed data
│   └── .env.example           Names of the required environment variables
└── README.md
```

## Database schema

| Table | What it stores |
|---|---|
| `user`, `session`, `account`, `verification` | Created by Better Auth: who has an account, who is signed in, and hashed passwords |
| `photos` | The gallery: title, category, image path, alt text |
| `events` | Photo walks and workshops: date, place, price, capacity, and `already_booked` for seats taken before the site existed |
| `favourites` | A user saved a photo. Primary key on `(user_id, photo_id)` so a photo can only be saved once |
| `bookings` | A user reserved seats at an event. One row per user per event |

Spots left is never stored. It is calculated in SQL as `capacity - already_booked - SUM(bookings.seats)`, so it cannot go out of date.

## Authentication

1. Sign-up stores the user and a **hashed** password (never the plain one).
2. Sign-in creates a row in `session` and sends the browser a signed, HTTP-only cookie.
3. On every request, the cookie is looked up in `session` to find who the user is. That is why a refresh keeps you signed in.
4. `requireAuth` middleware guards the favourites and bookings routes and answers `401` when there is no valid session.
5. In React, `authClient.useSession()` tells the header whether to show **Sign in** or the account menu.

## API

| Route | Auth | Purpose |
|---|---|---|
| `GET /api/health` | no | Server and database check |
| `GET /api/photos` | no | All photos (`?category=` optional) |
| `GET /api/events` | no | Events with `spotsLeft` |
| `GET /api/favourites` | yes | Ids of my saved photos |
| `PUT` / `DELETE /api/favourites/:photoId` | yes | Save or unsave a photo |
| `DELETE /api/favourites` | yes | Clear all my saved photos |
| `GET /api/bookings` | yes | My bookings |
| `POST /api/bookings` | yes | Reserve seats (capacity is re-checked in a transaction) |
| `DELETE /api/bookings/:eventId` | yes | Cancel my booking |
| `/api/auth/*` | – | Sign up, sign in, sign out, session (Better Auth) |

## Run it locally

Requires Node 20+ and a Postgres database (a free Neon project works).

```bash
git clone https://github.com/Ifadha2004/Amara-Voss-Photography.git
cd Amara-Voss-Photography

# server
cd server
cp .env.example .env        # then fill in the values
npm install
npm run seed                # creates the photos and events rows
npm run dev                 # http://localhost:3000

# client (second terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

The tables in `server/db/schema.sql` must exist before seeding. The auth tables are created by running `npx @better-auth/cli migrate --config src/auth.js` in `server/`.

### Environment variables (`server/.env`, never committed)

| Name | Meaning |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | Long random string that signs session cookies |
| `BETTER_AUTH_URL` | Public address of the site (`http://localhost:5173` locally) |
| `PORT` | API port (3000 locally; the host sets it in production) |

## Known limits

- The contact form validates and shows a thank-you message, but does not store messages yet.
- Local development and the live site share one Neon database.
- The Render free plan sleeps when idle.
- Events and the photographer are fictional.

## Credits

Photographs are free-to-use stock images used for this project.

## History

The original HTML/CSS version is preserved under the `project1` tag.