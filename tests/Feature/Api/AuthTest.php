<?php

use App\Models\Role;
use App\Models\User;

test('csrf-cookie endpoint bootstraps a session', function () {
    $response = $this->getJson('/api/csrf-cookie');

    $response->assertNoContent();
    expect($response->headers->getCookies())->not->toBeEmpty();
});

test('user can login with correct credentials', function () {
    $role = Role::factory()->create(['name' => 'admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertOk()->assertJsonPath('user.email', $user->email);
    $this->assertAuthenticatedAs($user);
});

test('user cannot login with wrong password', function () {
    $user = User::factory()->create();

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertUnprocessable();
    $this->assertGuest();
});

test('me endpoint requires authentication', function () {
    $response = $this->getJson('/api/me');

    $response->assertUnauthorized();
});

test('me endpoint returns the authenticated user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/me');

    $response->assertOk()->assertJsonPath('email', $user->email);
});

test('user can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/logout');

    $response->assertOk();
    $this->assertGuest();
});
