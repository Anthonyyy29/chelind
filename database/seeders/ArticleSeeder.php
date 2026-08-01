<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    /**
     * Gambar cover diambil dari public/assets/news (aset statis yang sudah
     * ikut repo) lalu disalin ke storage/app/public/covers, karena
     * storage/app/public sendiri di-gitignore (isinya hasil upload runtime).
     */
    private const COVER_SOURCES = [
        'hero.jpg' => 'hero.jpg',
        'chelsea.jpg' => 'chelsea.jpg',
        'matchday.jpg' => 'matchday.jpg',
        'news.jpg' => 'news.jpg',
        'transfer news.jpg' => 'transfer.jpg',
        'featured.jpg' => 'featured.jpg',
    ];

    public function run(): void
    {
        $covers = $this->ensureCoverImages();
        $author = User::where('email', 'owner@chelind.test')->first() ?? User::first();

        $matchReport = Category::where('name', 'Match Report')->first();
        $transferNews = Category::where('name', 'Transfer News')->first();
        $clubNews = Category::where('name', 'Club News')->first();

        $articles = [
            [
                'title' => 'Chelsea Amankan Kemenangan Tandang Melawan Brighton',
                'excerpt' => 'The Blues bangkit di babak kedua untuk membawa pulang tiga poin dari Amex Stadium.',
                'body' => "Chelsea sempat tertinggal lebih dulu sebelum berbalik unggul lewat dua gol di babak kedua.\n\nKemenangan ini menjaga tren positif Chelsea dalam beberapa laga tandang terakhir.",
                'category_id' => $matchReport?->id,
                'is_featured' => true,
                'tags' => ['Chelsea', 'Premier League', 'Brighton', 'Match Report'],
                'quote_text' => 'Kami bicara di ruang ganti soal tetap sabar. Babak kedua kami tampil jauh lebih baik.',
                'quote_author' => 'ENZO MARESCA — PELATIH UTAMA CHELSEA',
                'match_stats' => [
                    'home_team' => 'Brighton & Hove Albion',
                    'away_team' => 'Chelsea FC',
                    'home_score' => '1',
                    'away_score' => '2',
                    'possession_home' => 45,
                    'possession_away' => 55,
                    'shots_home' => 3,
                    'shots_away' => 6,
                    'pass_home' => 82,
                    'pass_away' => 88,
                    'corners_home' => 4,
                    'corners_away' => 5,
                    'goalscorers_text' => "Joao Pedro 27' (Brighton)\nCole Palmer 61', 74' (Chelsea)",
                ],
            ],
            [
                'title' => 'Enzo Fernandez Perpanjang Kontrak Hingga 2029',
                'excerpt' => 'Gelandang asal Argentina itu resmi mengikat masa depannya bersama Chelsea.',
                'body' => "Enzo Fernandez menandatangani perpanjangan kontrak jangka panjang bersama klub.\n\nManajemen klub menyebut keputusan ini sebagai bagian dari rencana jangka panjang skuad.",
                'category_id' => $transferNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Rumor Transfer: Chelsea Diklaim Incar Gelandang Muda Brasil',
                'excerpt' => 'Nama gelandang muda dari Brasil mulai dikaitkan dengan Stamford Bridge.',
                'body' => "Sejumlah media Eropa melaporkan ketertarikan Chelsea terhadap seorang gelandang muda Brasil.\n\nHingga saat ini belum ada konfirmasi resmi dari pihak klub.",
                'category_id' => $transferNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Cole Palmer Cetak Hat-trick di Kemenangan Piala Liga',
                'excerpt' => 'Palmer tampil cemerlang dengan tiga gol dalam satu laga di kompetisi Piala Liga.',
                'body' => "Cole Palmer menjadi bintang lapangan usai mencetak hat-trick pertamanya musim ini.\n\nPelatih memuji konsistensi performa Palmer sepanjang musim.",
                'category_id' => $matchReport?->id,
                'is_featured' => false,
                'tags' => ['Chelsea', 'Cole Palmer', 'Piala Liga', 'Match Report'],
                'quote_text' => 'Dia adalah pemenang pertandingan sejati. Ketika tim sangat membutuhkan, Cole selalu datang memberikan hasil luar biasa.',
                'quote_author' => 'ENZO MARESCA — PELATIH UTAMA CHELSEA',
                'match_stats' => [
                    'home_team' => 'Chelsea FC',
                    'away_team' => 'Newcastle United',
                    'home_score' => '3',
                    'away_score' => '1',
                    'possession_home' => 58,
                    'possession_away' => 42,
                    'shots_home' => 8,
                    'shots_away' => 3,
                    'pass_home' => 90,
                    'pass_away' => 83,
                    'corners_home' => 7,
                    'corners_away' => 2,
                    'goalscorers_text' => "Cole Palmer 12', 45', 70' (Chelsea)\nAnthony Gordon 55' (Newcastle)",
                ],
            ],
            [
                'title' => 'Maresca Bicara Soal Rotasi Skuad Jelang Laga Padat',
                'excerpt' => 'Pelatih Chelsea menekankan pentingnya manajemen rotasi di tengah jadwal padat.',
                'body' => "Enzo Maresca menyampaikan rencana rotasi pemain menjelang serangkaian laga di berbagai kompetisi.\n\nIa menegaskan seluruh skuad tetap dalam kondisi siap tempur.",
                'category_id' => $clubNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Preview Derby London: Chelsea vs Tottenham',
                'excerpt' => 'Duel panas London akan tersaji akhir pekan ini di Stamford Bridge.',
                'body' => "Derby London antara Chelsea dan Tottenham selalu menjadi laga yang dinantikan suporter kedua klub.\n\nKedua tim sama-sama membutuhkan kemenangan untuk menjaga posisi di klasemen.",
                'category_id' => $matchReport?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Chelind Community Gelar Nonton Bareng di 5 Kota',
                'excerpt' => 'Komunitas suporter Chelsea Indonesia mengadakan acara nonton bareng serentak.',
                'body' => "Chelind menggelar acara nonton bareng di lima kota besar untuk mempererat komunitas suporter.\n\nAcara ini terbuka untuk umum dan mendapat antusiasme tinggi dari para fans.",
                'category_id' => $clubNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Analisis Taktik: Bagaimana Chelsea Menang Penguasaan Bola',
                'excerpt' => 'Pendekatan taktik Maresca membuat Chelsea unggul dalam penguasaan bola musim ini.',
                'body' => "Statistik musim ini menunjukkan peningkatan signifikan pada rata-rata penguasaan bola Chelsea.\n\nPola build-up dari lini belakang menjadi salah satu kunci utamanya.",
                'category_id' => $matchReport?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Joao Pedro Adaptasi Cepat di Premier League',
                'excerpt' => 'Striker anyar Chelsea itu langsung tampil impresif di beberapa laga awal.',
                'body' => "Joao Pedro menunjukkan adaptasi yang cepat terhadap intensitas Premier League.\n\nKontribusi gol dan asisnya membantu lini serang Chelsea musim ini.",
                'category_id' => $clubNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Jorgensen Catatkan Clean Sheet Kelima Musim Ini',
                'excerpt' => 'Penampilan solid di bawah mistar membuat posisi Jorgensen semakin kuat.',
                'body' => "Filip Jorgensen kembali menjaga gawangnya tanpa kebobolan pada laga terbaru.\n\nIni menjadi clean sheet kelimanya sejak awal musim.",
                'category_id' => $matchReport?->id,
                'is_featured' => false,
            ],
        ];

        foreach ($articles as $i => $data) {
            $slug = Str::slug($data['title']);

            Article::firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $data['title'],
                    'excerpt' => $data['excerpt'],
                    'body' => $data['body'],
                    'tags' => $data['tags'] ?? null,
                    'quote_text' => $data['quote_text'] ?? null,
                    'quote_author' => $data['quote_author'] ?? null,
                    'match_stats' => $data['match_stats'] ?? null,
                    'cover_image' => $covers[$i % count($covers)],
                    'category_id' => $data['category_id'],
                    'author_id' => $author->id,
                    'is_featured' => $data['is_featured'],
                    'status' => 'published',
                    'published_at' => now()->subDays($i),
                    'views' => fake()->numberBetween(10, 500),
                ]
            );
        }
    }

    /**
     * @return list<string>
     */
    private function ensureCoverImages(): array
    {
        $paths = [];

        foreach (self::COVER_SOURCES as $source => $target) {
            $targetPath = 'covers/'.$target;

            if (! Storage::disk('public')->exists($targetPath)) {
                Storage::disk('public')->put(
                    $targetPath,
                    File::get(public_path('assets/news/'.$source))
                );
            }

            $paths[] = $targetPath;
        }

        return $paths;
    }
}
