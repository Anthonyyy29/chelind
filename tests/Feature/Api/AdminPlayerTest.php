<?php

use App\Models\Player;
use App\Models\User;

test('guests cannot manage players', function () {
    $this->postJson('/api/admin/players', [])->assertUnauthorized();
});

test('authenticated user can list all players including inactive ones', function () {
    Player::factory()->create(['name' => 'Active Player', 'is_active' => true]);
    Player::factory()->create(['name' => 'Inactive Player', 'is_active' => false]);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/admin/players');

    $response->assertOk()->assertJsonCount(2, 'data');
});

test('authenticated user can create a player', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/admin/players', [
        'name' => 'Cole Palmer',
        'position' => 'Attacking Midfielder',
    ]);

    $response->assertCreated()->assertJsonPath('data.name', 'Cole Palmer');

    $this->assertDatabaseHas('players', ['name' => 'Cole Palmer']);
});

test('creating a player requires a name and position', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/admin/players', [])
        ->assertUnprocessable();
});

test('authenticated user can update a player', function () {
    $player = Player::factory()->create(['name' => 'Old Name']);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson("/api/admin/players/{$player->id}", [
        'name' => 'New Name',
    ]);

    $response->assertOk()->assertJsonPath('data.name', 'New Name');
});

test('authenticated user can delete a player', function () {
    $player = Player::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->deleteJson("/api/admin/players/{$player->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('players', ['id' => $player->id]);
});
