<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'show'])->name('home');
Route::get('/en', [\App\Http\Controllers\HomeController::class, 'show'])->name('home.en');

// Inline editor (logged-in admins only; CSRF comes from the web group).
Route::middleware(['auth', 'throttle:60,1'])->prefix('editor')->group(function () {
    Route::put('sections', [\App\Http\Controllers\EditorController::class, 'save'])->name('editor.save');
    Route::post('upload', [\App\Http\Controllers\EditorController::class, 'upload'])->name('editor.upload');
});

$pages = [
    '/nen-tang' => 'platform',
    '/giai-phap/su-kien' => 'solutions-event',
    '/giai-phap/mat-bang' => 'solutions-venue',
    '/giai-phap/du-an-rieng' => 'solutions-custom',
    '/du-an' => 'case-studies',
    '/showroom' => 'showroom',
    '/ve-chung-toi' => 'about',
];

foreach ($pages as $uri => $route) {
    Route::get($uri, fn () => Inertia::render('Site', ['route' => $route]))->name($route);
}

Route::post('/api/lead', [\App\Http\Controllers\LeadController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('lead.store');
