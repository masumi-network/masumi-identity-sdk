# Mirrors masumi-network/masumi-docs Dockerfile so ops knowledge transfers 1:1.
# Multi-stage Node 20 Alpine build → Next.js `output: 'standalone'` runtime.

FROM node:20-alpine AS base

# --- deps layer: only package + config files, so it caches on lockfile hits ---
# We pass --ignore-scripts because the postinstall runs `fumadocs-mdx` which
# needs the `content/` directory. That directory only lives in the builder
# stage, so we rerun fumadocs-mdx there.
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY source.config.ts tsconfig.json ./
RUN npm ci --ignore-scripts

# --- builder layer: full source + production build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Now that content/ exists, generate the fumadocs-mdx manifest + build Next.
RUN npx fumadocs-mdx
RUN npm run build

# --- runner layer: minimal, non-root, standalone server ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
