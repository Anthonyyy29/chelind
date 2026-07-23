<?php

use App\Models\GameMatch;

test('default listing returns only scheduled matches ordered by nearest kickoff', function () {
    GameMatch::factory()->finished()->create();
    $later = GameMatch::factory()->create(['kickoff_at' => now()->addDays(10)]);
    $sooner = GameMatch::factory()->create(['kickoff_at' => now()->addDays(2)]);

    $response = $this->getJson('/api/matches');

    $response->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.id', $sooner->id)
        ->assertJsonPath('data.1.id', $later->id);
});

test('status=finished returns finished matches ordered by most recent', function () {
    GameMatch::factory()->create();
    $older = GameMatch::factory()->finished()->create(['kickoff_at' => now()->subDays(10)]);
    $recent = GameMatch::factory()->finished()->create(['kickoff_at' => now()->subDay()]);

    $response = $this->getJson('/api/matches?status=finished');

    $response->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.id', $recent->id)
        ->assertJsonPath('data.1.id', $older->id);
});

test('limit query param caps the number of results', function () {
    GameMatch::factory()->count(3)->create();

    $response = $this->getJson('/api/matches?limit=2');

    $response->assertOk()->assertJsonCount(2, 'data');
});
