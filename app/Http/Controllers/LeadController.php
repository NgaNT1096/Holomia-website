<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Honeypot: bots fill the hidden "website" field; pretend success.
        if ($request->filled('website')) {
            return response()->json(['ok' => true]);
        }

        $data = $request->validate([
            'tag' => ['required', 'string', 'in:pitch-deck-download,agency-rate-card,venue-roi-excel,event-lead,venue-lead,custom-lead,living-lab'],
            'name' => ['nullable', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:30'],
            'company' => ['nullable', 'string', 'max:160'],
            'message' => ['nullable', 'string', 'max:3000'],
            'payload' => ['nullable', 'array'],
        ]);

        Lead::create($data + ['ip' => $request->ip()]);

        return response()->json(['ok' => true], 201);
    }
}
