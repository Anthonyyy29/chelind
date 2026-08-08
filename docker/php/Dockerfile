# syntax=docker/dockerfile:1

# --- Stage 1: build frontend assets (React/Vite) ---
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: install PHP dependencies ---
FROM composer:2 AS vendor
WORKDIR /app
COPY database/ database/
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader --ignore-platform-reqs

# --- Stage 3: runtime image ---
FROM ubuntu:24.04 AS runtime

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=UTC

RUN apt-get update && apt-get install -y --no-install-recommends \
        gnupg curl ca-certificates \
    && curl -sS 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xb8dc7e53946656efbce4c1dd71daeaab4ad4cab6' \
        | gpg --dearmor | tee /etc/apt/keyrings/ppa_ondrej_php.gpg > /dev/null \
    && mkdir -p /etc/apt/keyrings \
    && echo "deb [signed-by=/etc/apt/keyrings/ppa_ondrej_php.gpg] https://ppa.launchpadcontent.net/ondrej/php/ubuntu noble main" \
        > /etc/apt/sources.list.d/ppa_ondrej_php.list \
    && apt-get update && apt-get install -y --no-install-recommends \
        php8.5-fpm \
        php8.5-cli \
        php8.5-mysql \
        php8.5-mbstring \
        php8.5-xml \
        php8.5-zip \
        php8.5-bcmath \
        php8.5-curl \
        php8.5-gd \
        php8.5-intl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Paket php8.5-fpm Ubuntu/ondrej default-nya listen ke unix socket
# (/run/php/php8.5-fpm.sock), tapi nginx (container terpisah) proxy ke
# app:9000 lewat TCP — override supaya php-fpm listen di TCP 9000.
RUN sed -i 's|^listen = .*|listen = 9000|' /etc/php/8.5/fpm/pool.d/www.conf

WORKDIR /var/www/html

COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Snapshot bersih dari public/ (index.php + hasil build Vite) disimpan di
# luar /var/www/html/public, karena path itu nanti "ditutupi" volume Docker
# yang dipakai bareng-bareng sama container Nginx. entrypoint.sh nyalin
# dari sini ke volume itu tiap container start, supaya asset selalu fresh
# setiap kali deploy ulang (bukan cuma sekali pas volume pertama dibuat).
RUN cp -a public /var/www/html-public-src

COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm8.5", "-F"]
