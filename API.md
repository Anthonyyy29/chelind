# Chelind Football — Kontrak API (FE ↔ BE)

Dokumen ini untuk Ali (frontend). Semua endpoint di bawah **satu domain** dengan
React SPA (same-origin, tanpa CORS). Base path: `/api`.

Auth **bukan** Sanctum — session cookie native Laravel. Alasan & detail keputusan
ada di `../petunjuk1.md` §7.

---

## 1. Autentikasi

Auth berbasis **cookie session + CSRF**, bukan bearer token. Alurnya:

### 1.1 Ambil CSRF cookie (wajib, sekali di awal sesi browser)

```
GET /api/csrf-cookie
```

Response: `204 No Content`. Efek sampingnya browser dapat cookie `XSRF-TOKEN`.
**Wajib dipanggil sebelum `POST /api/login`**, kalau tidak akan kena `419`.

### 1.2 Login

```
POST /api/login
Content-Type: application/json

{ "email": "admin@chelind.test", "password": "secret123" }
```

- Sukses → `200` + `{ "user": { ...lihat §1.4... } }`, cookie session ter-set.
- Salah email/password → `422` + `{ "errors": { "email": ["..."] } }`
- Kena rate limit (>5x/menit per email+IP) → `429`

### 1.3 Logout

```
POST /api/logout   (butuh sudah login)
```

Response: `200` + `{ "message": "Logged out." }`. Session diinvalidasi di server.

### 1.4 Cek sesi berjalan / data user login

```
GET /api/me   (butuh sudah login)
```

Response `200`:

```json
{
  "id": 1,
  "name": "Admin Chelind",
  "email": "admin@chelind.test",
  "role_id": 2,
  "role": { "id": 2, "name": "admin" },
  "created_at": "...",
  "updated_at": "..."
}
```

Belum login → `401` + `{ "message": "Unauthenticated." }`.

### 1.5 Setup client (axios contoh)

Axios secara default sudah cocok dengan konvensi Laravel (baca cookie
`XSRF-TOKEN`, kirim balik sebagai header `X-XSRF-TOKEN`) asal:

```js
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true; // axios v1.1+
```

Kalau pakai `fetch` manual, wajib `credentials: 'include'` di setiap request,
dan baca cookie `XSRF-TOKEN` sendiri untuk header `X-XSRF-TOKEN` pada request
`POST`/`PUT`/`PATCH`/`DELETE`.

---

## 2. Endpoint Publik (tanpa login)

### `GET /api/categories`

```json
{ "data": [{ "id": 1, "name": "Transfer News", "slug": "transfer-news", "articles_count": null }] }
```

### `GET /api/articles`

Query param opsional: `?category=<slug>`, `?featured=1`. Terpaginasi (10/halaman).
Hanya artikel `status=published`.

```json
{
  "data": [{ "id": 5, "title": "...", "slug": "...", "excerpt": "...", "body": "...",
             "cover_image": "https://.../storage/covers/xxx.jpg",
             "category": { "id": 1, "name": "Transfer News", "slug": "transfer-news" },
             "is_featured": false, "status": "published",
             "published_at": "2026-07-20T10:00:00.000000Z", "views": 12,
             "created_at": "...", "updated_at": "..." }],
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
  "meta": { "current_page": 1, "last_page": 3, "per_page": 10, "total": 27, ... }
}
```

### `GET /api/articles/{slug}`

Detail satu artikel (`published` saja, selain itu `404`). Menaikkan `views` +1
setiap dipanggil. `author` ikut disertakan (`{ "id", "name" }`).

### `GET /api/social-links`

Urut `sort_order` naik.

```json
{ "data": [{ "id": 1, "platform": "instagram", "handle": "@chelindfc",
             "url": "https://instagram.com/chelindfc", "description": null, "sort_order": 0 }] }
```

### `GET /api/matches`

Default = jadwal (`status=SCHEDULED`, urut kickoff terdekat dulu).
`?status=finished` → hasil pertandingan (urut terbaru dulu).
`?limit=3` → batasi jumlah baris (dipakai buat hero "laga berikutnya").

```json
{ "data": [{ "id": 10, "competition": "Premier League", "opponent": "Arsenal",
             "is_home": true, "kickoff_at": "2026-08-01T14:00:00.000000Z",
             "status": "SCHEDULED", "score_home": null, "score_away": null }] }
```

> **Catatan:** data ini diisi cron `matches:sync` (jalan tiap 15 menit), bukan
> input manual. Kalau `FOOTBALL_DATA_API_KEY` di `.env` belum diisi API key
> asli, endpoint ini akan selalu balikin `data: []` — bukan berarti endpointnya
> rusak.

