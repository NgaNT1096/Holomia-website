<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    protected static function booted(): void
    {
        static::saved(fn () => \App\Support\SiteData::flush());
        static::deleted(fn () => \App\Support\SiteData::flush());
    }

    protected $fillable = ['slug','category','category_label','title','subtitle','location','headline_metric','images','featured_span','problem','solution','results','sort','is_published'];

    protected function casts(): array
    {
        return ['results'=>'array','images'=>'array','is_published'=>'bool'];
    }
}
