<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Insight extends Model
{
    protected static function booted(): void
    {
        static::saved(fn () => \App\Support\SiteData::flush());
        static::deleted(fn () => \App\Support\SiteData::flush());
    }

    protected $fillable = ['slug','category','read_time','date_label','title','summary','images','key_takeaways','body','sort','is_published'];

    protected function casts(): array
    {
        return ['images'=>'array','key_takeaways'=>'array','body'=>'array','is_published'=>'bool'];
    }
}
