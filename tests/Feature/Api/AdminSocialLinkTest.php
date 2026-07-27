<?php

use App\Models\SocialLink;
use App\Models\User;

test('guests cannot manage social links', function () {
    $this->postJson('/api/admin/social-links', [])->assertUnauthorized();
});

test('authenticated user can list social links ordered by sort_order', function () {
    SocialLink::factory()->create(['platform' => 'facebook', 'sort_order' => 2]);
    SocialLink::factory()->create(['platform' => 'instagram', 'sort_order' => 1]);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/admin/social-links');

    $response->assertOk()
        ->assertJsonPath('data.0.platform', 'instagram')
        ->assertJsonPath('data.1.platform', 'facebook');
});

test('authenticated user can create a social link', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/admin/social-links', [
        'platform' => 'discord',
        'handle' => 'Chelind Community',
        'url' => 'https://discord.gg/chelind',
        'description' => 'Server Discord komunitas',
        'sort_order' => 6,
    ]);

    $response->assertCreated()->assertJsonPath('data.platform', 'discord');

    $this->assertDatabaseHas('social_links', ['platform' => 'discord', 'handle' => 'Chelind Community']);
});

test('creating a social link requires a valid url', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/admin/social-links', ['platform' => 'discord', 'handle' => 'x', 'url' => 'not-a-url'])
        ->assertUnprocessable();
});

test('authenticated user can update a social link', function () {
    $link = SocialLink::factory()->create(['handle' => '@old']);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson("/api/admin/social-links/{$link->id}", [
        'handle' => '@new',
    ]);

    $response->assertOk()->assertJsonPath('data.handle', '@new');
});

test('authenticated user can delete a social link', function () {
    $link = SocialLink::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->deleteJson("/api/admin/social-links/{$link->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('social_links', ['id' => $link->id]);
});
