<?php

namespace App\Support;

use App\Models\CaseStudy;
use App\Models\EventPackage;
use App\Models\Insight;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/** Collections shared with the React frontend, cached per language, flushed on any change. */
class SiteData
{
    private const CACHE_KEY = 'site-data';

    public static function flush(): void
    {
        foreach (Sections::LOCALES as $locale) {
            Cache::forget(self::CACHE_KEY.".$locale");
        }
    }

    public static function all(string $locale = 'vi'): array
    {
        return Cache::rememberForever(self::CACHE_KEY.".$locale", function () use ($locale) {
            // English value when present, otherwise the Vietnamese column.
            $v = fn (Model $m, string $key) => $locale === 'en' && filled($m->en[$key] ?? null) ? $m->en[$key] : $m->$key;
            $images = fn (?array $set) => Img::many(array_map(
                fn ($i) => $locale === 'en' && filled($i['alt_en'] ?? null) ? ['alt' => $i['alt_en']] + $i : $i,
                $set ?? [],
            ));

            return [
                'caseStudies' => CaseStudy::where('is_published', true)->orderBy('sort')->get()->map(fn ($c) => [
                    'id' => $c->slug, 'category' => $c->category, 'categoryLabel' => $v($c, 'category_label'),
                    'title' => $v($c, 'title'), 'subtitle' => $v($c, 'subtitle'), 'location' => $v($c, 'location'),
                    'headlineMetric' => $v($c, 'headline_metric'), 'images' => $images($c->images),
                    'featuredSpan' => $c->featured_span, 'problem' => $v($c, 'problem'), 'solution' => $v($c, 'solution'),
                    'results' => $v($c, 'results') ?? [],
                ])->values(),
                'eventPackages' => EventPackage::where('is_published', true)->orderBy('sort')->get()->map(fn ($p) => [
                    'id' => $p->slug, 'name' => $v($p, 'name'), 'scale' => $v($p, 'scale'),
                    'capacityPerDay' => $v($p, 'capacity_per_day'), 'staffing' => $v($p, 'staffing'),
                    'contentIncluded' => $v($p, 'content_included'), 'twoDayPrice' => $v($p, 'two_day_price'),
                    'extraDayPrice' => $v($p, 'extra_day_price'), 'recommendedFor' => $v($p, 'recommended_for'),
                    'highlighted' => $p->highlighted,
                ])->values(),
                'insights' => Insight::where('is_published', true)->orderBy('sort')->get()->map(fn ($a) => [
                    'id' => $a->slug, 'category' => $v($a, 'category'), 'readTime' => $v($a, 'read_time'),
                    'date' => $v($a, 'date_label'), 'title' => $v($a, 'title'), 'summary' => $v($a, 'summary'),
                    'images' => $images($a->images), 'keyTakeaways' => $v($a, 'key_takeaways') ?? [],
                    'body' => collect($v($a, 'body') ?? [])->pluck('p')->all(),
                ])->values(),
            ];
        });
    }
}
