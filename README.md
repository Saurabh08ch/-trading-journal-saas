# TradePilot

TradePilot is a modern SaaS-style trading journal built with Next.js 14, PostgreSQL, Tailwind CSS, Prisma, and Google OAuth.

## Features

- Google OAuth authentication with private dashboards
- Trade logging with date, instrument, strategy, prices, risk, position size, notes, emotion tags, and screenshots
- Automatic calculations for PnL, reward-to-risk, win/loss status, total trades, win rate, and average RR
- Trade history with edit and delete actions
- Analytics dashboard for monthly PnL, strategy performance, win rate split, and emotional patterns
- Docker and Docker Compose setup for VPS deployment

## Tech Stack

- Next.js 14 App Router
- Tailwind CSS
- Node.js route handlers
- PostgreSQL
- Prisma ORM
- NextAuth.js with Google OAuth
- Recharts

## Local Setup

1. Copy `.env.example` to `.env` and fill in the Google OAuth credentials.
2. Install dependencies:

```bash
npm install
```

3. Start PostgreSQL with Docker:

```bash
docker compose up -d db
```

4. Apply migrations:

```bash
npm run db:migrate
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

Recommended Node.js version: `20` or `22`.

## Environment Variables

Use `.env.example` as the template. The important values are:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

## Docker Deployment

Build and run the full stack:

```bash
docker compose up --build
```

The app runs on port `3000` and PostgreSQL runs on `5432`.

## Notes

- Screenshot uploads are stored in the `uploads/` directory and persisted through a Docker volume.
- Current trade calculations assume long trades based on entry and exit prices.
