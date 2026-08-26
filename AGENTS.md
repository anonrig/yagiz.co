# AGENTS.md

Project-specific rules and notes for AI agents working in this codebase.

## Commands

```sh
node --run build          # wrangler types && astro check && astro build
node --run dev            # wrangler types && astro dev --port 3000
node --run preview        # wrangler dev (Cloudflare Workers local preview)
node --run deploy         # build && wrangler deploy
node --run lint           # wrangler types && astro sync && oxlint . && oxfmt --check
node --run lint-fix       # wrangler types && astro sync && oxlint --fix . && oxfmt
node --run cli            # interactive CLI for blog/newsletter tasks
```

Always run `node --run build` before marking a task complete. It runs type generation,
type checking, and the full Astro build in one step.

## Stack

- **Framework**: Astro 7 — static output, deployed to Cloudflare Workers via `@astrojs/cloudflare` v14
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config` file needed for basic use)
- **Fonts**: Mulish variable font via `fontProviders.local()` — file lives at `src/assets/fonts/mulish-variable.woff2`
- **Linter/formatter**: Oxlint + Oxfmt (not Biome). Configs are `.oxlintrc.json` and
  `.oxfmtrc.json`. Oxfmt cannot format `.astro` yet, and does not touch `src/content/**`.
  Type-aware oxlint (`oxlint-tsgolint`) is on. The project's `typescript`
  package stays on 6 so `@astrojs/check` keeps working; tsgolint bundles
  TypeScript 7 itself. `tsconfig.json` must not set `baseUrl` (removed in TS 7;
  `paths` resolve relative to the config file). Do not enable
  `options.typeCheck` — `astro check` remains the typechecker. Lint runs
  `wrangler types` and `astro sync` first because those generated files are
  gitignored and type-aware rules treat missing collection / Env types as
  `any`.
  `prefer-readonly-parameter-types` stays off (Astro / Workers types are not
  readonly). Untyped `.mjs` CLI scripts skip the `no-unsafe-*` family. All
  `jsx-a11y` rules are on, including `anchor-ambiguous-text` (SEO / Lighthouse
  link text). Mutating `Array#sort` / `Array#reverse` as statements is forbidden
  (`toSorted` / `toReversed`). Implicit browser globals (`event`, `name`,
  `status`, `length`) and `document.write` / `document.writeln` are restricted.
  Unused disable comments are errors. Oxlint still only lints Astro frontmatter,
  not templates, so in-markup SEO / Lighthouse (meta, headings, template links)
  is not linted.
- **Package manager**: pnpm

## Git

- Branch names must use the `yagiz/` prefix (e.g. `yagiz/fix-something`)
- Do not add Claude/AI as a git commit author
- Keep commits small and focused

## Pull requests (LLM-ready)

Write PR bodies for humans and agents the same way `/llms.txt` is written for the site:
structured facts first, then a checkbox test plan. Use `.github/PULL_REQUEST_TEMPLATE.md`.

Required sections:

1. YAML frontmatter — `type`, `intent`, `app-source-changed`, constraints, verify
   commands, and a preview URL when CI produced one
2. `## Summary` — what changed and why (see #209)
3. `## Non-goals` — holds and things reviewers should not "fix"
4. `## Test plan` — checkboxes with exact commands and expected status/headers

When a change can touch markdown, MDX, the Worker, or the sitemap, the test plan
must include the LLM surfaces: `/llms.txt`, `/llms-full.txt`, `Accept: text/markdown`,
`.md` YAML frontmatter, `406` for unknown types, and sitemap exclusion of `.md` /
`llms*.txt`.

## TypeScript

- Use TypeScript 6 (`^6.0.0`) for the project compiler. TypeScript 7 is available
  but breaks `@astrojs/check` (no Language Service API;
  [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321)).
  Stay on TS 6 until Astro check supports TS 7. Peer warnings about `typescript@^5`
  are cosmetic. Oxlint type-aware rules use `oxlint-tsgolint`, which bundles
  TypeScript 7 separately — do not upgrade the `typescript` package for that.
- Stay on `@astrojs/compiler-rs` 0.3.2. Astro 7.2.4 still depends on `^0.3.2`;
  forcing 0.4.0 via a pnpm override broke Workers Builds.
- Keep the `@cloudflare/vite-plugin` override at `^1.53.1` so `astro dev` and
  `wrangler preview` share Wrangler 4.125's Miniflare 5 / workerd runtime.
  `@astrojs/cloudflare` 14.2.3 otherwise resolves vite-plugin 1.47 (Miniflare 4).

## Astro-specific

- **Content config**: lives at `src/content.config.ts` (NOT `src/content/config.ts` —
  that was the Astro v4 location). All collections must use loaders (e.g. `glob()`).
- **`z` (Zod)**: import from `astro/zod`, not from `astro:content`.
- **Rust compiler**: default in Astro 7 — do not set `experimental.rustCompiler`.
- **Markdown/MDX**: Astro 7's default Sätteri processor (`markdown.processor: satteri()`).
  Heading permalinks are a Sätteri hast plugin (`src/lib/satteri-autolink.ts`) after
  `satteriHeadingIdsPlugin()`. Do not re-add `@astrojs/markdown-remark` / remark /
  rehype plugins unless a plugin has no Sätteri equivalent. Code fences use Astro's
  built-in Shiki (`markdown.shikiConfig`). Plugins on `mdx({ remarkPlugins })` are
  deprecated.
- **Sessions**: `session: false`. This site does not use `Astro.session`. Leave it
  off so the Cloudflare adapter does not wire the `SESSION` KV binding as a driver.
- **`compressHTML`**: Astro 7 defaults to `'jsx'` whitespace rules; this project sets
  `compressHTML: true` to keep previous HTML-aware spacing.
- **Advanced Routing (`src/fetch.ts`)**: do not add. Accept negotiation and SEO
  headers stay in `src/worker.ts` via `@astrojs/cloudflare/handler`, which also
  handles the prerender protocol that `cf()` + `astro()` does not.
- **Incremental static builds**: do not enable `experimental.incrementalBuild`.
  Post pages also render related posts / series neighbors, so `cacheKey: entry.digest`
  would serve stale sidebars.

## Cloudflare adapter (v14)

These APIs were **removed** in `@astrojs/cloudflare` v13+ / Astro 6+. Do not use them:

| Old (v4/v5)                   | New (v13+ / Astro 6+)                      |
| ----------------------------- | ------------------------------------------ |
| `Astro.locals.runtime.env`    | `import { env } from "cloudflare:workers"` |
| `Astro.locals.runtime.cf`     | `Astro.request.cf`                         |
| `Astro.locals.runtime.caches` | global `caches`                            |
| `Astro.locals.runtime.ctx`    | `Astro.locals.cfContext`                   |

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
`src/layouts/Layout.astro`. `display: 'optional'` is set in the font config to prevent
layout shift on reload — do not change this to `'swap'`.

Do **not** use `fontProviders.fontsource()` — it requires outbound HTTPS to
`api.fontsource.org` which may be blocked in restricted build environments.

## Removed dependencies (do not re-add)

| Package                       | Replaced by                                                             |
| ----------------------------- | ----------------------------------------------------------------------- |
| `@fontsource-variable/mulish` | Astro fonts API + local WOFF2                                           |
| `astro-seo`                   | Inline meta tags in `Layout.astro`                                      |
| `date-fns`                    | Native `Date.getTime()` / `toISOString().split('T')[0]`                 |
| `reading-time`                | Inline word-count: `Math.max(1, Math.round(words / 200)) + " min read"` |
| `open`                        | Was unused                                                              |
| `rehype-pretty-code`          | Astro built-in Shiki + `@shikijs/transformers`                          |
| `@biomejs/biome`              | Oxlint + Oxfmt                                                          |
| `@astrojs/markdown-remark`    | Sätteri (`@astrojs/markdown-satteri`)                                   |
| `rehype-slug`                 | `satteriHeadingIdsPlugin()`                                             |
| `rehype-autolink-headings`    | `src/lib/satteri-autolink.ts`                                           |
| `remark-gfm`                  | Sätteri built-in GFM                                                    |
