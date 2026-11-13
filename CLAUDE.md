# CLAUDE.md

Personal site **driplex.xyz**, built with Astro 7 + TypeScript (strict). Fully static: no backend, no adapter, no auth, no Garmin/Strava sync, no deployment configured. Site content is in English; project docs (`README.md`, `ROADMAP.md`, `docs/`) are in French.

## Commands

```powershell
npm ci
npm run dev            # http://127.0.0.1:4321
npm run lint           # ESLint (typescript-eslint + eslint-plugin-astro)
npm test               # tsx --test tests/*.test.ts (unit + QA tests, no build needed)
npm run build          # astro check && astro build → dist/
node --test tests/built.test.mjs   # post-build check; requires dist/ from a fresh build
npm run format         # Prettier (single quotes, printWidth 100, astro plugin)
npm run format:check
```

Run a single test file: `npx tsx --test tests/home.test.ts`. Optional: `$env:ASTRO_TELEMETRY_DISABLED='1'`.

## Architecture

- **Pages** — `src/pages/`. Each page wraps `src/layouts/Layout.astro`, which provides the header, footer, self-hosted fonts (Fontsource), skip link, `SiteNav`, and the canonical URL and Open Graph tags (from `title`/`description`; pass `noindex` to keep a page out of search). `@astrojs/sitemap` builds `sitemap-index.xml` (the 404 is filtered out in `astro.config.mjs`) and `public/robots.txt` points to it.
- **Navigation** — defined once in `navigation` in `src/lib/home.ts`, rendered by `src/components/SiteNav.astro`. Desktop uses icon links with tooltips; mobile uses a `<details>` menu, so navigation needs no JS. Entries with `soon: true` are dimmed and get a "Soon" badge. To add an icon, update the `NavIcon` type and the `icons` map in `SiteNav.astro`. `/stuff/` is linked only from the footer. `/library/` is linked only from the Home.
- **Data validation** — Zod parses the local JSON at build time:
  - `src/lib/home.ts` → `src/data/home.json` (name, intro, social links; links must use HTTPS and may be `null`).
  - `src/lib/data.ts` → `src/data/profile.json` and `src/data/sessions.json`. Sessions are a discriminated union on `sport` (`Running` | `Strength`), use `.strict()`, need unique ids and real calendar dates, and **must have `demo: true`**.
  - Markdown posts: `src/content/posts/*.md`, defined as a collection in `src/content.config.ts` with fields `title`, `date`, `description`, `tag`, and served at `/notes/[id]`. Import `z` from `astro/zod`, not `astro:content` (deprecated in Astro 7).
- **Training** — `src/pages/training/index.astro` (dashboard) and `src/pages/training/[id].astro` (one page per session). Pure helpers live in `src/lib/training.ts`. The page's client `<script>` imports from `lib/training` and only `import type` from `lib/data`, so Zod never reaches the browser. Keep it that way. The client JS uses the native DOM API only (no framework) and writes data with `textContent`, never as HTML.
- **Dates** — civil UTC dates (`YYYY-MM-DD`, no time zone). The calendar starts on Monday and pads weeks with `outside` days. `DEMO_TODAY = '2026-10-29'` is the fixed "today". Future dates are excluded from stats and colours. Helpers take `today` as a parameter for tests.
- **Styles** — `src/styles/global.css` holds the Midnight Navy tokens in `:root` and the editorial styles. `src/styles/training.css` holds the dashboard styles. Use the tokens instead of raw hex values.

## Invariants enforced by tests

- `tests/qa.test.ts` checks that:
  - all 8 palette hex values (`#030812 #0A1220 #111C2B #1C2A40 #EDF3FC #9AAAC1 #3475BA #589BE8`) are defined as CSS variables in `global.css`;
  - text and link colours pass WCAG AA contrast;
  - `astro.config.mjs` keeps `output: 'static'` with no adapter;
  - no backend or sync dependencies exist (postgres, prisma, supabase, garmin, strava, express…);
  - no secrets appear in `src/`.
- `tests/built.test.mjs` expects exactly `11 + sessions + posts` HTML pages in `dist/`, each with `<html lang="en">` and an `<h1>`, and every internal `href`/`src` must resolve. **Adding or removing a top-level page means updating the `11`.**
- Home content and social links are covered by `tests/home.test.ts`. Data parsing and the calendar are covered by `tests/data.test.ts`.

## Conventions

- Prettier ignores `src/data/sessions.json` and `package-lock.json`.
- Commits use Conventional Commits (`feat(scope):`, `chore:`, `docs:`). Work goes on a feature branch with a PR to `main`. There is no automated deployment.
- Placeholder pages (Now, Photos, Map, League of Legends) are tracked in `ROADMAP.md`. When one gets real content, remove `soon: true` in `src/lib/home.ts` and tick it in the roadmap.
- Don't invent personal data. Everything in the JSON ships publicly in the build.
- `.codex/agents/ui-ux-designer.toml` describes the design workflow: audit, then 2–3 directions, then owner approval before any Astro/CSS change. Home stays editorial, not a SaaS dashboard.

## Docs

`docs/decisions.md` (technical decisions), `docs/training.md` (data model and calendar), `docs/design-system.md` (tokens, typography, navigation), `docs/home-v2.1.md`, `docs/validation.md` and `docs/qa-v2.md` (dated V2 reports, kept as historical records).
