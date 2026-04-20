# Vercel Daily

A Next.js 16 demo news publication built for the **Vercel Solution Partner Certification Program (Cohort 2, Q1 2026)**.

Showcases Cache Components, `"use cache"`, Suspense streaming, Server Actions, `proxy.ts` middleware, and an anonymous cookie-based subscription with a paywall.

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in API URL + bypass token
npm run dev                        # http://localhost:3200
```

### Env vars

```
VNEWS_API_URL=https://vercel-daily-news-api.vercel.app/api
VNEWS_API_BYPASS_TOKEN=<vercel-deployment-protection-bypass>
```

---

## Stack

- **Next.js 16.2.4** (Turbopack, App Router, Cache Components)
- **React 19.2.4**
- **Tailwind CSS v4** (`@theme inline` tokens)
- **lucide-react** icons
- TypeScript strict mode

---

## Pages

| Route | What it does |
|---|---|
| `/` | Breaking-news ticker, hero, fresh-posts grid, per-category sections |
| `/articles/[slug]` | Article detail with paywall + TTS "Play audio" button |
| `/search` | URL-synced search with query + category filter |
| `/category/[slug]` | Category archive with split Suspense (header streams first, grid streams second) |

---

## Key features

- **Cache Components** enabled in `next.config.ts`. Every route builds as `◐` (Partial Prerender).
- **`cacheLife()` profiles** on every cached data wrapper so upstream API responses stay warm across requests.
- **`proxy.ts`** (renamed from `middleware.ts` in Next 16) reads the `vd_sub` cookie and forwards it as `x-subscription-token`.
- **Server Actions** (`subscribe` / `unsubscribe`) in `app/actions.ts` + `revalidatePath("/", "layout")`.
- **Browser TTS reader** on article pages with a preference list (Samantha → Karen → Google US English → fallback). Paywall-aware: guests only hear the teaser paragraph.

Required by the cert brief:
- `<meta name="generator" content="vnews-cert-v3">`
- `theme-color: #1a1a2e`
- Open Graph metadata on every page

---

## Project layout

```
src/
├── app/
│   ├── layout.tsx             # Fonts, metadata, Header + Footer
│   ├── page.tsx               # Homepage
│   ├── articles/[slug]/       # Article detail + paywall
│   ├── category/[slug]/       # Category archive (split Suspense)
│   ├── search/                # Search page
│   ├── actions.ts             # Server Actions
│   └── ui/skeletons.tsx       # All Suspense fallbacks
├── components/                # Header, Footer, ArticleCard, Paywall, …
├── lib/
│   ├── api.ts                 # External API fetch layer
│   ├── data.ts                # "use cache" + cacheLife() wrappers
│   └── subscription.ts        # Cookie + isSubscribed()
├── proxy.ts                   # Edge middleware
└── types.ts
```

---

## Scripts

```bash
npm run dev      # Next dev server (Turbopack)
npm run build    # Production build — every route shows ◐ marker
npm run start    # Production server
npm run lint     # ESLint with react-hooks/set-state-in-effect rule
```
