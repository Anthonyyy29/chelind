<?php

use App\Models\Role;
use App\Models\User;

function masterUser(): User
{
    $role = Role::firstOrCreate(['name' => 'master']);

    return User::factory()->create(['role_id' => $role->id]);
}

function adminUser(): User
{
    $role = Role::firstOrCreate(['name' => 'admin']);

    return User::factory()->create(['role_id' => $role->id]);
}

test('guests cannot manage users', function () {
    $this->getJson('/api/admin/users')->assertUnauthorized();
});

test('non-master users are forbidden from managing accounts', function () {
    $admin = adminUser();

    $this->actingAs($admin)->getJson('/api/admin/users')->assertForbidden();
});

test('master can list all accounts', function () {
    $master = masterUser();
    adminUser();

    $response = $this->actingAs($master)->getJson('/api/admin/users');

    $response->assertOk()->assertJsonCount(2, 'data');
});

test('master can list roles', function () {
    $master = masterUser();
    Role::firstOrCreate(['name' => 'admin']);

    $response = $this->actingAs($master)->getJson('/api/admin/roles');

    $response->assertOk();
    expect(collect($response->json('data'))->pluck('name'))
        ->toContain('master', 'admin');
});

test('master can create a new account', function () {
    $master = masterUser();
    $adminRole = Role::firstOrCreate(['name' => 'admin']);

    $response = $this->actingAs($master)->postJson('/api/admin/users', [
        'name' => 'New Admin',
        'email' => 'newadmin@chelind.test',
        'password' => 'password123',
        'role_id' => $adminRole->id,
    ]);

    $response->assertCreated()->assertJsonPath('data.email', 'newadmin@chelind.test');

    $this->assertDatabaseHas('users', ['email' => 'newadmin@chelind.test']);
});

test('creating an account requires a unique email and valid role', function () {
    $master = masterUser();

    $this->actingAs($master)
        ->postJson('/api/admin/users', [
            'name' => 'X',
            'email' => $master->email,
            'password' => 'password123',
            'role_id' => 999,
        ])
        ->assertUnprocessable();
});

test('master can update an account without changing the password', function () {
    $master = masterUser();
    $target = adminUser();
    $originalPassword = $target->password;

    $response = $this->actingAs($master)->putJson("/api/admin/users/{$target->id}", [
        'name' => 'Updated Name',
    ]);

    $response->assertOk()->assertJsonPath('data.name', 'Updated Name');
    expect($target->fresh()->password)->toBe($originalPassword);
});

test('master cannot delete their own account', function () {
    $master = masterUser();

    $this->actingAs($master)
        ->deleteJson("/api/admin/users/{$master->id}")
        ->assertUnprocessable();
});

test('master can delete another admin account', function () {
    $master = masterUser();
    $target = adminUser();

    $this->actingAs($master)
        ->deleteJson("/api/admin/users/{$target->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('users', ['id' => $target->id]);
});
