<?php

use App\Models\SocialLink;

test('social links are returned ordered by sort_order', function () {
    SocialLink::factory()->create(['platform' => 'facebook', 'sort_order' => 2]);
    SocialLink::factory()->create(['platform' => 'instagram', 'sort_order' => 1]);

    $response = $this->getJson('/api/social-links');

    $response->assertOk()
        ->assertJsonPath('data.0.platform', 'instagram')
        ->assertJsonPath('data.1.platform', 'facebook');
});
