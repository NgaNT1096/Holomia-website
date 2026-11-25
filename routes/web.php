<?php

use App\Http\Controllers\EditorController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\SiteController;
use Illuminate\Support\Facades\Route;

// Public pages in Vietnamese and English (paths in config/site_routes.php).
foreach (config('site_routes') as $page => $locales) {
    foreach ($locales as $locale => $meta) {
        Route::get($meta['path'], [SiteController::class, 'show'])
            ->defaults('page', $page)
            ->defaults('locale', $locale)
            ->name($locale === 'vi' ? $page : "$page.$locale");
    }
}

// Inline editor (logged-in admins only; CSRF comes from the web group).
Route::middleware(['auth', 'throttle:60,1'])->prefix('editor')->group(function () {
    Route::put('sections', [EditorController::class, 'save'])->name('editor.save');
    Route::post('upload', [EditorController::class, 'upload'])->name('editor.upload');
});

Route::post('/api/lead', [LeadController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('lead.store');
