<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

// Catch-all SPA: semua path selain /api/* diarahkan ke index.html hasil build
// React (task #8). Nama route 'login' dipertahankan supaya middleware `auth`
// tetap bisa resolve route('login') saat request non-JSON menyentuh endpoint
// terproteksi — secara nyata, halaman /login itu sendiri memang bagian dari
// SPA ini juga (dirender React Router, bukan Laravel).
Route::get('/{any?}', function () {
    $index = public_path('index.html');

    if (File::exists($index)) {
        return response(File::get($index))->header('Content-Type', 'text/html');
    }

    return response(
        "React SPA belum di-build ke public/.\n".
        'Jalankan `npm run build` di project frontend, lalu salin hasilnya '.
        '(termasuk index.html) ke folder public/ Laravel ini.'
    );
})->where('any', '^(?!api).*$')->name('login');
