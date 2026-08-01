<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('public listing only returns published articles', function () {
    Article::factory()->create(['status' => 'draft']);
    Article::factory()->published()->create();

    $response = $this->getJson('/api/articles');

    $response->assertOk()->assertJsonCount(1, 'data');
});

test('public listing can be filtered by category slug', function () {
    $category = Category::factory()->create(['slug' => 'transfer-news']);
    $other = Category::factory()->create();

    Article::factory()->published()->create(['category_id' => $category->id]);
    Article::factory()->published()->create(['category_id' => $other->id]);

    $response = $this->getJson('/api/articles?category=transfer-news');

    $response->assertOk()->assertJsonCount(1, 'data');
});

test('public detail shows a published article by slug and increments views', function () {
    $article = Article::factory()->published()->create(['slug' => 'hello-world', 'views' => 0]);

    $response = $this->getJson('/api/articles/hello-world');

    $response->assertOk()->assertJsonPath('data.slug', 'hello-world');
    expect($article->fresh()->views)->toBe(1);
});

test('public detail 404s for a draft article', function () {
    $article = Article::factory()->create(['slug' => 'still-draft', 'status' => 'draft']);

    $this->getJson('/api/articles/still-draft')->assertNotFound();
});

test('guests cannot manage articles', function () {
    $this->postJson('/api/admin/articles', [])->assertUnauthorized();
});

test('admin listing includes drafts', function () {
    Article::factory()->create(['status' => 'draft']);
    Article::factory()->published()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/admin/articles');

    $response->assertOk()->assertJsonCount(2, 'data');
});

test('authenticated user can create an article with auto slug and cover image', function () {
    Storage::fake('public');

    $category = Category::factory()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/admin/articles', [
        'title' => 'Chelsea Menang Besar',
        'body' => "Isi berita paragraf pertama.\n\nParagraf kedua.",
        'category_id' => $category->id,
        'status' => 'published',
        'cover_image' => UploadedFile::fake()->image('cover.jpg'),
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.slug', 'chelsea-menang-besar')
        ->assertJsonPath('data.status', 'published');

    $article = Article::firstWhere('slug', 'chelsea-menang-besar');

    expect($article->author_id)->toBe($user->id)
        ->and($article->published_at)->not->toBeNull()
        ->and($article->cover_image)->not->toBeNull();

    Storage::disk('public')->assertExists($article->cover_image);
});

test('authenticated user can create an article with tags, quote, and match stats', function () {
    $category = Category::factory()->create();
    $user = User::factory()->create();

    $matchStats = [
        'home_team' => 'Chelsea FC',
        'away_team' => 'Tottenham Hotspur',
        'home_score' => '2',
        'away_score' => '1',
        'possession_home' => 58,
        'possession_away' => 42,
        'shots_home' => 7,
        'shots_away' => 4,
        'pass_home' => 91,
        'pass_away' => 84,
        'corners_home' => 6,
        'corners_away' => 3,
        'goalscorers_text' => "Son Heung-min 34' (Spurs)\nCole Palmer 58', 79' (Chelsea)",
    ];

    $response = $this->actingAs($user)->postJson('/api/admin/articles', [
        'title' => 'Derby London Dimenangkan Chelsea',
        'body' => 'Isi berita match report.',
        'category_id' => $category->id,
        'status' => 'published',
        'tags' => json_encode(['Chelsea', 'Premier League', 'Derby']),
        'quote_text' => 'Kemenangan ini penting untuk moral tim.',
        'quote_author' => 'ENZO MARESCA',
        'match_stats' => json_encode($matchStats),
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.tags', ['Chelsea', 'Premier League', 'Derby'])
        ->assertJsonPath('data.quote.text', 'Kemenangan ini penting untuk moral tim.')
        ->assertJsonPath('data.quote.author', 'ENZO MARESCA')
        ->assertJsonPath('data.match_stats.home_team', 'Chelsea FC')
        ->assertJsonPath('data.match_stats.possession_home', 58);

    $article = Article::firstWhere('slug', 'derby-london-dimenangkan-chelsea');

    expect($article->tags)->toBe(['Chelsea', 'Premier League', 'Derby'])
        ->and($article->quote_text)->toBe('Kemenangan ini penting untuk moral tim.')
        ->and($article->match_stats['away_team'])->toBe('Tottenham Hotspur');
});

test('authenticated user can update an article', function () {
    $article = Article::factory()->create(['title' => 'Judul Lama', 'status' => 'draft']);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson("/api/admin/articles/{$article->id}", [
        'title' => 'Judul Baru',
        'status' => 'published',
    ]);

    $response->assertOk()->assertJsonPath('data.slug', 'judul-baru');

    $article->refresh();
    expect($article->status)->toBe('published')
        ->and($article->published_at)->not->toBeNull();
});

test('deleting an article also removes its cover image', function () {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('cover.jpg')->store('covers', 'public');
    $article = Article::factory()->create(['cover_image' => $path]);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->deleteJson("/api/admin/articles/{$article->id}")
        ->assertNoContent();

    Storage::disk('public')->assertMissing($path);
    $this->assertDatabaseMissing('articles', ['id' => $article->id]);
});
