# syntax=docker/dockerfile:1

# ── Stage 1: Dependencies ────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
# libc6-compat für evtl. glibc-gelinkte Prebuilts (u.a. sharp)
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build ───────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# WICHTIG: NEXT_PUBLIC_* werden zur BUILD-Zeit ins Client-Bundle inlined.
# Müssen deshalb als BUILD-ARGS reingegeben werden (in Sliplane als Build-Args
# setzen), NICHT nur als Runtime-Env — sonst fehlen Stripe.js-Key + Turnstile
# im Browser und Bezahlen/Captcha sind kaputt. (Beide Werte sind öffentlich.)
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: Runtime (standalone) ────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# Non-root — die Website schreibt NICHTS zur Laufzeit, also kein Volume/EACCES-Problem.
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Next standalone-Output: server.js + minimales node_modules. static/ und public/
# sind NICHT im standalone enthalten → separat kopieren.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
