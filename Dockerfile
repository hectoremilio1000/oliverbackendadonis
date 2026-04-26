# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN node ace build

# ---- Runner ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/build ./
RUN npm ci --omit=dev --no-audit --no-fund
EXPOSE 3333
# Migrations corren al iniciar (idempotente). Después arranca el servidor.
CMD ["sh", "-c", "node ace migration:run --force && node ace db:seed --force && node bin/server.js"]
