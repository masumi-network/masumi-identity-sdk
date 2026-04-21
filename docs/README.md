# Masumi Identity SDK — Docs site

Public documentation for `@masumi_network/identity-sdk`, built with
[Fumadocs](https://fumadocs.dev) (Next.js 16 + MDX + Tailwind v4) and deployed
to [Vercel](https://vercel.com).

**Live:** https://masumi-identity-sdk.vercel.app

---

## Local dev

```bash
cd docs
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run types:check
```

Content lives in [`content/docs`](./content/docs). Fumadocs picks it up through
[`source.config.ts`](./source.config.ts) and the `fumadocs-mdx` loader.

## Layout

Notebook layout (à la [docs.masumi.network](https://docs.masumi.network)) — docs
mounted at the root with three top-nav tabs.

```
docs/
├── app/
│   ├── (home)/
│   │   ├── layout.tsx       fumadocs-ui notebook layout, top nav, tab mode
│   │   └── [[...slug]]/     dynamic docs route (root path → /get-started)
│   ├── api/search/          Orama search endpoint
│   ├── og/[...slug]/        dynamic OG image generation
│   └── llms*.txt|mdx/       LLM-friendly content routes
├── components/
│   ├── mdx.tsx              MDX provider (Tabs, Steps, Callout, …)
│   ├── param-field.tsx      <ParamField> for SDK method params
│   └── check.tsx            <Check> for requirement / verified lists
├── content/docs/            three "tab" folders, each with root: true
│   ├── meta.json            tabs registry
│   ├── get-started/         intro · quickstart · concepts · troubleshooting
│   ├── guides/              tutorials + examples
│   └── api-reference/       per-module API docs
├── lib/
│   ├── source.ts            content loader (baseUrl: '/')
│   ├── shared.ts            site-wide constants
│   └── layout.shared.tsx    shared nav + brand mark
├── scripts/
│   ├── convert-docusaurus.mjs  one-shot Docusaurus → Fumadocs MDX converter
│   └── rewrite-links.mjs       one-shot internal link rewriter (notebook layout)
├── public/brand/            Masumi logo assets
├── app/global.css           Tailwind v4 + Masumi brand tokens
└── source.config.ts         fumadocs-mdx configuration
```

### Adding a new top-level tab

1. Create a folder under `content/docs/` with `meta.json` (`{ "root": true, "title": "...", "icon": "...", "pages": [...] }`).
2. Add the folder name to the root `content/docs/meta.json` `pages` array.

That's it — the tab shows up in the navbar automatically.

## Deployment (Vercel)

The Vercel project's **Root Directory** is set to `docs/`. Build/install
commands are declared in [`vercel.json`](./vercel.json):

- Install: `npm install`
- Build: `npm run build`

Every push to `main` auto-deploys to production; every PR gets a preview URL.
The [`.github/workflows/docs.yml`](../.github/workflows/docs.yml) workflow runs
a parallel build on PRs so regressions fail CI independently of Vercel.

## Branding

Brand tokens are defined in [`app/global.css`](./app/global.css) and mirror
`masumi-saas/apps/web/src/app/globals.css`. Logo assets come from
[`masumi-saas/apps/web/public/assets`](../../masumi-saas/apps/web/public/assets).

- Primary (light): `--masumi-electric-pink` (`#fa008c`) — WCAG AA on white
- Primary (dark): `--masumi-iris-flower` (`#ff51ff`) — pops on `#0a0a0a`
- Navbar accent: `--masumi-crimson-purple` (`#460a23`) gradient
