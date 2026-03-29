# RTS Website

This project supports Option 1 production architecture:

- Frontend hosted on Netlify
- Backend API hosted separately (Render or Railway)
- Managed Postgres database for production
- Twilio SMS notifications from the backend

Local development continues to use SQLite by default for convenience.

## Local Development

1. Copy `.env.example` to `.env`.
2. Fill in Twilio values.
3. Start frontend + backend:

```bash
npm run dev:full
```

Vite proxies `/api/*` to `http://localhost:3001` locally.

## Environment Variables

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=
PG_SSL=true
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=
TWILIO_TO_NUMBER=19049421059
VITE_API_BASE_URL=
```

Notes:

- If `DATABASE_URL` is set, backend uses Postgres.
- If `DATABASE_URL` is empty, backend uses local `server/data/quotes.db` SQLite.
- `CORS_ORIGIN` accepts a comma-separated list in production.
- Set `VITE_API_BASE_URL` on Netlify to your hosted backend URL.

## Production Deploy (Option 1)

1. Deploy backend (`server/index.js`) to Render or Railway.
2. Create managed Postgres (Neon, Supabase, Railway Postgres, or Render Postgres).
3. Set backend env vars:
	 - `DATABASE_URL`
	 - `PG_SSL=true`
	 - `CORS_ORIGIN=https://your-netlify-site.netlify.app`
	 - Twilio env vars
4. Deploy frontend to Netlify.
5. Set Netlify env var:
	 - `VITE_API_BASE_URL=https://your-backend-domain`
6. Rebuild/redeploy frontend after env changes.

## API

- `POST /api/quotes`
	- Saves quote data to the active database (Postgres or SQLite)
	- Sends SMS notification when Twilio env vars are configured
- `GET /api/health`
	- Returns status and active database mode
