# 📌 Project Plan — Chelind Football (Rev. 3 — React + Laravel API, Same-Origin / Tanpa CORS)

**Pemilik proyek:** Ezra (PM & Backend)
**Tanggal dibuat:** 22 Juli 2026 · **Revisi 3:** 22 Juli 2026 (same-origin, CORS di-skip)
**Deadline rilis publik:** **25 Juli 2026** — situs harus sudah bisa diakses
**Model kerja:** Skala prioritas (🔴 wajib rilis → 🟡 sambil jalan → 🟢 menyusul)

---

## 1. Ringkasan Eksekutif

Chelind Football: **6 halaman publik** (sesuai Figma) + **panel admin** untuk artikel,
pemain, social link, dan akun. Jadwal & hasil pertandingan disinkron otomatis dari
football-data.org dan disimpan permanen di database.

**Arsitektur final Rev. 3:**
- **Backend:** Laravel sebagai **REST API JSON** (`/api/...`).
- **Frontend:** **React (Vite) + Tailwind CSS** — SPA untuk publik dan admin.
- **Satu repo:** backend Laravel dan frontend React hidup di repo yang sama
  (`resources/js`), bukan project terpisah — dibangun pakai `laravel-vite-plugin`
  bawaan starter kit. Alasan: `laravel/wayfinder` cuma berguna kalau FE-BE satu
  repo (lihat `petunjuk1.md` §7).
- **Same-origin, tanpa CORS:** otomatis, karena FE & API memang satu aplikasi.
  - Dev: `npm run dev` (Vite dev server) + Blade `@vite()` auto-detect, akses
    lewat `http://localhost` (bukan port Vite terpisah).
  - Prod: `npm run build` → manifest dibaca otomatis oleh `@vite()`, tanpa
    langkah copy file manual.
- **Auth admin:** **Native session Laravel** (cookie-based, `Auth::attempt()` + middleware
`web` ditempel manual ke `routes/api.php`) — bukan Sanctum. Same-origin murni sudah
cukup dengan session bawaan Laravel; Sanctum tidak menambah manfaat untuk 2 akun
statis tanpa mobile app (lihat `petunjuk1.md` §7 Log Keputusan).

**Tujuan:** (1) live 25 Juli dengan konten inti; (2) admin mandiri kelola konten;
(3) cron sync jalan otomatis, user selalu baca dari database.

---

## 2. 🎯 Lingkup & Deliverable

### In-Scope (Fase 1)
- Laravel API JSON: endpoint publik (Article, Category, Player, SocialLink, Match)
  + endpoint admin (CRUD) diproteksi middleware auth (role belum dipisah Master/Admin).
- Same-origin: satu repo Laravel+React, **route fallback SPA** render Blade `@vite()`.
- React SPA: 6 halaman publik + admin di route `/admin/*`.
- Database 7 tabel sesuai ERD final.
- Cron sync football-data.org (Chelsea id 61) tiap 15–30 menit, upsert `external_id`.
- Upload gambar (cover, foto pemain) via API + storage Laravel.

### Out-of-Scope (Fase 1)
- ❌ **Konfigurasi CORS** — tidak dibutuhkan selama satu domain (kelak tinggal isi
  `config/cors.php` bila FE pindah domain / ada mobile app).
- ❌ View Matchday penuh + tampilan hasil (endpoint siap, view menyusul).
- ❌ Statistik terstruktur (Opsi A: HTML di `body`); sync pemain dari API;
  tabel Team/Tags; halaman admin `MATCH`; SSR/Next.js.

### Deliverable
| # | Deliverable | Bentuk |
|---|---|---|
| D1 | Laravel API JSON ter-deploy | Endpoint live |
| D2 | React SPA ter-deploy, satu domain dengan API | URL live |
| D3 | Migration + seeder 7 tabel | Kode |
| D4 | Cron sync jadwal berjalan | Job terjadwal |
| D5 | Dokumentasi endpoint API (kontrak FE–BE) | Markdown/Postman |

---

## 3. 📅 Milestone

