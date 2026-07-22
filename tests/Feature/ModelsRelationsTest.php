<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\GameMatch;
use App\Models\Role;
use App\Models\User;

test('user belongs to a role', function () {
    $role = Role::factory()->create(['name' => 'master']);
    $user = User::factory()->create(['role_id' => $role->id]);

    expect($user->role)->toBeInstanceOf(Role::class)
        ->and($user->role->name)->toBe('master')
        ->and($role->users)->toHaveCount(1);
});

test('article belongs to a category and an author', function () {
    $category = Category::factory()->create(['name' => 'Transfer News']);
    $author = User::factory()->create();
    $article = Article::factory()->create([
        'category_id' => $category->id,
        'author_id' => $author->id,
    ]);

    expect($article->category->is($category))->toBeTrue()
        ->and($article->author->is($author))->toBeTrue()
        ->and($category->articles)->toHaveCount(1);
});

test('article published scope only returns published articles', function () {
    Article::factory()->create(['status' => 'draft']);
    Article::factory()->published()->create();

    expect(Article::published()->count())->toBe(1);
});

test('game match scheduled and finished scopes filter by status', function () {
    GameMatch::factory()->create(['status' => 'SCHEDULED']);
    GameMatch::factory()->finished()->create();

    expect(GameMatch::scheduled()->count())->toBe(1)
        ->and(GameMatch::finished()->count())->toBe(1);
});
