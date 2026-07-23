<?php

use Illuminate\Support\Facades\Http;

test('command reports success when sync succeeds', function () {
    Http::preventStrayRequests();
    Http::fake([
        'api.football-data.org/*' => Http::response(['matches' => [
            [
                'id' => 999,
                'utcDate' => '2026-08-01T14:00:00Z',
                'status' => 'SCHEDULED',
                'competition' => ['id' => 2021, 'name' => 'Premier League'],
                'homeTeam' => ['id' => 61, 'name' => 'Chelsea FC'],
                'awayTeam' => ['id' => 57, 'name' => 'Arsenal FC'],
                'score' => ['fullTime' => ['home' => null, 'away' => null]],
            ],
        ]]),
    ]);

    $this->artisan('matches:sync')
        ->expectsOutputToContain('Sync sukses: 1 pertandingan diproses.')
        ->assertExitCode(0);
});

test('command fails gracefully when the API call errors out', function () {
    Http::preventStrayRequests();
    Http::fake([
        'api.football-data.org/*' => Http::response(['message' => 'error'], 500),
    ]);

    $this->artisan('matches:sync')
        ->expectsOutputToContain('Sync gagal')
        ->assertExitCode(1);
});