| Milestone | Isi | Target |
|---|---|---|
| **M1 — Rilis Minimum** 🔴 | API inti + Homepage, News, Detail Artikel + cron + admin login & publish + deploy same-origin | **25 Juli** |
| **M2 — Konten Lengkap** 🟡 | Transfer News, Join Community, kelola pemain/social link/akun-role, rapikan admin | Sambil jalan |
| **M3 — Pelengkap** 🟢 | Matchday penuh + hasil, views, SEO, polish | Saat dibutuhkan |

---

## 4. ✅ Work Breakdown per Prioritas

### 🔴 M1 — Wajib sebelum 25 Juli

**Backend / API (Ezra)**
| # | Tugas | Catatan |
|---|---|---|
| 1 | Setup Laravel + repo + environment | Fondasi |
| 2 | Migration 7 tabel + seeder (Role, Category, akun Master) | Sesuai ERD |
| 3 | Auth native session Laravel (cookie-based): login, logout, `/api/me`, middleware role | Uji end-to-end paling awal |
| 4 | Endpoint publik: artikel (list+detail slug), kategori, jadwal `SCHEDULED`, social link | Pagination |
| 5 | Endpoint admin: CRUD Artikel + upload cover + slug otomatis + **sanitasi HTML di server** | Jangan andalkan client |
| 6 | Service sync football-data + command cron (upsert `external_id`) | Rate limit 10/menit |
| 7 | **Kontrak endpoint API untuk Ali** | Hari pertama — kunci kerja paralel |
| 8 | **Route fallback SPA** (catch-all non-`/api` → `index.html`) | Pengganti tugas CORS |
| 9 | Deploy Laravel + build React satu domain + cron aktif | Syarat live tgl 25 |

