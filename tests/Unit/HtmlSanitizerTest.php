<?php

use App\Support\HtmlSanitizer;

test('keeps allowed tags', function () {
    $clean = HtmlSanitizer::clean('<p>Halo <strong>dunia</strong></p>');

    expect($clean)->toBe('<p>Halo <strong>dunia</strong></p>');
});

test('strips disallowed tags but keeps their text', function () {
    $clean = HtmlSanitizer::clean('<script>alert(1)</script><p>Aman</p>');

    expect($clean)->not->toContain('<script')
        ->and($clean)->toContain('Aman');
});

test('strips event handler attributes', function () {
    $clean = HtmlSanitizer::clean('<p onclick="alert(1)">Klik</p>');

    expect($clean)->not->toContain('onclick');
});

test('strips javascript scheme from links', function () {
    $clean = HtmlSanitizer::clean('<a href="javascript:alert(1)">Link</a>');

    expect($clean)->not->toContain('javascript:');
});

test('keeps safe link attributes', function () {
    $clean = HtmlSanitizer::clean('<a href="https://example.com">Link</a>');

    expect($clean)->toContain('href="https://example.com"');
});
