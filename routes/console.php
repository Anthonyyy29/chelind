<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// 1x panggilan API per jalan (ambil semua laga sekaligus), jauh di bawah
// rate limit free tier football-data.org (10 request/menit).
Schedule::command('matches:sync')
    ->everyFifteenMinutes()
    ->withoutOverlapping();
