<?php

use App\Models\Page;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Everything left in `contents` becomes inline-editable sections, then the table is dropped:
 * texts → "text.<group>", image slots → "images", JSON blocks → sections with items.
 */
return new class extends Migration
{
    public function up(): void
    {
        $rows = DB::table('contents')->orderBy('key')->get();

        if ($rows->isNotEmpty()) {
            $page = Page::firstOrCreate(['slug' => '_site'], ['title' => 'Header & Footer']);
            $texts = [];
            $images = [];
            $blocks = [];

            foreach ($rows as $row) {
                if (str_starts_with($row->key, 'slot.')) {
                    $slot = substr($row->key, 5);
                    $set = json_decode($row->value ?? '[]', true) ?: [];
                    $gallery = str_ends_with($slot, '_frames');
                    foreach ($gallery ? $set : array_slice($set, 0, 1) as $i => $image) {
                        $images[$gallery ? "$slot.$i" : $slot] = [
                            'path' => $image['path'], 'alt' => ['vi' => $image['alt'] ?? ''],
                        ];
                    }
                } elseif ($row->type === 'json') {
                    $blocks[$row->key] = json_decode($row->value ?? '[]', true) ?: [];
                } else {
                    $parts = explode('.', $row->key);
                    $group = $parts[0] === 'data' ? "data.$parts[1]" : $parts[0];
                    $texts[$group][$row->key] = ['vi' => (string) $row->value];
                }
            }

            $section = fn (string $template, array $data) => $page->sections()->firstOrCreate(
                ['template' => $template],
                $data + ['fields' => [], 'images' => [], 'sort' => 10],
            );

            foreach ($texts as $group => $fields) {
                $section("text.$group", ['fields' => $fields]);
            }
            $section('images', ['images' => $images]);

            $lists = [
                'locations' => ['location', 'site.showroom_locations', ['city', 'name', 'address', 'hours']],
                'milestones' => ['milestone', 'site.about_milestones', ['year', 'title', 'detail']],
            ];
            foreach ($lists as $template => [$kind, $key, $names]) {
                $list = $section($template, []);
                if ($list->items()->exists()) {
                    continue;
                }
                foreach (array_values($blocks[$key] ?? []) as $sort => $entry) {
                    $fields = [];
                    foreach ($names as $name) {
                        $fields[$name] = ['vi' => (string) ($entry[$name] ?? '')];
                    }
                    $list->items()->create(['kind' => $kind, 'fields' => $fields, 'sort' => $sort]);
                }
            }
        }

        Schema::drop('contents');
    }

    public function down(): void
    {
        // Restore from a database backup if the old table is ever needed again.
    }
};
