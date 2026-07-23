<?php

afterEach(function () {
    @unlink(public_path('index.html'));
});

test('root shows a placeholder when the SPA has not been built yet', function () {
    expect(file_exists(public_path('index.html')))->toBeFalse();

    $this->get('/')->assertOk()->assertSee('belum di-build');
});

test('arbitrary non-api paths fall back to the same handler', function () {
    $this->get('/berita/some-slug')->assertOk()->assertSee('belum di-build');
});

test('api paths are never swallowed by the catch-all', function () {
    $this->getJson('/api/ping')->assertOk()->assertJson(['pong' => true]);
});

test('once the SPA is built, its index.html is served', function () {
    file_put_contents(public_path('index.html'), '<html><body>Chelind SPA</body></html>');

    $this->get('/')->assertOk()->assertSee('Chelind SPA');
});
