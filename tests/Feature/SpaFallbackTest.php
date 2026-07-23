<?php

test('root renders the SPA shell', function () {
    $this->get('/')->assertOk()->assertSee('id="app"', false);
});

test('arbitrary non-api paths fall back to the same SPA shell', function () {
    $this->get('/berita/some-slug')->assertOk()->assertSee('id="app"', false);
});

test('api paths are never swallowed by the catch-all', function () {
    $this->getJson('/api/ping')->assertOk()->assertJson(['pong' => true]);
});
