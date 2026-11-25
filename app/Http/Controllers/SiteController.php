<?php

namespace App\Http\Controllers;

use App\Models\Setting;
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
        $seo = Setting::seo($page, $locale);

        return Inertia::render('Site', ['route' => $page, 'title' => $seo['title']])->withViewData(['seo' => [
            ...$seo,
            'favicon' => Setting::faviconUrl(),
            'canonical' => url($routes[$locale]['path']),
            'alternates' => ['vi' => url($routes['vi']['path']), 'en' => url($routes['en']['path'])],
        ]]);
    }
}
