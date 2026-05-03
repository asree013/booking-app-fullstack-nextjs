# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# ก๊อปปี้ไฟล์จัดการ package (ใช้ npm เป็นหลัก)
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Rebuild the source code
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client เพื่อให้โค้ดเรียกใช้ DB ได้
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

# Build แอป Next.js
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 1. ก๊อปปี้ standalone มาก่อน (มันจะมาพร้อมโครงสร้าง .next บางส่วน)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# 2. จัดการเรื่องสิทธิ์ (สร้าง uploads และแก้สิทธิ์)
RUN mkdir -p public/uploads && chown -R nextjs:nodejs public/uploads
RUN mkdir -p .next && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma db push && node server.js"]