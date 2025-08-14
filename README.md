## Flex Living Reviews Dashboard

Admin dashboard to explore, filter, and approve property reviews, plus public listing pages that render only approved reviews. Built with Next.js App Router, SWR, and Chart.js. Uses Vercel KV (or an in‑memory fallback) to store approved review IDs.

### Live Demo

- https://theflex-assessment.vercel.app/

### Main Features

- Reviews analytics dashboard (`/dashboard`) with filters (listing, channel, rating, category, date), sorting, and pagination
- Trends chart and per‑property performance table
- Approve/Unapprove reviews to control what appears publicly
- Public listing pages at `/listing/[slug]` showing only approved reviews
- Pluggable data sources: Hostaway mock/sandbox, optional Google Places fetch
- Simple auth: password‑protected dashboard (via `ADMIN_PASSWORD`)

### API Overview

- `GET /api/reviews/hostaway`
  - Query: `listing`, `channel`, `type`, `from`, `to`, `minRating`, `category`, `sortBy` (date|rating), `sortDir` (asc|desc), `page`, `pageSize`
  - Returns normalized reviews plus aggregates and pagination
  - Uses Hostaway sandbox when `HOSTAWAY_ACCOUNT_ID` and `HOSTAWAY_API_KEY` are set; falls back to mock data
- `GET /api/reviews/public?listingKey=listing-<id-or-slug>`
  - Returns only approved reviews for a listing (for public pages)
- `GET /api/reviews/approved-map?listingKeys=listing-a,listing-b`
  - Returns `{ map: { [listingKey]: string[] /* reviewIds */ } }`
- `POST /api/reviews/selection`
  - Body: `{ listingKey: string, reviewId: string, approved: boolean }`
  - Adds/removes a review ID in the approved set for a listing
- `GET /api/reviews/google?placeId=...`
  - Fetches raw Google reviews when `GOOGLE_PLACES_API_KEY` is set; otherwise returns `{ configured: false }`
- Auth
  - `POST /api/auth/login` with `{ username, password }` sets an auth cookie
  - `POST /api/auth/logout` clears the auth cookie
  - Middleware protects `/dashboard` using `ADMIN_PASSWORD`

### Run Locally (Node 18+)

1) Create `.env.local` at the repo root:

```
ADMIN_PASSWORD=your_password

# Optional: Vercel KV (recommended in prod)
# KV_REST_API_URL=...
# KV_REST_API_TOKEN=...

# Optional: Hostaway sandbox (falls back to mock if omitted)
# HOSTAWAY_ACCOUNT_ID=...
# HOSTAWAY_API_KEY=...

# Optional: Google Places
# GOOGLE_PLACES_API_KEY=...
```

2) Install and run:

```bash
npm install
npm run dev
```

3) Open `http://localhost:3000/signin` and sign in with any username and the `ADMIN_PASSWORD`. Then visit `/dashboard`.

Scripts:

```bash
npm run build   # Production build
npm start       # Run production server
```

### Deploy on Vercel

1) Push this repo to GitHub and import into Vercel
2) Set Environment Variables:
   - `ADMIN_PASSWORD` (required to access `/dashboard`)
   - `KV_REST_API_URL`, `KV_REST_API_TOKEN` (optional but recommended for persistence)
   - `HOSTAWAY_ACCOUNT_ID`, `HOSTAWAY_API_KEY` (optional)
   - `GOOGLE_PLACES_API_KEY` (optional)
3) Deploy. Public pages render approved reviews at `/listing/[slug]`; the dashboard is at `/dashboard` (auth required).

### Tech

- Next.js 15 (App Router), React 19, SWR, Chart.js
- Vercel KV with in‑memory dev fallback
