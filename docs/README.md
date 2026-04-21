# Masumi Identity SDK — Docs site

Public documentation for `@masumi_network/identity-sdk`, built with
[Fumadocs](https://fumadocs.dev) (Next.js 16 + MDX + Tailwind v4) and deployed
to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
via a Docker container image (mirrors the
[`masumi-docs`](https://github.com/masumi-network/masumi-docs) deploy pipeline
so ops knowledge transfers 1:1).

**Live:** https://sdk-docs.masumi.network

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
├── Dockerfile               multi-stage node:20-alpine image for DO App Platform
├── .dockerignore
└── source.config.ts         fumadocs-mdx configuration
```

### Adding a new top-level tab

1. Create a folder under `content/docs/` with `meta.json` (`{ "root": true, "title": "...", "icon": "...", "pages": [...] }`).
2. Add the folder name to the root `content/docs/meta.json` `pages` array.

That's it — the tab shows up in the navbar automatically.

## Deployment (DigitalOcean App Platform)

Same pattern as [`masumi-docs`](https://github.com/masumi-network/masumi-docs):

1. GitHub Actions builds the Next.js app and a Docker image from
   [`Dockerfile`](./Dockerfile) (multi-stage, `output: 'standalone'`, non-root
   `nextjs:nodejs` user).
2. The image is pushed to the Masumi DigitalOcean Container Registry under
   `registry.digitalocean.com/<DO_REGISTRY_NAME>/masumi-identity-sdk-docs`.
3. DigitalOcean App Platform watches the registry and auto-redeploys the
   `:latest` tag.

Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

### One-time setup (repo secrets)

Required secrets on the `masumi-network/masumi-identity-sdk` repo:

| Secret | Purpose |
|---|---|
| `DIGITALOCEAN_ACCESS_TOKEN` | DO API token with registry-write access |
| `DO_REGISTRY_NAME` | DO Container Registry name (e.g. `masumi-network`) |
| `DO_APP_ID_PROD` | App Platform app ID for the prod docs app |
| `DO_APP_ID_TEST` | App Platform app ID for the staging docs app (optional) |

### One-time setup (DigitalOcean)

1. Create a DO Container Registry (if the Masumi team doesn't already have one).
2. Create two App Platform apps (prod + staging), each configured as:
   - **Source:** DO Container Registry
   - **Image:** `<registry>/masumi-identity-sdk-docs:latest` (prod) or
     `masumi-identity-sdk-docs-staging:latest` (staging)
   - **Auto-deploy:** enabled
   - **HTTP port:** 3000
3. Point `sdk-docs.masumi.network` (or whichever domain you pick) at the
   prod App Platform app via DNS + DO's domain UI.
4. Update `lib/shared.ts::appUrl`, `packages/sdk/package.json::homepage`,
   and the root `README.md` to match the final domain.

### Build locally via Docker

```bash
cd docs
docker build -t masumi-identity-sdk-docs .
docker run --rm -p 3000:3000 masumi-identity-sdk-docs
# open http://localhost:3000
```

### PR builds

[`.github/workflows/docs.yml`](../.github/workflows/docs.yml) runs a
Node-only build on every PR (no Docker, no registry push) so regressions
fail CI fast before the deploy pipeline ever runs.

## Branding

Brand tokens are defined in [`app/global.css`](./app/global.css) and mirror
`masumi-saas/apps/web/src/app/globals.css`. Logo assets come from
[`masumi-saas/apps/web/public/assets`](../../masumi-saas/apps/web/public/assets).

- Primary (light): `--masumi-electric-pink` (`#fa008c`) — WCAG AA on white
- Primary (dark): `--masumi-iris-flower` (`#ff51ff`) — pops on `#0a0a0a`
- Navbar accent: `--masumi-crimson-purple` (`#460a23`) gradient
