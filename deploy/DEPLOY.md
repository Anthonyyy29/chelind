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
Secret sudah disetup (2026-08-08) — commit ini dipakai buat verifikasi
alurnya: push ke `main` -> `tests` lulus -> `deploy` otomatis SSH ke VPS
dan `docker compose up -d --build`.
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

## Alur branch

Kerja & commit sehari-hari di branch `ezra`. Push ke `ezra` **tidak**
memicu apa pun di production — cuma push/merge ke `main` yang menjalankan
`tests.yml` lalu (kalau lulus) `deploy.yml`. Jadi alurnya: commit di
`ezra` → `git push origin ezra` → `git checkout main && git merge ezra
--no-edit && git push origin main` → balik lagi ke `ezra`.

## Troubleshooting (insiden yang pernah kejadian)

Beberapa masalah yang pernah muncul di production dan cara fixnya —
berguna kalau gejala yang sama muncul lagi:

- **php-fpm dengar di unix socket, bukan TCP 9000.** Default paket
  `php-fpm` versi Ubuntu/ondrej begitu, jadi container `nginx` gagal
  connect ke `app`. Fix: paksa listen TCP lewat `sed` di
  `docker/php/Dockerfile`.
- **Mixed-content error di HTTPS** (asset/link ke-generate `http://`
  padahal situs sudah `https://`). Penyebab: NPM men-terminate SSL lalu
  forward ke `nginx` internal pakai HTTP polos, jadi Laravel nggak tahu
  request aslinya HTTPS. Fix: `fastcgi_param HTTPS on;` di config nginx
  internal (aman karena container itu cuma bisa diakses lewat NPM, tidak
  publik langsung).
- **CI (`tests.yml`) sempat silently broken cukup lama** karena step
  `tsc --noEmit` gagal — project sudah full migrasi dari `.tsx`/Wayfinder
  ke `.jsx` polos, jadi nggak ada file yang match dan check-nya selalu
  merah. Karena waktu itu masih sering deploy manual lewat SSH, ini nggak
  ketahuan sampai lama — akibatnya *setiap* auto-deploy via GitHub Actions
  ikut ke-block diam-diam. Sudah dihapus dari CI.
- **`storage/app/public/covers` (atau folder upload lain) ke-buat dengan
  owner `root:root`** kalau kamu jalanin `artisan`/`db:seed` via
  `docker compose exec app ...` tanpa flag user — defaultnya root. Karena
  PHP-FPM jalan sebagai `www-data`, upload jadi silently gagal (response
  `200 OK` tapi file nggak pernah ke-save). **Selalu tambahkan
  `-u www-data`** di `docker compose exec`, atau `chown -R
  www-data:www-data storage/app/public` setelahnya kalau lupa.
- **Upload foto gagal karena `upload_max_filesize`/`post_max_size`
  default PHP kekecilan** (2M/8M). Dinaikkan lewat `docker/php/uploads.ini`.
- **Ganti favicon/asset statis nggak langsung kelihatan** di banyak
  browser/incognito sekalipun. Fix: tambahkan cache-busting `?v=N` di
  `href` tag icon (`resources/views/app.blade.php`), naikkan angka `N`
  tiap kali ganti favicon lagi.
