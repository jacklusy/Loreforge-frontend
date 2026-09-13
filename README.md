# Loreforge — Frontend

Next.js (App Router) + TypeScript frontend for Loreforge, a digital game-item
marketplace: a landing page, login, a paginated/filterable product grid, product
details with a Buy button, a purchase receipt, order history, and a profile page
(account info, password change, recent activity). Talks to the FastAPI backend in
the sibling `backend/` repo. Built for a Tamatem technical assessment — the
consumer-facing brand is original and unrelated to Tamatem's own branding; see
`../ROADMAP.md` for the assignment this satisfies.

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
    page.tsx / HomeCta.tsx        Landing page (auth-aware CTA)
    login/                        Login page (redirects away if already signed in)
    not-found.tsx / error.tsx     Branded 404 and global error boundary
    icon.svg / opengraph-image.tsx  Favicon and social-share image
    (protected)/layout.tsx        Auth guard + header/nav/footer, shared by every route below
    (protected)/products/                   Product grid, pagination, location filter
    (protected)/products/[id]/              Product detail + Buy button
    (protected)/receipt/[orderId]/          Purchase receipt
    (protected)/orders/                     Order history (paginated)
    (protected)/profile/                    Account info, change password, activity feed
  components/ui/    Shared design-system primitives (Button, Card, Badge, Alert, Footer, …)
  lib/
    api/        Typed fetch client — one function per backend endpoint
    auth/       AuthContext (token storage) + useRequireAuth guard hook + shared storage key
    product-visuals.ts   Deterministic icon/gradient per product title
  types/        TypeScript types mirroring the backend's Pydantic schemas
```

The `(protected)` route group is a layout, not a URL segment — `/products` still
resolves to `/products`, but every page under it shares one auth check and one
header instead of each page re-implementing the guard.

## Design system

- **Tokens** (`app/globals.css`): semantic CSS variables (`--background`,
  `--surface`, `--stroke`, `--muted-foreground`, …) rather than raw color
  utilities everywhere, plus `brand` (violet) and `accent` (amber) color scales
  aliased from Tailwind's defaults — a deliberate two-color identity instead of a
  single default blue. Dark mode follows `prefers-color-scheme` automatically;
  there's no manual toggle to keep in sync.
- **Primitives** (`components/ui/`): `Button`/`ButtonLink`, `Card`, `Badge`,
  `Alert`, `Skeleton`, `Pagination`, `Logo` — every page composes these instead of
  ad-hoc Tailwind classes, so spacing, radii, and color usage stay consistent
  without a component-by-component review.
- **Icons**: `lucide-react`. Product cards get a keyword-matched icon and gradient
  per title (`lib/product-visuals.ts`) instead of a generic placeholder — there
  are no real product images in the dataset, so this gives each card a distinct,
  intentional look with a stable hash-based fallback for unrecognized titles.

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
- **Client Components throughout the authenticated app**, not Server Components
  fetching on the server. Every protected page needs the browser-held JWT to call
  the API, so there's no server-side data to fetch there. The landing page and
  404/error pages *are* Server Components (for real `export const metadata`);
  client-only pages set their tab title imperatively via `document.title` instead,
  since a Client Component can't export `metadata`.
- **Pagination and the location filter live in the URL** (`?page=2&location=SA`),
  not component state — a refresh, a shared link, or the browser back/forward
  buttons all land on the same view instead of silently resetting to page 1.
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
- **No flag emoji for JO/SA.** Windows has known inconsistencies rendering regional
  indicator flag emoji (some configurations show plain text instead of a flag) — a
  `MapPin` icon plus the region name is used instead, which renders identically
  everywhere.

## Verified

Manually driven end-to-end with a headless browser against the real backend
(Docker Compose), light and dark, at 390px (mobile), 768px (tablet), and 1280px
(desktop): the landing page's auth-aware CTA, login (including redirecting an
already-authenticated visit away from `/login`), the product grid with pagination
and location filtering surviving a reload, a purchase landing on its receipt page,
logout, the auth guard on every protected route, and the branded 404 page — zero
console errors throughout. `npx tsc --noEmit`, `npm run lint`, and `npm run build`
all pass clean.
