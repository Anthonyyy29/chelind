#!/usr/bin/env bash
set -e

# Tunggu MySQL siap sebelum migrate (compose "depends_on" cuma nunggu
# container-nya start, bukan MySQL-nya siap nerima koneksi).
until php -r "new PDO('mysql:host=$DB_HOST;port=$DB_PORT', '$DB_USERNAME', '$DB_PASSWORD');"; do
    echo "Menunggu database..."
    sleep 2
done

# Refresh isi public/ di shared volume dari snapshot image ini — supaya
# Nginx (container terpisah) selalu lihat hasil build Vite yang terbaru
# setiap kali deploy ulang, bukan cuma pas volume pertama kali dibuat.
rm -rf /var/www/html/public/*
cp -a /var/www/html-public-src/. /var/www/html/public/

php artisan storage:link || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
