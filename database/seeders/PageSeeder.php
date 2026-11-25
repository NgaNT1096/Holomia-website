<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Initial content of the inline-edited sections (database/seeders/data/sections.json).
 * Existing sections are never overwritten.
 */
class PageSeeder extends Seeder
{
    public function run(): void
    {
        foreach (json_decode(File::get(database_path('seeders/data/sections.json')), true) as $p) {
            $page = Page::firstOrCreate(['slug' => $p['slug']], ['title' => $p['title']]);

            foreach ($p['sections'] as $data) {
                $items = $data['items'];
                unset($data['items']);
                $this->importImages($data['images'] ?? []);

                $section = $page->sections()->firstOrCreate(['template' => $data['template']], $data);
                if (! $section->wasRecentlyCreated) {
                    continue;
                }
                foreach ($items as $item) {
                    $this->importImages($item['images'] ?? []);
                    $section->items()->create($item);
                }
            }
        }
    }

    /** Copy bundled images (public/images) to where the snapshot expects them. */
    private function importImages(array $images): void
    {
        foreach ($images as $image) {
            $source = public_path('images/'.basename($image['path']));
            if (str_starts_with($image['path'], 'uploads/') && File::exists($source)) {
                Storage::disk('public')->put($image['path'], File::get($source));
            }
        }
    }
}
