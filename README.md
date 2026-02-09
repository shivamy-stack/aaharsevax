# Food-Bridge (aaharsevax)

This repository contains a single deployable site (frontend + backend). The frontend is built with Vite + React and the backend is an Express app bundled for serverless on Vercel.

## Quick deploy (overview)

1. Create a Neon Postgres database and copy the connection string (DATABASE_URL).
2. Add the `DATABASE_URL` in your Vercel project Environment Variables (Production). Also set `NODE_ENV=production`.
3. Commit and push the repository to your Git provider (GitHub/GitLab). Import the repo into Vercel or use the Vercel CLI.
4. Vercel will run `npm run build` and serve the static assets and `/api/*` routes from the serverless handler.

## Local testing

Install dependencies and build:

```powershell
npm install
npm run build
```

Start a local production server (from the built bundle):

```powershell
node dist/index.cjs
```

The app will serve the frontend from `/` and API routes under `/api`.

Note: If `DATABASE_URL` is not set, the server will use an in-memory fallback storage so the UI and basic endpoints still work (useful for testing and deployment verification). To enable full DB-backed functionality, set `DATABASE_URL` to your Neon Postgres URL.

## Migrations

This project uses `drizzle-kit`. To push migrations:

```powershell
npm run db:push
```

Ensure `DATABASE_URL` is set when running migrations.

## Deploy with Vercel CLI

Install Vercel CLI and deploy (you will be prompted to log in):

```powershell
npm i -g vercel
vercel login
vercel --prod
```

Alternatively, import the repository in the Vercel dashboard and set the environment variables there.

## Environment variables

Use `.env.example` as a template. At minimum set:

- `DATABASE_URL` — Neon Postgres connection string
- `NODE_ENV=production`

If you want me to push these changes and attempt a Vercel deploy from this environment, tell me and provide Vercel auth or connect your Vercel account.
