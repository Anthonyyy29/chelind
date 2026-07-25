<?php

use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\PlayerController as AdminPlayerController;
use App\Http\Controllers\Api\Admin\SocialLinkController as AdminSocialLinkController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\SocialLinkController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});

// Publik — tanpa auth, dibaca React SPA
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article:slug}', [ArticleController::class, 'show']);
Route::get('/social-links', [SocialLinkController::class, 'index']);
Route::get('/matches', [MatchController::class, 'index']);
Route::get('/players', [PlayerController::class, 'index']);

// Session native (bukan Sanctum) — SPA & API satu domain, jadi cukup middleware
// 'web' (cookie session + CSRF) yang ditempel manual ke sini.
Route::middleware('web')->group(function () {
    // SPA wajib GET ke sini dulu buat dapat cookie session + XSRF-TOKEN
    // sebelum POST /login, kalau tidak CSRF-nya bakal ditolak (419).
    Route::get('/csrf-cookie', fn () => response()->noContent());

    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::prefix('admin')->group(function () {
            Route::apiResource('categories', AdminCategoryController::class)->except('show');
            Route::apiResource('articles', AdminArticleController::class);
            Route::apiResource('social-links', AdminSocialLinkController::class)->except('show');
            Route::apiResource('players', AdminPlayerController::class)->except('show');
        });
    });
});