---

## 3. Endpoint Admin (wajib login, prefix `/api/admin`)

Semua butuh cookie session valid (lihat §1). Tidak ada pembedaan role Master vs
Admin di endpoint ini — dua-duanya boleh kelola artikel & kategori.

### Kategori — `/api/admin/categories`

| Method | Path | Body | Sukses |
|---|---|---|---|
| GET | `/` | — | `200`, list semua kategori (+`articles_count`), tanpa pagination |
| POST | `/` | `{ "name": "Transfer News" }` | `201`, `{ "data": {...} }`. `slug` auto-generate & unik |
| PUT/PATCH | `/{id}` | `{ "name": "..." }` | `200`, `{ "data": {...} }` |
| DELETE | `/{id}` | — | `204`. **`422`** kalau kategori masih dipakai artikel |

`name` wajib unik (case-sensitive per DB collation), validasi gagal → `422`.

### Artikel — `/api/admin/articles`

| Method | Path | Body | Sukses |
|---|---|---|---|
| GET | `/` | — | `200`, terpaginasi (15/halaman), termasuk draft |
| POST | `/` | lihat di bawah | `201`, `{ "data": {...} }` |
| GET | `/{id}` | — | `200`, `{ "data": {...} }` |
| PUT/PATCH | `/{id}` | field opsional, `sometimes` | `200`, `{ "data": {...} }` |
| DELETE | `/{id}` | — | `204`. Cover image ikut terhapus dari storage |

**Body create** (`multipart/form-data` karena ada file):

| Field | Aturan |
|---|---|
| `title` | required, string, max 255 |
| `excerpt` | nullable, string, max 500 |
| `body` | required, string (HTML dari rich text editor — **disanitasi otomatis di server**, jangan andalkan sanitasi FE saja) |
| `category_id` | required, harus ada di tabel categories |
| `cover_image` | nullable, file image, max 4MB |
| `is_featured` | opsional, boolean |
| `status` | required, `draft` atau `published` |

Catatan:
- `slug` **auto-generate** dari `title`, jangan dikirim dari FE.
- `author_id` diisi otomatis dari user yang login, jangan dikirim dari FE.
- `published_at` otomatis terisi `now()` begitu `status` pindah ke `published`.
- Update pakai `PUT`/`PATCH` biasa (bukan method-spoofing khusus), tapi kalau
  FE kirim file lewat `multipart/form-data` di request `PUT`, gunakan trik
  Laravel standar: POST + field `_method=PUT`.

---

## 4. Format Error Umum

| Status | Kapan | Bentuk |
|---|---|---|
| `401` | Belum login / session habis | `{ "message": "Unauthenticated." }` |
| `422` | Validasi gagal | `{ "message": "...", "errors": { "field": ["pesan"] } }` |
| `422` | Hapus kategori yang masih dipakai artikel | `{ "message": "Kategori masih dipakai artikel, tidak bisa dihapus." }` |
| `404` | Artikel/kategori tidak ditemukan, atau artikel belum published | `{ "message": "Not Found" / "..." }` |
| `419` | CSRF token tidak cocok/hilang | Biasanya karena lupa panggil `GET /api/csrf-cookie` dulu, atau cookie session sudah kedaluwarsa — ulangi dari §1.1 |
| `429` | Login kena rate limit | — |

---

## 5. Non-API: Route Fallback SPA

Backend dan frontend satu repo. Semua path selain `/api/*` (termasuk `/`,
`/login`, `/admin/apa-pun`) dirender lewat `resources/views/app.blade.php` via
satu route catch-all di `routes/web.php` — bukan routing Laravel per halaman.

- React Router (di `resources/js/app.tsx`) yang menentukan halaman mana yang
  muncul, bukan Laravel.
- Refresh browser di URL apa pun (`/berita/judul-artikel`, `/admin/articles`)
  tetap balikin shell HTML yang sama, lalu React Router yang urus sisanya.
- `@vite([...])` di `app.blade.php` otomatis pakai dev server (`npm run dev`)
  saat development, atau manifest hasil `npm run build` di production —
  **tidak ada langkah manual copy file apa pun.**

---

## 6. Belum Tersedia (jangan diasumsikan ada)

- CRUD Pemain & Social Link untuk admin (M2)
- Endpoint kelola akun & role (M2, Master only)
- Halaman/endpoint Matchday penuh dengan filter kompetisi (data sudah ada di
  `/api/matches`, tinggal dipakai — lihat §2)
