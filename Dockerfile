# syntax=docker/dockerfile:1

# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies based on the lockfile for reproducible builds.
COPY package.json package-lock.json* ./
RUN npm ci

# Build the Next.js app (produces .next/standalone).
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Cloud Run sends traffic to $PORT (defaults to 8080).
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Security: run as an unprivileged user instead of root.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy only the standalone output — keeps the final image small.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080

CMD ["node", "server.js"]
