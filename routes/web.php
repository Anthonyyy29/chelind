<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['app' => config('app.name'), 'status' => 'ok']);
})->name('home');

// Fallback: dibutuhkan Laravel auth middleware untuk resolve route('login')
// saat request non-JSON menyentuh endpoint API terproteksi. Halaman login
// sesungguhnya ada di React SPA, bukan di sini.
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');
