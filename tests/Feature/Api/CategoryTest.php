<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\User;

test('guests can list categories', function () {
    Category::factory()->count(3)->create();

    $response = $this->getJson('/api/categories');

    $response->assertOk()->assertJsonCount(3, 'data');
});

test('guests cannot manage categories', function () {
    $this->postJson('/api/admin/categories', ['name' => 'Transfer News'])->assertUnauthorized();
});

test('authenticated user can create a category with an auto-generated slug', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/admin/categories', [
        'name' => 'Transfer News',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Transfer News')
        ->assertJsonPath('data.slug', 'transfer-news');

    $this->assertDatabaseHas('categories', ['name' => 'Transfer News', 'slug' => 'transfer-news']);
});

test('creating a category with a duplicate name fails validation', function () {
    Category::factory()->create(['name' => 'Club News']);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/admin/categories', ['name' => 'Club News'])
        ->assertUnprocessable();
});

test('authenticated user can update a category', function () {
    $category = Category::factory()->create(['name' => 'Old Name']);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson("/api/admin/categories/{$category->id}", [
        'name' => 'New Name',
    ]);

    $response->assertOk()->assertJsonPath('data.slug', 'new-name');
});

test('deleting a category still used by articles is blocked', function () {
    $category = Category::factory()->create();
    Article::factory()->create(['category_id' => $category->id]);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->deleteJson("/api/admin/categories/{$category->id}")
        ->assertStatus(422);

    $this->assertDatabaseHas('categories', ['id' => $category->id]);
});

test('authenticated user can delete an unused category', function () {
    $category = Category::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->deleteJson("/api/admin/categories/{$category->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
