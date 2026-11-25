<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * Turns a stored image ({path, alt}) into a responsive payload.
 * WebP variants (480/960/1600) are generated lazily with GD on first use and cached on disk.
 * Re-encoding also strips EXIF metadata.
 */
class Img
{
    public const WIDTHS = [480, 960, 1600];

    public static function absolute(string $path): ?string
    {
        $file = str_starts_with($path, '/')
            ? public_path(ltrim($path, '/'))
            : Storage::disk('public')->path($path);

        return is_file($file) ? $file : null;
    }

    public static function key(string $path): string
    {
        return md5($path);
    }

    /** @return array{src:string,srcset:string,width:int,height:int,alt:string}|null */
    public static function payload(?array $item): ?array
    {
        $path = $item['path'] ?? null;
        if (! $path) {
            return null;
        }
        $alt = (string) ($item['alt'] ?? '');
        if (str_starts_with($path, 'http')) {
            return ['src' => $path, 'srcset' => '', 'width' => 0, 'height' => 0, 'alt' => $alt];
        }

        $file = self::absolute($path);
        if (! $file || ! ($size = @getimagesize($file))) {
            return null;
        }
        [$ow, $oh] = $size;
        $disk = Storage::disk('public');
        $hash = self::key($path);
        $srcset = [];
        $best = null;

        foreach (self::WIDTHS as $w) {
            $w = min($w, $ow);
            $rel = "variants/$w/$hash.webp";
            if (! $disk->exists($rel) && ! self::makeVariant($file, $disk->path($rel), $w)) {
                continue;
            }
            $srcset[$w] = '/storage/'.$rel." {$w}w";
            if ($w <= 960 || ! $best) {
                $best = '/storage/'.$rel;
            }
        }

        // Fall back to the original if GD could not produce variants.
        $src = $best ?? (str_starts_with($path, '/') ? $path : '/storage/'.$path);

        return [
            'src' => $src,
            'srcset' => implode(', ', $srcset),
            'width' => min(960, $ow),
            'height' => (int) round(min(960, $ow) * $oh / $ow),
            'alt' => $alt,
        ];
    }

    private static function makeVariant(string $file, string $dest, int $w): bool
    {
        $data = @file_get_contents($file);
        $im = $data ? @imagecreatefromstring($data) : false;
        if (! $im) {
            return false;
        }
        if (imagesx($im) > $w) {
            $im = imagescale($im, $w, -1, IMG_BICUBIC);
        }
        imagepalettetotruecolor($im);
        imagealphablending($im, true);
        imagesavealpha($im, true);
        @mkdir(dirname($dest), 0755, true);
        $ok = imagewebp($im, $dest, 80);
        imagedestroy($im);

        return $ok;
    }

    public static function many(?array $items): array
    {
        return collect($items ?: [])->map(fn ($i) => self::payload($i))->filter()->values()->all();
    }
}
