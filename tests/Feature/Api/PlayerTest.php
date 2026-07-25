<?php

use App\Models\Player;

test('public players endpoint only lists active players ordered by name', function () {
    Player::factory()->create(['name' => 'Zico', 'is_active' => true]);
    Player::factory()->create(['name' => 'Ana', 'is_active' => true]);
    Player::factory()->create(['name' => 'Benched', 'is_active' => false]);

    $response = $this->getJson('/api/players');

    $response->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.name', 'Ana')
        ->assertJsonPath('data.1.name', 'Zico');
});
