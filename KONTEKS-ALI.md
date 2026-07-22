# Konteks untuk AI Assistant-nya Ali (Frontend — Chelind Football)

File ini buat di-baca AI apa pun yang dipakai Ali (Claude Code, Cursor, dll) supaya
langsung paham status project dan bisa lanjut kerja tanpa nanya ulang dari nol.
Kalau butuh detail lebih dalam, baca 3 file referensi di folder yang sama:

| File | Isinya |
|---|---|
| `plan.md` | Rencana project, milestone, pembagian tugas (Ezra=backend, Ali=frontend, Reifan=desain), deadline |
| `petunjuk1.md` | ERD final 7 tabel + **log semua keputusan teknis** (kenapa fitur X dipilih/dicoret) |
| `chelind/API.md` | **Kontrak API lengkap** — semua endpoint, request/response, auth flow. Ini yang paling sering dipakai Ali sehari-hari |

---

## 1. Project ini apa

Chelind Football — fanpage sepak bola (mock Chelsea FC). 6 halaman publik + panel
admin. Deadline rilis minimum (**M1**): **25 Juli 2026**.

## 2. Arsitektur yang WAJIB diikuti

- **Backend** (`chelind/` — Laravel 13) = REST API JSON murni di `/api/...`. **Bukan Inertia.**
  Starter kit Inertia+Fortify bawaan sudah **dicopot total** — jangan bikin ulang
  pola itu, jangan cari `resources/js` di dalam folder Laravel, sudah tidak ada.
- **Frontend** = React (Vite) + Tailwind, SPA berdiri sendiri, fetch ke API pakai
  path relatif (`/api/...`). **Belum dibuat sama sekali** — ini kerjaan Ali dari nol.
- **Same-origin, tanpa CORS.** Dev: Vite proxy ke backend. Prod: build React
  disajikan lewat `public/` Laravel atau reverse proxy satu domain.
- **Auth admin = session cookie native Laravel** (bukan Sanctum, bukan token/JWT).
  Alasan lengkap ada di `petunjuk1.md` §7. Konsekuensinya buat FE: **wajib pakai
  axios** (bukan fetch mentah) biar CSRF cookie ke-handle otomatis — detail di
  `API.md` §1.

## 3. Status backend saat ini (yang sudah bisa dipakai Ali)

Endpoint yang **sudah jadi & ke-test** (lihat `API.md` untuk kontrak lengkap):

- Auth: `GET /api/csrf-cookie`, `POST /api/login`, `POST /api/logout`, `GET /api/me`
- Publik: `GET /api/categories`, `GET /api/articles` (+detail slug), `GET /api/social-links`, `GET /api/matches`
- Admin (butuh login): CRUD penuh `/api/admin/categories`, `/api/admin/articles`

Yang **belum ada** (jangan diasumsikan sudah bisa dipakai):
- CRUD Pemain & Social Link buat admin (baru ada endpoint publik `GET /api/social-links`; Pemain malah belum ada endpoint sama sekali)
- Sync otomatis jadwal dari football-data.org (tabel `matches` sudah ada strukturnya, tapi masih kosong sampai cron-nya jalan)
- Route fallback SPA di Laravel (`public/` belum disiapkan buat serve build React)

## 4. Cara jalanin backend di lokal

Backend jalan via **Laravel Sail** (Docker), bukan `php artisan serve`:

```bash
cd chelind
./vendor/bin/sail up -d      # kalau container belum jalan
```

- Base URL: **`http://localhost`** (port 80 — **bukan** `:8000` meski `plan.md`
  nyebut `:8000`, itu sudah tidak akurat, sudah dibenerin di `.env`).
- Cek hidup: `curl http://localhost/api/ping` → `{"pong":true}`
- Storage buat gambar sudah di-link (`php artisan storage:link` sudah dijalankan).

## 5. Setup React yang perlu Ali bikin (sesuai `plan.md` task #10–14)

1. Init project Vite + React + TypeScript + Tailwind (folder terpisah, bukan di
   dalam `chelind/`, kecuali disepakati lain).
2. `vite.config.ts` → `server.proxy` arahkan `/api` ke `http://localhost` (lihat §4).
3. Setup axios global:
   ```js
   axios.defaults.withCredentials = true;
   axios.defaults.withXSRFToken = true; // axios v1.1+
   ```
4. React Router buat 6 halaman publik + `/admin/*` (daftar halaman lengkap ada
   di `petunjuk1.md` §4b).
5. Alur login admin: panggil `GET /api/csrf-cookie` sekali di awal → form login
   POST `/api/login` → simpan status login di context/store dari respons
   `GET /api/me` (bukan simpan token manual, cukup andalkan cookie).
6. Render `article.body` (HTML dari server) **wajib** dibungkus **DOMPurify**
   di sisi client juga — server sudah sanitasi saat simpan, tapi ini lapisan
   kedua sesuai mitigasi XSS di `plan.md` §6 (defense in depth).
7. Upload cover image artikel → kirim `multipart/form-data`; untuk update
   (`PUT`) yang bawa file, pakai trik Laravel: POST + field `_method=PUT`.

## 6. Prioritas M1 (yang harus jalan sebelum 25 Juli)

Cukup 3 halaman publik dulu: **Homepage, News listing, Detail Artikel** — plus
**login admin + dashboard/editor artikel polos** (fungsional dulu, belum perlu
cantik). Matchday, Transfer News, Join Community, dan kelola pemain/social
link/akun itu **M2**, menyusul setelah rilis minimum.
