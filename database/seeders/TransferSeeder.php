<?php

namespace Database\Seeders;

use App\Models\Transfer;
use Illuminate\Database\Seeder;

class TransferSeeder extends Seeder
{
    public function run(): void
    {
        // Diurutkan dari yang paling lama ke paling baru — ditampilkan
        // terbalik (Transfer::orderBy('id', 'desc')) supaya yang paling
        // baru dibuat muncul di atas.
        $transfers = [
            [
                'direction' => 'out',
                'is_loan' => false,
                'player_name' => 'Jimi Tauriainen',
                'position' => 'DM',
                'club_from' => 'Chelsea FC',
                'club_to' => 'AC Horsens',
                'fee' => null,
            ],
            [
                'direction' => 'out',
                'is_loan' => false,
                'player_name' => 'Noni Madueke',
                'position' => 'RW',
                'club_from' => 'Chelsea FC',
                'club_to' => 'Napoli',
                'fee' => 38.0,
            ],
            [
                'direction' => 'in',
                'is_loan' => false,
                'player_name' => 'Ángel Di María',
                'position' => 'RW',
                'club_from' => 'Benfica',
                'club_to' => 'Chelsea FC',
                'fee' => 24.5,
            ],
            [
                'direction' => 'out',
                'is_loan' => true,
                'player_name' => 'Harrison Murray-Campbell',
                'position' => 'CB',
                'club_from' => 'Chelsea FC',
                'club_to' => 'Kortrijk',
                'fee' => null,
            ],
            [
                'direction' => 'out',
                'is_loan' => true,
                'player_name' => 'Jesse Derry',
                'position' => 'LW',
                'club_from' => 'Chelsea FC',
                'club_to' => 'Sporting CP',
                'fee' => null,
            ],
            [
                'direction' => 'out',
                'is_loan' => false,
                'player_name' => 'Andrey Santos',
                'position' => 'DM',
                'club_from' => 'Chelsea FC',
                'club_to' => 'Man United',
                'fee' => 56.3,
            ],
            [
                'direction' => 'in',
                'is_loan' => false,
                'player_name' => 'Morgan Rogers',
                'position' => 'AM',
                'club_from' => 'Aston Villa',
                'club_to' => 'Chelsea FC',
                'fee' => 137.3,
            ],
            [
                'direction' => 'out',
                'is_loan' => true,
                'player_name' => 'Alejandro Garnacho',
                'position' => 'LW',
                'club_from' => 'Chelsea FC',
                'club_to' => 'Aston Villa',
                'fee' => null,
            ],
        ];

        foreach ($transfers as $data) {
            Transfer::firstOrCreate(
                ['player_name' => $data['player_name']],
                $data
            );
        }
    }
}