**Frontend / React (Ali)**
| # | Tugas | Catatan |
|---|---|---|
| 10 | Lanjutkan scaffold React yang sudah ada di `resources/js` (Router + axios client) | Satu repo dgn backend; jalan via `npm run dev`, akses `http://localhost`; fetch path relatif `/api/...` |
| 11 | Homepage: hero, social media, content hub, jadwal 2–3 laga, berita terbaru | Sesuai Figma |
| 12 | News listing + Detail Artikel (render `body` + DOMPurify) | Template reusable |
| 13 | Admin minimum `/admin/*`: login (session cookie native), daftar artikel, editor rich text | Fungsional-polos dulu |
| 14 | `npm run build` + integrasi ke deploy Laravel (koordinasi #8–9) | Syarat live tgl 25 |

**Design (Reifan)**
| # | Tugas | Catatan |
|---|---|---|
| 15 | QA visual hasil React vs Figma halaman rilis | Sebelum 25 Juli |

### 🟡 M2 — Sambil jalan
| # | Tugas | PIC |
|---|---|---|
| 16 | Transfer News (endpoint filter kategori + halaman) | Ezra + Ali |
| 17 | Join Community (statis + `SocialLink`) | Ali |
| 18 | CRUD Pemain + section Pemain di News | Ezra + Ali |
| 19 | CRUD Social Link (`sort_order`) | Ezra + Ali |
| 20 | Kelola akun & role — khusus Master | Ezra + Ali |
| 21 | Desain admin di Figma → rapikan UI admin | Reifan → Ali |
| 22 | `is_featured` & tampilan berita unggulan | Ezra + Ali |
| 23 | Rapikan alur deploy FE (script build/CI sederhana) | Ezra + Ali |

### 🟢 M3 — Menyusul
| # | Tugas | PIC |
|---|---|---|
| 24 | Matchday penuh: filter kompetisi, hasil `FINISHED` | Ali + Ezra |
| 25 | "Laga berikutnya" di hero (bila belum masuk M1) | Ali |
| 26 | Counter `views` artikel | Ezra |
| 27 | SEO SPA: meta tags, og:image, sitemap; evaluasi prerender/SSR | Ali + Ezra |
| 28 | Keputusan tertunda: Category fixed vs dinamis; site settings | Ezra (PM) |
| 29 | (Kelak) Aktifkan CORS di `config/cors.php` bila FE pisah domain / mobile app | Ezra |

---

## 5. 👥 Tim & Sumber Daya

| Nama | Peran | Tanggung jawab |
|---|---|---|
| **Ezra** | PM + Backend | API, database, auth, cron, fallback SPA, deploy, kontrak API, scope |
| **Reifan** | UI/UX | Figma (admin menyusul), QA visual |
| **Ali** | Frontend | React + Tailwind di `resources/js`, integrasi API, build FE |

**Tools:** Laravel (native session auth), MySQL/MariaDB (asumsi), Git · React + Vite + Tailwind,
React Router, axios/fetch, DOMPurify · rich text editor (TipTap/CKEditor) · API key
football-data (free tier) · server dengan cron + **satu domain** · Figma, Postman.

---

## 6. ⚠️ Risiko & Mitigasi

| Risiko | Prob. | Dampak | Mitigasi |
|---|---|---|---|
| Deadline ±3 hari, arsitektur API + SPA | Tinggi | Tinggi | Kontrak API hari 1 (#7); scope M1 ketat; FE–BE paralel |
| Refresh browser 404 di route SPA / fetch nyasar | Rendah | Sedang | Fallback SPA & pengecualian `/api` sudah jadi & ke-test di backend; Ali tinggal fetch path relatif |
| Admin custom React makan waktu | Sedang | Tinggi | M1 admin polos (login + CRUD artikel); percantik di M2 |
| Rate limit / API down | Sedang | Sedang | Baca dari DB; cron retry + log; monitor `last_synced_at` |
| XSS dari HTML `body` | Sedang | Sedang | Sanitasi server saat simpan + DOMPurify saat render |
| SEO lemah (SPA) | Sedang | Rendah–Sedang | Terima di M1; evaluasi prerender/SSR di M3 |
| Ketergantungan pada Ezra | Sedang | Tinggi | Kontrak API tertulis; dokumentasi keputusan di Petunjuk 1 |
| Kelak butuh FE pisah domain / mobile app | Rendah | Rendah | Tambah CORS belakangan (#29), tanpa ubah tabel/endpoint |

> Risiko klasik CORS lintas domain (cookie, CSRF, preflight) **hilang** berkat
> same-origin — alasan utama arsitektur ini dipilih untuk kejar deadline. Karena
> same-origin, auth cukup pakai session cookie native Laravel tanpa Sanctum.

---

## 7. 💰 Anggaran

| Kategori | Item | Estimasi |
|---|---|---|
| API | football-data.org free tier | Rp 0 |
| Hosting | 1 server (Laravel + cron + serve build React) | menyesuaikan provider |
| Domain | 1 domain (tanpa subdomain API) | menyesuaikan provider |
| Tools | Laravel, React, Tailwind, Figma | Rp 0 |

> Upgrade Deep Data (~€29/bln) tidak dianggarkan — hanya bila butuh statistik terfilter.

---

## 8. 📊 KPI

1. Situs bisa diakses publik **25 Juli 2026** — Homepage, News, Detail Artikel tampil dari API JSON.
2. Login admin end-to-end sukses (session cookie same-origin), refresh route mana pun tidak 404.
3. Cron stabil: `last_synced_at` < 30 menit; 0 panggilan football-data dari request user.
4. Admin mandiri: publish artikel tanpa developer.
5. (M2) Semua halaman publik + admin lolos QA visual Reifan.

---

## 📝 Asumsi

- FE dan API **satu domain** (server boleh dua, disatukan reverse proxy) — dasar skip CORS.
- Admin ikut SPA yang sama (route `/admin/*`).
- React via Vite; auth native session Laravel (cookie-based, tanpa Sanctum); MySQL/MariaDB.
- Figma publik final; desain admin belum ada.
- "Deadline 25" = minimal **M1 live**, bukan semua fitur selesai.

---

*Rev. 3 — perubahan dari Rev. 2: CORS di-skip via same-origin (Vite proxy di dev,
serve build React + route fallback SPA di production). React + Tailwind tetap penuh;
API tetap JSON.*