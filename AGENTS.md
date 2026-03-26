# AGENTS.md

Project-specific rules and notes for AI agents working in this codebase.

## Commands

```sh
node --run build          # wrangler types && astro check && astro build
node --run dev            # wrangler types && astro dev --port 3000
node --run preview        # wrangler dev (Cloudflare Workers local preview)
node --run deploy         # build && wrangler deploy
node --run lint           # biome check .
node --run lint-fix       # biome check . --write
node --run cli            # interactive CLI for blog/newsletter tasks
```

Always run `node --run build` before marking a task complete. It runs type generation,
type checking, and the full Astro build in one step.

## Stack

- **Framework**: Astro 6 — static output, deployed to Cloudflare Workers via `@astrojs/cloudflare` v13
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config` file needed for basic use)
- **Fonts**: Mulish variable font via `fontProviders.local()` — file lives at `src/assets/fonts/mulish-variable.woff2`
- **Linter/formatter**: Biome v2
- **Package manager**: pnpm

## Git

- Branch names must use the `yagiz/` prefix (e.g. `yagiz/fix-something`)
- Do not add Claude/AI as a git commit author
- Keep commits small and focused

## TypeScript

- Use TypeScript **5.x** (`^5.9.3`). Do NOT upgrade to v6 — Astro and its ecosystem
  require `typescript@^5.0.0`. Running `pnpm update --latest` will pull in v6; pin it
  back with `pnpm add -D typescript@^5` and update `package.json` to `"typescript": "^5.9.3"`.

## Astro-specific

- **Content config**: lives at `src/content.config.ts` (NOT `src/content/config.ts` —
  that was the Astro v4 location). All collections must use loaders (e.g. `glob()`).
- **`z` (Zod)**: import from `astro/zod`, not from `astro:content`.
- **`experimental.contentIntellisense`**: removed in Astro 6 — do not add it back.

## Cloudflare adapter (v13)

These APIs were **removed** in `@astrojs/cloudflare` v13 / Astro 6. Do not use them:

| Old (v4/v5) | New (v13 / Astro 6) |
|---|---|
| `Astro.locals.runtime.env` | `import { env } from "cloudflare:workers"` |
| `Astro.locals.runtime.cf` | `Astro.request.cf` |
| `Astro.locals.runtime.caches` | global `caches` |
| `Astro.locals.runtime.ctx` | `Astro.locals.cfContext` |

Cloudflare bindings (D1, KV, etc.) are accessed like this in API routes:

```ts
import { env } from 'cloudflare:workers'

export const POST: APIRoute = async ({ request }) => {
  const result = await env.MY_BINDING.prepare('SELECT 1').run()
}
```

`App.Locals` only has `cfContext: ExecutionContext` — there is no `runtime` property.

- Cloudflare Pages support was **removed** in adapter v13. The project deploys to
  **Cloudflare Workers**. Do not add `pages_build_output_dir` to `wrangler.toml`.
- Pages prerendering now uses Cloudflare's `workerd` runtime by default. If a
  prerendered page uses Node.js-only packages (e.g. `sharp`, `satori`), set
  `prerenderEnvironment: 'node'` in the adapter config in `astro.config.ts`.

## D1 — newsletter database

- **Binding**: `newsletter` (lowercase)
- **Database name**: `newsletter`
- **Database ID**: `33ad2d37-f48c-4033-86fd-81c7ade04178`
- **Schema**: `migrations/0001_create_subscribers.sql`

Apply migrations:
```sh
wrangler d1 migrations apply newsletter --remote   # production
wrangler d1 migrations apply newsletter --local    # local dev
```

Add new schema changes as `migrations/0002_*.sql`, `migrations/0003_*.sql`, etc.
Never edit existing migration files.

## Fonts

The site uses the Mulish variable font. It is self-hosted via Astro's built-in fonts API
(`fontProviders.local()`), configured in `astro.config.ts`. The WOFF2 file is at
`src/assets/fonts/mulish-variable.woff2`. The CSS variable `--font-mulish` is injected
automatically by the `<Font cssVariable="--font-mulish" preload />` component in
`src/layouts/Layout.astro`.

Do **not** use `fontProviders.fontsource()` — it requires outbound HTTPS to
`api.fontsource.org` which may be blocked in restricted build environments.

## Removed dependencies (do not re-add)

| Package | Replaced by |
|---|---|
| `@fontsource-variable/mulish` | Astro fonts API + local WOFF2 |
| `astro-seo` | Inline meta tags in `Layout.astro` |
| `date-fns` | Native `Date.getTime()` / `toISOString().split('T')[0]` |
| `reading-time` | Inline word-count: `Math.max(1, Math.round(words / 200)) + " min read"` |
| `open` | Was unused |
