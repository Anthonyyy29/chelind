<?php

namespace Database\Seeders;

use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class SocialLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialLinks = [
            [
                'platform' => 'Instagram',
                'handle' => '@chel.indo',
                'url' => 'https://www.instagram.com/chel.indo',
                'description' => 'Ikuti konten harian, foto, dan update terbaru Chelsea di Instagram kami.',
                'sort_order' => 1,
            ],
            [
                'platform' => 'X',
                'handle' => 'Chelind Football',
                'url' => 'https://twitter.com/ChelindFootball',
                'description' => 'Diskusi, hot takes, dan thread analisis pertandingan Chelsea setiap hari.',
                'sort_order' => 2,
            ],
            [
                'platform' => 'Youtube',
                'handle' => 'Chelind Football Media',
                'url' => 'https://www.youtube.com/@chelind.official',
                'description' => 'Highlight, review laga, dan konten video eksklusif dari redaksi Chelind.',
                'sort_order' => 3,
            ],
            [
                'platform' => 'Tiktok',
                'handle' => '@chelindfootball',
                'url' => 'https://www.tiktok.com/@chelindfootball',
                'description' => 'Video pendek dan momen viral Chelsea yang sayang untuk dilewatkan.',
                'sort_order' => 4,
            ],
            [
                'platform' => 'Whatsapp',
                'handle' => 'Community',
                'url' => '', // belum ada link — dikosongkan dulu
                'description' => 'Bergabung dengan ribuan fans Chelsea di grup komunitas WhatsApp kami.',
                'sort_order' => 5,
            ],
        ];

        foreach ($socialLinks as $link) {
            SocialLink::create($link);
        }
    }
}
