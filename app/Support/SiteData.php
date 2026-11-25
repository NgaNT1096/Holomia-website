<?php

namespace App\Support;

use App\Models\CaseStudy;
use App\Models\EventPackage;
use App\Models\Insight;
use App\Support\Img;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

/** Builds the CMS payload shared with the React frontend (cached, flushed on any content change). */
class SiteData
{
    public const CACHE_KEY = 'site-data';

    public static function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/') || str_starts_with($path, 'http')
            ? $path
            : '/storage/'.$path;
    }

    public static function all(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return [
                'caseStudies' => CaseStudy::where('is_published', true)->orderBy('sort')->get()->map(fn ($c) => [
                    'id' => $c->slug, 'category' => $c->category, 'categoryLabel' => $c->category_label,
                    'title' => $c->title, 'subtitle' => $c->subtitle, 'location' => $c->location,
                    'headlineMetric' => $c->headline_metric, 'images' => Img::many($c->images),
                    'featuredSpan' => $c->featured_span, 'problem' => $c->problem, 'solution' => $c->solution,
                    'results' => $c->results ?? [],
                ])->values(),
                'eventPackages' => EventPackage::where('is_published', true)->orderBy('sort')->get()->map(fn ($p) => [
                    'id' => $p->slug, 'name' => $p->name, 'scale' => $p->scale, 'capacityPerDay' => $p->capacity_per_day,
                    'staffing' => $p->staffing, 'contentIncluded' => $p->content_included, 'twoDayPrice' => $p->two_day_price,
                    'extraDayPrice' => $p->extra_day_price, 'recommendedFor' => $p->recommended_for, 'highlighted' => $p->highlighted,
                ])->values(),
                'insights' => Insight::where('is_published', true)->orderBy('sort')->get()->map(fn ($a) => [
                    'id' => $a->slug, 'category' => $a->category, 'readTime' => $a->read_time, 'date' => $a->date_label,
                    'title' => $a->title, 'summary' => $a->summary, 'images' => Img::many($a->images), 'keyTakeaways' => $a->key_takeaways ?? [],
                    'body' => collect($a->body ?? [])->pluck('p')->all(),
                ])->values(),
            ];
        });
    }
}
