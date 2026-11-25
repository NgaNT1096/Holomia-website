<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteController extends Controller
{
    public function show(Request $request)
    {
        $page = $request->route()->defaults['page'];
        $locale = $request->route()->defaults['locale'];
        // Shared props (sections, collections) are resolved afterwards and follow this locale.
        app()->setLocale($locale);

        $routes = config('site_routes')[$page];

        return Inertia::render('Site', ['route' => $page, 'title' => $routes[$locale]['title']])->withViewData(['seo' => [
            'title' => $routes[$locale]['title'],
            'description' => $routes[$locale]['description'],
            'canonical' => url($routes[$locale]['path']),
            'alternates' => ['vi' => url($routes['vi']['path']), 'en' => url($routes['en']['path'])],
        ]]);
    }
}
