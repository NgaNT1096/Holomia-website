<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $primaryKey = 'key';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'json'];
    }

    public static function read(string $key, mixed $default = null): mixed
    {
        return static::find($key)?->value ?? $default;
    }

    public static function write(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /** Title and description of a public page: admin value, else the default in config/site_routes.php. */
    public static function seo(string $page, string $locale): array
    {
        $custom = static::read('seo', [])[$page][$locale] ?? [];
        $default = config('site_routes')[$page][$locale];

        return [
            'title' => ($custom['title'] ?? null) ?: $default['title'],
            'description' => ($custom['description'] ?? null) ?: $default['description'],
        ];
    }

    public static function logoUrl(): ?string
    {
        $path = static::read('logo');

        return $path ? '/storage/'.$path : null;
    }

    public static function faviconUrl(): ?string
    {
        $path = static::read('favicon');

        // The file name changes on every upload, so browsers do not keep the old icon.
        return $path ? '/storage/'.$path : null;
    }
}
