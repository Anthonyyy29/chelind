<?php

use App\Models\Transfer;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('public listing returns transfers newest first', function () {
    $older = Transfer::factory()->create();
    $newer = Transfer::factory()->create();

    $response = $this->getJson('/api/transfers');

    $response->assertOk()->assertJsonCount(2, 'data');
    expect($response->json('data.0.id'))->toBe($newer->id)
        ->and($response->json('data.1.id'))->toBe($older->id);
});

test('guests cannot manage transfers', function () {
    $this->postJson('/api/admin/transfers', [])->assertUnauthorized();
});

test('authenticated user can create a transfer with fee and photo', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/admin/transfers', [
        'direction' => 'in',
        'is_loan' => false,
        'player_name' => 'Morgan Rogers',
        'position' => 'AM',
        'club_from' => 'Aston Villa',
        'club_to' => 'Chelsea FC',
        'fee' => 137.3,
        'photo' => UploadedFile::fake()->image('player.jpg'),
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.player_name', 'Morgan Rogers')
        ->assertJsonPath('data.direction', 'in')
        ->assertJsonPath('data.fee', 137.3);

    $transfer = Transfer::firstWhere('player_name', 'Morgan Rogers');

    expect((float) $transfer->fee)->toBe(137.3)
        ->and($transfer->photo)->not->toBeNull();

    Storage::disk('public')->assertExists($transfer->photo);
});

test('authenticated user can create a loan transfer without a fee', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/admin/transfers', [
        'direction' => 'out',
        'is_loan' => true,
        'player_name' => 'Alejandro Garnacho',
        'position' => 'LW',
        'club_from' => 'Chelsea FC',
        'club_to' => 'Aston Villa',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.is_loan', true)
        ->assertJsonPath('data.fee', null);
});

test('creating a transfer requires direction, player name, position, and clubs', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/admin/transfers', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['direction', 'player_name', 'position', 'club_from', 'club_to']);
});

test('authenticated user can update a transfer', function () {
    $transfer = Transfer::factory()->create(['player_name' => 'Old Name']);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson("/api/admin/transfers/{$transfer->id}", [
        'player_name' => 'New Name',
    ]);

    $response->assertOk()->assertJsonPath('data.player_name', 'New Name');
});

test('deleting a transfer also removes its photo', function () {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('player.jpg')->store('transfers', 'public');
    $transfer = Transfer::factory()->create(['photo' => $path]);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->deleteJson("/api/admin/transfers/{$transfer->id}")
        ->assertNoContent();

    Storage::disk('public')->assertMissing($path);
    $this->assertDatabaseMissing('transfers', ['id' => $transfer->id]);
});
