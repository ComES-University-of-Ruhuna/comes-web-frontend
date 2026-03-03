# ─────────────────────────────────────────────
# Stage 1 — Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install build tools needed by some native addons
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy lockfile + manifest first for layer-caching
COPY package.json yarn.lock ./

# Install all deps (including devDeps needed for tsc + vite build)
RUN yarn install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Vite requires VITE_* env vars at build time.
# Pass them in as --build-arg when building the image, e.g.:
#   docker build --build-arg VITE_API_URL=https://api.example.com .
ARG VITE_API_URL
ARG VITE_APP_ENV=production

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# Type-check + bundle
RUN yarn build

# ─────────────────────────────────────────────
# Stage 2 — Serve with Nginx
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our SPA-aware Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite's output from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Dokploy / most reverse proxies expect the container to listen on 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
