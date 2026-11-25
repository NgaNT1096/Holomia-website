<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPackage extends Model
{
    protected static function booted(): void
    {
        static::saved(fn () => \App\Support\SiteData::flush());
        static::deleted(fn () => \App\Support\SiteData::flush());
    }

    protected $fillable = ['slug','name','scale','capacity_per_day','staffing','content_included','two_day_price','extra_day_price','recommended_for','highlighted','sort','is_published'];

    protected function casts(): array
    {
        return ['highlighted'=>'bool','is_published'=>'bool'];
    }
}
