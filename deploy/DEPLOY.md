# Deploy Chelind ke VPS

Panduan ini asumsinya VPS Ubuntu fresh install dan kamu punya akses `root`
(atau `sudo`) lewat SSH. Ikuti urut dari atas — sekali jalan dieksekusi
manual (di server maupun dashboard Cloudflare), setelah itu deploy
berikutnya otomatis lewat GitHub Actions (lihat bagian paling bawah).

## 1. Tambahkan domain ke Cloudflare

Lakukan ini paling awal karena ganti nameserver bisa butuh waktu propagasi
sampai beberapa jam:

1. Bikin akun Cloudflare (gratis) kalau belum punya.
2. **Add a Site** → masukkan domainmu → pilih plan **Free**.
3. Cloudflare kasih 2 nameserver baru — ganti nameserver domainmu di
   pengelola domain (tempat kamu beli domain) ke 2 nameserver itu.
4. Tunggu sampai status di dashboard Cloudflare berubah jadi "Active"
   sebelum lanjut ke langkah berikutnya.

## 2. Bootstrap server

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

## 3. Firewall

```bash
sudo ufw allow 22
sudo ufw enable
```

Cukup port `22` (SSH) — web traffic **tidak lewat port yang dibuka di VPS
sama sekali**. Cloudflare Tunnel (`cloudflared`, disiapkan di langkah 4)
bikin koneksi KELUAR dari VPS ke Cloudflare, jadi nggak ada yang perlu
nunggu koneksi masuk dari internet buat port 80/443.

## 4. Buat Cloudflare Tunnel

Di dashboard Cloudflare (domain yang sama dari langkah 1) → **Zero Trust**
→ **Networks** → **Tunnels** → **Create a tunnel** → pilih **Cloudflared**
→ kasih nama (misal `chelind-vps`) → **Save tunnel**.

Di halaman berikutnya ("Install and run a connector"), abaikan command
install-nya (kita jalanin lewat Docker Compose, bukan install langsung di
OS) — yang penting cuma **salin Tunnel Token** yang ditampilkan (string
panjang setelah `--token`). Simpan dulu, dipakai di langkah 5.

Jangan klik "Next" dulu sebelum tunnel-nya benar-benar nyala (lanjut ke
langkah 6) — "Public Hostname" diisi belakangan di langkah 7.

## 5. Clone repo & siapkan `.env`

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
| `CLOUDFLARE_TUNNEL_TOKEN` | token dari langkah 4 di atas |

`.env` ini cuma hidup di server, **jangan pernah** di-commit ke git.

## 6. Nyalakan semua service

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

Semua service (`app`, `scheduler`, `nginx`, `cloudflared`, `mysql`) harus
`running`. Cek migrasi jalan lancar:

```bash
docker compose -f docker-compose.prod.yml logs app
```

Cek tunnel berhasil konek ke Cloudflare:

```bash
docker compose -f docker-compose.prod.yml logs cloudflared
```

Harus ada baris semacam `Registered tunnel connection`. Kalau `cloudflared`
malah restart terus-menerus, biasanya `CLOUDFLARE_TUNNEL_TOKEN` di `.env`
salah/kepotong — cek lagi hasil copy dari langkah 4.

## 7. Arahkan domain ke tunnel (Public Hostname)

Balik ke dashboard Cloudflare → Zero Trust → Networks → Tunnels → klik
tunnel yang tadi dibuat (`chelind-vps`) → tab **Public Hostname** →
**Add a public hostname**:

- Subdomain + Domain: `domainkamu.com` (atau `www` kalau mau subdomain)
- Type: `HTTP`
- URL: `nginx:80` (nama service internal di compose, sama persis)

Save. Cloudflare otomatis bikin DNS record dan sertifikat SSL publiknya —
nggak perlu setting DNS manual maupun tunggu Let's Encrypt.

Tes: buka `https://domainkamu.com` di browser, harus langsung nyambung ke
app Laravel-nya dengan gembok HTTPS valid.

## 8. Deploy otomatis (GitHub Actions)

Setelah langkah 1-7 di atas selesai sekali, deploy berikutnya otomatis lewat
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
