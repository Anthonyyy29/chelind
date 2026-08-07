# Deploy Chelind ke VPS

Panduan ini asumsinya VPS Ubuntu fresh install dan kamu punya akses `root`
(atau `sudo`) lewat SSH. Ikuti urut dari atas — sekali jalan (langkah 1-4)
dieksekusi manual di server, setelah itu deploy berikutnya otomatis lewat
GitHub Actions (lihat bagian paling bawah).

Catatan: setup ini cuma butuh **1 DNS A record biasa** yang ngarah ke IP
VPS — tidak perlu kontrol nameserver domain (cocok kalau kamu cuma punya
akses "kelola DNS" tapi bukan pemilik akun registrar).

## 1. Bootstrap server

Install Docker Engine dari repo resmi Docker (bukan paket `docker.io` bawaan
Ubuntu, yang biasa ketinggalan versi):

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Bikin user non-root buat deploy (jangan pakai `root` buat operasional
sehari-hari), masukkan ke grup `docker` biar bisa jalanin `docker compose`
tanpa `sudo`:

```bash
sudo adduser deploy
sudo usermod -aG docker deploy
su - deploy
```

## 2. Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Port `81` (admin UI Nginx Proxy Manager) **sengaja tidak dibuka** — di
`docker-compose.prod.yml` port itu sudah di-bind ke `127.0.0.1` saja, jadi
otomatis tidak bisa diakses dari luar server, dengan atau tanpa firewall.

## 3. Clone repo & siapkan `.env`

```bash
git clone <url-repo-kamu> /home/deploy/chelind
cd /home/deploy/chelind
cp .env.example .env
```

Edit `.env`, minimal ubah/isi ini (yang lain boleh ikut default
`.env.example`):

| Variabel | Nilai untuk production |
|---|---|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://domainkamu.com` |
| `APP_KEY` | generate: `docker run --rm -v $PWD:/app -w /app php:8.5-cli php artisan key:generate --show`, tempel hasilnya |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `mysql` (nama service di compose, bukan IP) |
| `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | isi bebas, dipakai juga oleh service `mysql` di compose |
| `FOOTBALL_DATA_API_KEY` | API key kamu dari football-data.org, wajib buat scheduler `matches:sync` |

`.env` ini cuma hidup di server, **jangan pernah** di-commit ke git.

## 4. Nyalakan semua service

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

Semua service (`app`, `scheduler`, `nginx`, `npm`, `mysql`) harus `running`.
Cek migrasi jalan lancar:

```bash
docker compose -f docker-compose.prod.yml logs app
```

## 5. Arahkan DNS

Di panel DNS domain kamu (Hostinger "Kelola DNS" atau setara), buat/edit
**A record**:

- Name: `@` (domain utama) — tambah juga `www` kalau perlu
- Content: IP VPS kamu
- TTL: default/otomatis

Tunggu sampai propagasi selesai (cek: `dig domainkamu.com` dari mesin lain,
harus balas IP VPS) sebelum lanjut ke langkah 6 — Let's Encrypt gagal minta
sertifikat kalau domain belum benar-benar menunjuk ke server ini.

## 6. Setup Nginx Proxy Manager (SSL + domain)

Buka SSH tunnel dari komputer lokalmu ke port admin NPM (port itu tidak
publik, jadi ini satu-satunya cara akses):

```bash
ssh -L 8181:localhost:81 deploy@ip-vps-kamu
```

Biarkan terminal itu terbuka, lalu buka `http://localhost:8181` di browser.

1. Login pertama kali pakai kredensial default image:
   `admin@example.com` / `changeme`.
2. **Langsung ganti email + password** — ini kredensial publik yang semua
   orang tahu, target serangan umum kalau sampai bocor kebuka ke internet.
3. Menu **Proxy Hosts** → **Add Proxy Host**:
   - Domain Names: `domainkamu.com`
   - Scheme: `http`
   - Forward Hostname/IP: `nginx` (nama service internal di compose)
   - Forward Port: `80`
4. Tab **SSL**: pilih "Request a new SSL Certificate", centang
   "Force SSL", isi email, agree ToS, Save.

Setelah ini domain kamu sudah HTTPS dan proxy ke app Laravel di dalam
Docker. Tutup SSH tunnel-nya kalau sudah selesai (`Ctrl+C` di terminal
tunnel-nya) — tidak perlu terus terbuka.

## 7. Deploy otomatis (GitHub Actions)

Setelah langkah 1-6 di atas selesai sekali, deploy berikutnya otomatis lewat
`.github/workflows/deploy.yml` tiap push ke `main` (setelah test lulus).
Supaya itu bisa SSH ke server ini, tambahkan 3 secret di
**GitHub repo → Settings → Secrets and variables → Actions**:

| Secret | Isi |
|---|---|
| `VPS_HOST` | IP atau hostname VPS |
| `VPS_DEPLOY_USER` | `deploy` |
| `VPS_SSH_PRIVATE_KEY` | private key SSH yang public key-nya sudah ada di `~deploy/.ssh/authorized_keys` di server — buat key baru khusus deploy, jangan pakai key pribadimu |

## Maintenance sehari-hari

```bash
cd /home/deploy/chelind

docker compose -f docker-compose.prod.yml ps              # status semua service
docker compose -f docker-compose.prod.yml logs -f app      # log app
docker compose -f docker-compose.prod.yml logs -f scheduler # log sync jadwal
docker compose -f docker-compose.prod.yml restart app      # restart satu service
docker compose -f docker-compose.prod.yml down             # matikan semua (data di volume tetap aman)
```

Ganti versi PHP/dependency: edit `docker/php/Dockerfile` atau
`composer.json`/`package.json`, commit, push ke `main` — GitHub Actions yang
build ulang image di server otomatis.
