<?php

namespace App\Console\Commands;

use App\Services\FootballData\MatchSyncService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Throwable;

#[Signature('matches:sync')]
#[Description('Sinkron jadwal & hasil pertandingan Chelsea dari football-data.org')]
class SyncFootballMatches extends Command
{
    public function handle(MatchSyncService $service): int
    {
        try {
            $count = $service->sync();
        } catch (Throwable $e) {
            report($e);
            $this->error("Sync gagal: {$e->getMessage()}");

            return self::FAILURE;
        }

        $this->info("Sync sukses: {$count} pertandingan diproses.");

        return self::SUCCESS;
    }
}
