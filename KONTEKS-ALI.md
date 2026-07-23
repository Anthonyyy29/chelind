# Konteks untuk AI Assistant-nya Ali (Frontend — Chelind Football)

File ini buat di-baca AI apa pun yang dipakai Ali (Claude Code, Cursor, dll) supaya
langsung paham status project dan bisa lanjut kerja tanpa nanya ulang dari nol.
Kalau butuh detail lebih dalam, baca 3 file referensi:

| File | Isinya |
|---|---|
| `../plan.md` | Rencana project, milestone, pembagian tugas (Ezra=backend, Ali=frontend, Reifan=desain), deadline |
| `../petunjuk1.md` | ERD final 7 tabel + **log semua keputusan teknis** (kenapa fitur X dipilih/dicoret) |
| `API.md` | **Kontrak API lengkap** — semua endpoint, request/response, auth flow. Ini yang paling sering dipakai Ali sehari-hari |

---

## 1. Project ini apa

Chelind Football — fanpage sepak bola (mock Chelsea FC). 6 halaman publik + panel
admin. Deadline rilis minimum (**M1**): **25 Juli 2026**.

## 2. Arsitektur yang WAJIB diikuti

- **Satu repo** — backend (Laravel API) dan frontend (React) hidup di repo yang
  sama ini. Ali kerja **di dalam `resources/js/` dan `resources/css/`**, **bukan**
  bikin project/repo terpisah.
- **Backend** = REST API JSON murni di `/api/...`. **Bukan Inertia.** Starter kit
  Inertia+Fortify bawaan sudah dicopot total (lihat `../petunjuk1.md` §7) — yang
  dipakai cuma paket Vite/Tailwind/Wayfinder-nya, bukan pola render Inertia-nya.
- **Frontend** = React SPA **React Router polos** (bukan Inertia) yang fetch ke
  `/api/...` pakai axios. Dibangun pakai `laravel-vite-plugin` yang sudah
  terpasang — **tidak perlu setup Vite dari nol**, tinggal lanjutin yang sudah ada.
- **Satu shell HTML**: `resources/views/app.blade.php` — berisi `@vite([...])` +
  `<div id="app">`. Route catch-all di `routes/web.php` (`Route::get('/{any?}', fn () => view('app'))`)
  render view ini untuk semua path selain `/api/*`. React Router yang urus
  routing halaman di sisi client.
- **Same-origin, tanpa CORS** — otomatis, karena API dan frontend memang satu
  aplikasi Laravel yang sama.
- **Auth admin = session cookie native Laravel** (bukan Sanctum, bukan token/JWT).
  Alasan lengkap ada di `../petunjuk1.md` §7. Konsekuensinya buat FE: **wajib
  pakai axios** biar CSRF cookie ke-handle otomatis — detail di `API.md` §1.

## 3. Yang sudah ada di `resources/js` (starter point Ali)

- `resources/js/app.tsx` — entry point, sudah render `<BrowserRouter>` +
  satu route placeholder `/`. **Lanjutkan dari sini**, bukan bikin file baru dari nol.
- `resources/js/lib/api.ts` — axios instance sudah dikonfigurasi
  (`withCredentials`, `withXSRFToken`) sesuai kebutuhan auth cookie. Import ini
  buat semua request ke API, jangan bikin instance axios baru.
- `resources/css/app.css` — entry Tailwind v4 (`@import 'tailwindcss';`).
- Dependency yang sudah terpasang: `react-router-dom`, `axios`, Radix UI,
  `lucide-react`, `tailwind-merge`, dll (cek `package.json`).
- Yang **belum**: DOMPurify, rich text editor (TipTap/CKEditor) — tambahkan
  sendiri sesuai kebutuhan halaman yang lagi dikerjakan.

## 4. Cara jalanin semuanya di lokal

Backend + asset build jalan via **Laravel Sail** (Docker):

```bash
./vendor/bin/sail up -d
```

Untuk kerja di frontend dengan hot-reload, jalankan Vite dev server di terminal
terpisah (di host, bukan di dalam container):

```bash
npm install   # sekali di awal / tiap ada dependency baru
npm run dev
```

- **Buka `http://localhost`** (port 80, backend Laravel) — **bukan** URL Vite
  dev server (`:5173`) secara langsung. `@vite()` di `app.blade.php` otomatis
  mendeteksi dev server sedang jalan dan inject script HMR-nya.
- Storage buat gambar sudah di-link (`php artisan storage:link` sudah dijalankan).
- Build production: `npm run build` — hasilnya masuk ke `public/build/`,
  otomatis dipakai Laravel lewat manifest, **tidak perlu copy manual apa pun.**

## 5. Yang perlu Ali lanjutkan (sesuai `plan.md` task #10–14)

1. React Router: tambah route buat 6 halaman publik + `/admin/*` di
   `resources/js/app.tsx` (daftar halaman lengkap ada di `../petunjuk1.md` §4b).
2. Fetch data pakai `resources/js/lib/api.ts` (axios yang sudah dikonfigurasi),
   endpoint lihat `API.md`.
3. Alur login admin: panggil `GET /api/csrf-cookie` sekali di awal → form login
   POST `/api/login` → simpan status login di context/store dari respons
   `GET /api/me` (bukan simpan token manual, cukup andalkan cookie).
4. Render `article.body` (HTML dari server) **wajib** dibungkus **DOMPurify**
   di sisi client juga — server sudah sanitasi saat simpan, tapi ini lapisan
   kedua sesuai mitigasi XSS di `../plan.md` §6 (defense in depth).
5. Upload cover image artikel → kirim `multipart/form-data`; untuk update
   (`PUT`) yang bawa file, pakai trik Laravel: POST + field `_method=PUT`.

## 6. Status backend (endpoint yang sudah bisa dipakai)

**Sudah jadi & ke-test** (lihat `API.md` untuk kontrak lengkap):
- Auth: `GET /api/csrf-cookie`, `POST /api/login`, `POST /api/logout`, `GET /api/me`
- Publik: `GET /api/categories`, `GET /api/articles` (+detail slug), `GET /api/social-links`, `GET /api/matches`
- Admin (butuh login): CRUD penuh `/api/admin/categories`, `/api/admin/articles`
- Sync otomatis jadwal/hasil dari football-data.org tiap 15 menit — sudah jalan
  dengan API key asli, data pertandingan Chelsea sudah ada di database

Yang **masih belum ada**:
- CRUD Pemain & Social Link buat admin (baru ada endpoint publik `GET /api/social-links`; Pemain malah belum ada endpoint sama sekali)
- Deploy production sungguhan (ini tahap lokal/dev, Sail)

## 7. Prioritas M1 (yang harus jalan sebelum 25 Juli)

Cukup 3 halaman publik dulu: **Homepage, News listing, Detail Artikel** — plus
**login admin + dashboard/editor artikel polos** (fungsional dulu, belum perlu
cantik). Matchday, Transfer News, Join Community, dan kelola pemain/social
link/akun itu **M2**, menyusul setelah rilis minimum.
