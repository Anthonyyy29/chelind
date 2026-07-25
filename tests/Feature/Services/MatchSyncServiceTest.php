<?php

use App\Models\GameMatch;
use App\Services\FootballData\MatchSyncService;
use Illuminate\Support\Facades\Http;

test('sync maps a home fixture correctly', function () {
    Http::preventStrayRequests();
    Http::fake([
        'api.football-data.org/*' => Http::response(['matches' => [
            [
                'id' => 111,
                'utcDate' => '2026-08-01T14:00:00Z',
                'status' => 'SCHEDULED',
                'competition' => ['id' => 2021, 'name' => 'Premier League'],
                'homeTeam' => ['id' => 61, 'name' => 'Chelsea FC', 'crest' => 'https://crests.football-data.org/61.png'],
                'awayTeam' => ['id' => 57, 'name' => 'Arsenal FC', 'crest' => 'https://crests.football-data.org/57.png'],
                'score' => ['fullTime' => ['home' => null, 'away' => null]],
            ],
        ]]),
    ]);

    $count = app(MatchSyncService::class)->sync();

    expect($count)->toBe(1);

    $match = GameMatch::firstWhere('external_id', 111);
    expect($match->competition)->toBe('Premier League')
        ->and($match->opponent)->toBe('Arsenal FC')
        ->and($match->opponent_crest)->toBe('https://crests.football-data.org/57.png')
        ->and($match->is_home)->toBeTrue()
        ->and($match->status)->toBe('SCHEDULED')
        ->and($match->score_home)->toBeNull();

    Http::assertSent(fn ($request) => $request->url() === 'https://api.football-data.org/v4/teams/61/matches'
        && $request->hasHeader('X-Auth-Token'));
});

test('sync maps an away finished fixture correctly', function () {
    Http::preventStrayRequests();
    Http::fake([
        'api.football-data.org/*' => Http::response(['matches' => [
            [
                'id' => 222,
                'utcDate' => '2026-07-10T18:30:00Z',
                'status' => 'FINISHED',
                'competition' => ['id' => 2021, 'name' => 'Premier League'],
                'homeTeam' => ['id' => 66, 'name' => 'Manchester United FC', 'crest' => 'https://crests.football-data.org/66.png'],
                'awayTeam' => ['id' => 61, 'name' => 'Chelsea FC', 'crest' => 'https://crests.football-data.org/61.png'],
                'score' => ['fullTime' => ['home' => 1, 'away' => 3]],
            ],
        ]]),
    ]);

    app(MatchSyncService::class)->sync();

    $match = GameMatch::firstWhere('external_id', 222);
    expect($match->opponent)->toBe('Manchester United FC')
        ->and($match->opponent_crest)->toBe('https://crests.football-data.org/66.png')
        ->and($match->is_home)->toBeFalse()
        ->and($match->status)->toBe('FINISHED')
        ->and($match->score_home)->toBe(1)
        ->and($match->score_away)->toBe(3);
});

test('unmapped statuses normalize to SCHEDULED', function () {
    Http::preventStrayRequests();
    Http::fake([
        'api.football-data.org/*' => Http::response(['matches' => [
            [
                'id' => 333,
                'utcDate' => '2026-08-05T14:00:00Z',
                'status' => 'POSTPONED',
                'competition' => ['id' => 2021, 'name' => 'Premier League'],
                'homeTeam' => ['id' => 61, 'name' => 'Chelsea FC'],
                'awayTeam' => ['id' => 57, 'name' => 'Arsenal FC'],
                'score' => ['fullTime' => ['home' => null, 'away' => null]],
            ],
        ]]),
    ]);

    app(MatchSyncService::class)->sync();

    expect(GameMatch::firstWhere('external_id', 333)->status)->toBe('SCHEDULED');
});

test('sync upserts by external_id instead of duplicating rows', function () {
    $fixture = fn (string $status, ?int $home, ?int $away) => ['matches' => [[
        'id' => 444,
        'utcDate' => '2026-08-01T14:00:00Z',
        'status' => $status,
        'competition' => ['id' => 2021, 'name' => 'Premier League'],
        'homeTeam' => ['id' => 61, 'name' => 'Chelsea FC'],
        'awayTeam' => ['id' => 57, 'name' => 'Arsenal FC'],
        'score' => ['fullTime' => ['home' => $home, 'away' => $away]],
    ]]];

    Http::preventStrayRequests();

    Http::fake([
        'api.football-data.org/*' => Http::sequence()
            ->push($fixture('SCHEDULED', null, null))
            ->push($fixture('FINISHED', 2, 1)),
    ]);

    app(MatchSyncService::class)->sync();
    app(MatchSyncService::class)->sync();

    expect(GameMatch::where('external_id', 444)->count())->toBe(1);

    $match = GameMatch::firstWhere('external_id', 444);
    expect($match->status)->toBe('FINISHED')
        ->and($match->score_home)->toBe(2)
        ->and($match->score_away)->toBe(1);
});
