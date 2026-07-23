<?php

use Illuminate\Support\Facades\Route;

// Catch-all SPA: semua path selain /api/* dirender lewat resources/views/app.blade.php
// (task #8). @vite() di view itu otomatis pakai dev server saat `npm run dev`
// jalan, atau manifest hasil `npm run build` di production — tidak perlu
// langkah manual apa pun. Nama route 'login' dipertahankan supaya middleware
// `auth` tetap bisa resolve route('login') saat request non-JSON menyentuh
// endpoint terproteksi — secara nyata, halaman /login itu sendiri memang
// bagian dari SPA ini juga (dirender React Router, bukan Laravel).
Route::get('/{any?}', fn () => view('app'))
    ->where('any', '^(?!api).*$')
    ->name('login');
