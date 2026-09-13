# Tamatem Game Store — Frontend

Next.js (App Router) + TypeScript frontend for the Tamatem Game Store: login,
a paginated/filterable product grid, product details with a Buy button, and a
purchase receipt page. Talks to the FastAPI backend in the sibling `backend/` repo.

## Setup & run

Requires Node 20+ and the backend running (see `backend/README.md`; defaults to
`http://localhost:8000`).

```bash
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL, defaults to localhost:8000

npm install
npm run dev
```

Open `http://localhost:3000`. Log in with whatever user you seeded on the backend
(e.g. `python -m scripts.seed_user demo@tamatem.co password123` from `backend/`).

```bash
npm run build && npm start   # production build
npm run lint                 # ESLint
npx tsc --noEmit             # type-check only
```

## Structure

```
src/
  app/
    login/page.tsx              Login form
    (protected)/layout.tsx      Auth guard + header/logout, shared by every route below
    (protected)/products/page.tsx           Product grid, pagination, location filter
    (protected)/products/[id]/page.tsx      Product detail + Buy button
    (protected)/receipt/[orderId]/page.tsx  Purchase receipt
  lib/
    api/        Typed fetch client — one function per backend endpoint
    auth/       AuthContext (token storage) + useRequireAuth guard hook
  types/        TypeScript types mirroring the backend's Pydantic schemas
```

The `(protected)` route group is a layout, not a URL segment — `/products` still
resolves to `/products`, but every page under it shares one auth check and one
header instead of each page re-implementing the guard.

## Design decisions & assumptions

- **SWR for data fetching**, not hand-rolled `useEffect` + `setState`. This is the
  officially recommended pattern for this Next.js/React version — a plain
  effect-based fetch trips `react-hooks/set-state-in-effect` (calling a state setter
  directly in an effect body is now a lint error, not just a style nit) and doesn't
  get the request deduplication/revalidation SWR provides for free.
- **`useSyncExternalStore` for the auth token**, not `useState` + a mount `useEffect`.
  Reading `localStorage` has to happen client-side only, but a `useEffect`-based
  read hits the same lint rule as above. `useSyncExternalStore` is the mechanism
  React actually provides for "a value that differs between server and client until
  hydration completes," and it needed no lint suppression.
- **Client Components throughout**, not Server Components fetching on the server.
  Every page needs the browser-held JWT to call the API, so there's no server-side
  data to fetch — a Server Component here would just add a layer that immediately
  hands off to the client anyway.
- **`localStorage`, not an httpOnly cookie**, for the token. Simpler for a
  same-origin-in-dev, JSON-API backend with no server-rendered authenticated pages;
  a cookie set by the backend would be the next step for production-grade XSS
  hardening.
- **No client-side global state library.** Context (for the token) plus SWR's own
  cache is enough at this scope — Redux/Zustand would be pure overhead here.
- **Receipt page always fetches `GET /orders/{id}`** rather than passing the
  just-created order through client-side state/sessionStorage. Slightly more
  network calls, but it means a refresh or a direct link to a receipt always works,
  with meaningfully less code and no SSR/hydration edge cases to reason about.

## Verified

Manually driven end-to-end with a headless browser against the real backend
(Docker Compose): unauthenticated `/` → `/login` redirect, login, the product grid
(paginated, location filter, distinct bold titles vs. lighter descriptions), a
product detail page, a completed purchase landing on its receipt page, logout, and
the auth guard correctly bouncing a logged-out direct visit to `/products` back to
`/login` — zero console errors throughout. Also checked at a 390px mobile width.
`npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass clean.
