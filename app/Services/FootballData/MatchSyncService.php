<?php

namespace App\Services\FootballData;

use App\Models\GameMatch;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

/**
 * Sinkron jadwal & hasil Chelsea dari football-data.org ke tabel `matches`.
 * Satu panggilan API mengambil semua laga sekaligus, jauh di bawah rate limit
 * free tier (10 request/menit) walau cron jalan tiap 15 menit.
 */
class MatchSyncService
{
    public function sync(): int
    {
        $teamId = (int) config('services.football_data.team_id');

        $matches = Http::baseUrl('https://api.football-data.org/v4')
            ->withHeaders(['X-Auth-Token' => config('services.football_data.key')])
            ->timeout(10)
            ->connectTimeout(5)
            ->retry(2, 500, fn ($exception) => $exception instanceof ConnectionException)
            ->get("/teams/{$teamId}/matches")
            ->throw()
            ->json('matches', []);

        foreach ($matches as $match) {
            $this->upsert($match, $teamId);
        }

        return count($matches);
    }

    /**
     * @param  array<string, mixed>  $match
     */
    private function upsert(array $match, int $teamId): void
    {
        $isHome = $match['homeTeam']['id'] === $teamId;

        GameMatch::updateOrCreate(
            ['external_id' => $match['id']],
            [
                'competition' => $match['competition']['name'] ?? 'Unknown',
                'opponent' => $isHome ? $match['awayTeam']['name'] : $match['homeTeam']['name'],
                'is_home' => $isHome,
                'kickoff_at' => $match['utcDate'],
                'status' => $match['status'] === 'FINISHED' ? 'FINISHED' : 'SCHEDULED',
                'score_home' => $match['score']['fullTime']['home'] ?? null,
                'score_away' => $match['score']['fullTime']['away'] ?? null,
                'last_synced_at' => now(),
            ]
        );
    }
}
