<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function show(Request $request)
    {
        // The section payload itself is a shared Inertia prop (HandleInertiaRequests).
        app()->setLocale($request->routeIs('home.en') ? 'en' : 'vi');

        return Inertia::render('Site', ['route' => 'home']);
    }
}
