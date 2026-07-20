<?php

use Illuminate\Support\Facades\Route;

route::get('/', function () {
    return view('home');
});

require __DIR__.'/settings.php';
