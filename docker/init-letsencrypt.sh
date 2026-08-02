#!/usr/bin/env bash
# Jalankan SEKALI SAJA di server, sebelum pertama kali `docker compose up -d`
# secara penuh. Ini nyelesain masalah "ayam-telur" SSL: Nginx butuh
# sertifikat buat start, tapi certbot butuh Nginx nyala (port 80) buat
# minta sertifikat. Caranya: bikin sertifikat palsu dulu supaya Nginx bisa
# start, lalu certbot minta sertifikat asli, lalu Nginx di-reload.
#
# Pakai: DOMAIN=domainmu.com EMAIL=kamu@email.com ./docker/init-letsencrypt.sh
set -e

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Wajib set DOMAIN dan EMAIL. Contoh:"
    echo "  DOMAIN=domainmu.com EMAIL=kamu@email.com ./docker/init-letsencrypt.sh"
    exit 1
fi

# Path host (buat mkdir sebelum di-mount) vs path di dalam container
# certbot (sesuai mount "./docker/certbot/conf:/etc/letsencrypt" di
# docker-compose.prod.yml) — dua-duanya beda, jangan disamain.
HOST_DUMMY_PATH="./docker/certbot/conf/live/$DOMAIN"
CONTAINER_DUMMY_PATH="/etc/letsencrypt/live/$DOMAIN"

echo "### Membuat sertifikat dummy untuk $DOMAIN ..."
mkdir -p "$HOST_DUMMY_PATH"
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout '$CONTAINER_DUMMY_PATH/privkey.pem' \
        -out '$CONTAINER_DUMMY_PATH/fullchain.pem' \
        -subj '/CN=localhost'" certbot

echo "### Menyalakan Nginx ..."
docker compose -f docker-compose.prod.yml up -d nginx

echo "### Menghapus sertifikat dummy ..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
    rm -rf /etc/letsencrypt/live/$DOMAIN \
    /etc/letsencrypt/archive/$DOMAIN \
    /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

echo "### Meminta sertifikat asli dari Let's Encrypt ..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
        -d $DOMAIN \
        --email $EMAIL \
        --rsa-key-size 4096 \
        --agree-tos \
        --non-interactive" certbot

echo "### Reload Nginx ..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "Selesai. SSL untuk $DOMAIN sudah aktif."
