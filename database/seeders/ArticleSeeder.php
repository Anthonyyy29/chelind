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
                'body' => '<p>Chelsea sempat tertinggal lebih dulu sebelum berbalik unggul lewat dua gol di babak kedua.</p><p>Kemenangan ini menjaga tren positif Chelsea dalam beberapa laga tandang terakhir.</p>',
                'category_id' => $matchReport?->id,
                'is_featured' => true,
            ],
            [
                'title' => 'Enzo Fernandez Perpanjang Kontrak Hingga 2029',
                'excerpt' => 'Gelandang asal Argentina itu resmi mengikat masa depannya bersama Chelsea.',
                'body' => '<p>Enzo Fernandez menandatangani perpanjangan kontrak jangka panjang bersama klub.</p><p>Manajemen klub menyebut keputusan ini sebagai bagian dari rencana jangka panjang skuad.</p>',
                'category_id' => $transferNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Rumor Transfer: Chelsea Diklaim Incar Gelandang Muda Brasil',
                'excerpt' => 'Nama gelandang muda dari Brasil mulai dikaitkan dengan Stamford Bridge.',
                'body' => '<p>Sejumlah media Eropa melaporkan ketertarikan Chelsea terhadap seorang gelandang muda Brasil.</p><p>Hingga saat ini belum ada konfirmasi resmi dari pihak klub.</p>',
                'category_id' => $transferNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Cole Palmer Cetak Hat-trick di Kemenangan Piala Liga',
                'excerpt' => 'Palmer tampil cemerlang dengan tiga gol dalam satu laga di kompetisi Piala Liga.',
                'body' => '<p>Cole Palmer menjadi bintang lapangan usai mencetak hat-trick pertamanya musim ini.</p><p>Pelatih memuji konsistensi performa Palmer sepanjang musim.</p>',
                'category_id' => $matchReport?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Maresca Bicara Soal Rotasi Skuad Jelang Laga Padat',
                'excerpt' => 'Pelatih Chelsea menekankan pentingnya manajemen rotasi di tengah jadwal padat.',
                'body' => '<p>Enzo Maresca menyampaikan rencana rotasi pemain menjelang serangkaian laga di berbagai kompetisi.</p><p>Ia menegaskan seluruh skuad tetap dalam kondisi siap tempur.</p>',
                'category_id' => $clubNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Preview Derby London: Chelsea vs Tottenham',
                'excerpt' => 'Duel panas London akan tersaji akhir pekan ini di Stamford Bridge.',
                'body' => '<p>Derby London antara Chelsea dan Tottenham selalu menjadi laga yang dinantikan suporter kedua klub.</p><p>Kedua tim sama-sama membutuhkan kemenangan untuk menjaga posisi di klasemen.</p>',
                'category_id' => $matchReport?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Chelind Community Gelar Nonton Bareng di 5 Kota',
                'excerpt' => 'Komunitas suporter Chelsea Indonesia mengadakan acara nonton bareng serentak.',
                'body' => '<p>Chelind menggelar acara nonton bareng di lima kota besar untuk mempererat komunitas suporter.</p><p>Acara ini terbuka untuk umum dan mendapat antusiasme tinggi dari para fans.</p>',
                'category_id' => $clubNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Analisis Taktik: Bagaimana Chelsea Menang Penguasaan Bola',
                'excerpt' => 'Pendekatan taktik Maresca membuat Chelsea unggul dalam penguasaan bola musim ini.',
                'body' => '<p>Statistik musim ini menunjukkan peningkatan signifikan pada rata-rata penguasaan bola Chelsea.</p><p>Pola build-up dari lini belakang menjadi salah satu kunci utamanya.</p>',
                'category_id' => $matchReport?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Joao Pedro Adaptasi Cepat di Premier League',
                'excerpt' => 'Striker anyar Chelsea itu langsung tampil impresif di beberapa laga awal.',
                'body' => '<p>Joao Pedro menunjukkan adaptasi yang cepat terhadap intensitas Premier League.</p><p>Kontribusi gol dan asisnya membantu lini serang Chelsea musim ini.</p>',
                'category_id' => $clubNews?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Jorgensen Catatkan Clean Sheet Kelima Musim Ini',
                'excerpt' => 'Penampilan solid di bawah mistar membuat posisi Jorgensen semakin kuat.',
                'body' => '<p>Filip Jorgensen kembali menjaga gawangnya tanpa kebobolan pada laga terbaru.</p><p>Ini menjadi clean sheet kelimanya sejak awal musim.</p>',
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
