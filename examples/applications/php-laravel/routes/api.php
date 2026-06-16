<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function (Request $request) {
    return response()->json([
        'ok' => true,
        'app' => 'laravel',
        'ts' => now()->valueOf(),
        'php' => PHP_VERSION,
        'laravel' => app()->version(),
    ]);
});
