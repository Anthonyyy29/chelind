<?php

namespace Database\Seeders;

use App\Models\Player;
use Illuminate\Database\Seeder;

class PlayerSeeder extends Seeder
{
    /**
     * Data diambil dari desain Figma (section "Players" halaman News).
     * Foto = placeholder path; nomor punggung & bendera menyatu di dalam foto.
     */
    public function run(): void
    {
        $players = [
            ['name' => 'Filip Jorgensen', 'position' => 'Goalkeeper',           'photo' => 'players/filip-jorgensen.png'],
            ['name' => 'Cole Palmer',     'position' => 'Attacking Midfielder', 'photo' => 'players/cole-palmer.png'],
            ['name' => 'Joao Pedro',      'position' => 'Forward',              'photo' => 'players/joao-pedro.png'],
            ['name' => 'Enzo Fernandez',  'position' => 'Central Midfielder',   'photo' => 'players/enzo-fernandez.png'],
            ['name' => 'Liam Delap',      'position' => 'Striker',              'photo' => 'players/liam-delap.png'],
        ];

        foreach ($players as $player) {
            Player::create($player + ['is_active' => true]);
        }
    }
}
