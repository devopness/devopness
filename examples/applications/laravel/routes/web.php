<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome-minimal', [
        'app' => 'laravel',
        'bootedAt' => now()->toIso8601String(),
    ]);
});
