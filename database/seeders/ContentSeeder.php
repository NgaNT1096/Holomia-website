<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\EventPackage;
use App\Models\Insight;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ContentSeeder extends Seeder
{
    private function json(string $name): array
    {
        return json_decode(File::get(database_path("seeders/data/{$name}.json")), true);
    }

    /** Copy a seed image from public/images into the public disk, return stored path. */
    private function importImage(?string $url): ?string
    {
        if (! $url || ! str_starts_with($url, '/images/')) {
            return $url;
        }
        $src = public_path(ltrim($url, '/'));
        if (! File::exists($src)) {
            return null;
        }
        $dest = 'uploads/'.basename($src);
        Storage::disk('public')->put($dest, File::get($src));

        return $dest;
    }

    public function run(): void
    {
        foreach ($this->json('case_studies') as $i => $c) {
            CaseStudy::updateOrCreate(['slug' => $c['id']], [
                'category' => $c['category'], 'category_label' => $c['categoryLabel'],
                'title' => $c['title'], 'subtitle' => $c['subtitle'] ?? null, 'location' => $c['location'] ?? null,
                'headline_metric' => $c['headlineMetric'] ?? null,
                'images' => ($img = $this->importImage($c['image'] ?? null)) ? [['path' => $img, 'alt' => $c['imageAlt'] ?? '']] : [],
                'featured_span' => $c['featuredSpan'] ?? 'standard',
                'problem' => $c['problem'] ?? null, 'solution' => $c['solution'] ?? null,
                'results' => $c['results'] ?? [], 'sort' => $i,
            ]);
        }

        foreach ($this->json('event_packages') as $i => $p) {
            EventPackage::updateOrCreate(['slug' => $p['id']], [
                'name' => $p['name'], 'scale' => $p['scale'] ?? null, 'capacity_per_day' => $p['capacityPerDay'] ?? null,
                'staffing' => $p['staffing'] ?? null, 'content_included' => $p['contentIncluded'] ?? null,
                'two_day_price' => $p['twoDayPrice'] ?? null, 'extra_day_price' => $p['extraDayPrice'] ?? null,
                'recommended_for' => $p['recommendedFor'] ?? null, 'highlighted' => $p['highlighted'] ?? false, 'sort' => $i,
            ]);
        }

        foreach ($this->json('insight_articles') as $i => $a) {
            Insight::updateOrCreate(['slug' => $a['id']], [
                'category' => $a['category'], 'read_time' => $a['readTime'] ?? null, 'date_label' => $a['date'] ?? null,
                'title' => $a['title'], 'summary' => $a['summary'] ?? null,
                'key_takeaways' => $a['keyTakeaways'] ?? [],
                'body' => array_map(fn ($p) => ['p' => $p], $a['body'] ?? []), 'sort' => $i,
            ]);
        }
    }
}
