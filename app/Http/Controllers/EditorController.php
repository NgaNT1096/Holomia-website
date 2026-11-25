<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Support\History;
use App\Support\Img;
use App\Support\Sections;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/** Inline editor API. Every route is behind the `auth` middleware + CSRF. */
class EditorController extends Controller
{
    private const IMAGE_PATH = '#^(uploads/|/images/)[A-Za-z0-9_\-]+\.(jpe?g|png|webp)$#i';

    /** Internal path, http(s), mailto, tel, "#solutions" dropdown or a lead modal. Never javascript: etc. */
    private const LINK = '~^(/(?!/)[A-Za-z0-9_\-./?=&#%]*|https?://[^\s<>"\']+|mailto:[^\s<>"\']+|tel:[0-9+ .]+|#solutions|modal:(pitch-deck|agency-rate-card|roi-excel))$~i';

    public function save(Request $request): JsonResponse
    {
        $request->validate([
            'sections' => ['required', 'array', 'max:50'],
            'sections.*.id' => ['required', 'integer'],
            'sections.*.active' => ['required', 'boolean'],
            'sections.*.hiddenLocales' => ['present', 'array'],
            'sections.*.hiddenLocales.*' => [Rule::in(Sections::LOCALES)],
            'sections.*.fields' => ['present', 'array'],
            'sections.*.images' => ['present', 'array'],
            'sections.*.items' => ['present', 'array', 'max:60'],
        ]);

        History::track(function () use ($request) {
            $existing = Section::with('items')->get()->keyBy('id');
            $order = []; // position per page

            foreach ($request->input('sections') as $input) {
                $section = $existing->get($input['id']);
                abort_unless($section, 422, 'Section không tồn tại.');
                $order[$section->page_id] = ($order[$section->page_id] ?? -1) + 1;

                $section->update([
                    'sort' => $order[$section->page_id],
                    'active' => (bool) $input['active'],
                    'hidden_locales' => array_values($input['hiddenLocales']),
                    // Only keys the section already has can change.
                    'fields' => $this->fields($section->fields ?? [], $input['fields'], array_keys($section->fields ?? [])),
                    'images' => $this->images($section->images ?? [], $input['images'], array_keys($section->images ?? [])),
                ]);

                $this->syncItems($section, $input['items']);
            }
        });

        return response()->json(['ok' => true]);
    }

    private function syncItems(Section $section, array $items): void
    {
        $schema = config('section_templates')[$section->template] ?? [];
        $current = $section->items->keyBy('id');
        $kept = [];

        foreach (array_values($items) as $sort => $input) {
            $kind = $input['kind'] ?? '';
            abort_unless(isset($schema[$kind]), 422, 'Loại mục không hợp lệ.');

            $link = trim((string) ($input['link'] ?? ''));
            abort_if($link !== '' && ! preg_match(self::LINK, $link), 422, "Đường dẫn không hợp lệ: $link");

            // New items carry a negative temporary id.
            $item = $current->get($input['id'] ?? 0) ?? $section->items()->make(['kind' => $kind]);
            abort_if($item->exists && $item->kind !== $kind, 422, 'Loại mục không khớp.');

            $item->fill([
                'sort' => $sort,
                'active' => (bool) ($input['active'] ?? true),
                'link' => $link ?: null,
                'fields' => $this->fields($item->fields ?? [], $input['fields'] ?? [], $schema[$kind]['fields']),
                'images' => $this->images($item->images ?? [], $input['images'] ?? [], $schema[$kind]['images'], removable: true),
            ])->save();
            $kept[] = $item->id;
        }

        $section->items()->whereNotIn('id', $kept)->delete();
    }

    private function fields(array $stored, array $input, array $allowed): array
    {
        foreach ($allowed as $key) {
            if (array_key_exists('removed', $input[$key] ?? [])) {
                $stored[$key]['removed'] = (bool) $input[$key]['removed'];
            }
            foreach (Sections::LOCALES as $locale) {
                if (! array_key_exists($locale, $input[$key] ?? [])) {
                    continue;
                }
                $value = trim((string) $input[$key][$locale]);
                Validator::make(['v' => $value], ['v' => ['nullable', 'string', 'max:2000']])->validate();
                $stored[$key][$locale] = $value;
            }
        }

        return $stored;
    }

    private function images(array $stored, array $input, array $allowed, bool $removable = false): array
    {
        foreach ($allowed as $key) {
            if (! isset($input[$key])) {
                if ($removable) {
                    unset($stored[$key]);
                }

                continue;
            }
            $path = (string) ($input[$key]['path'] ?? '');
            abort_unless(preg_match(self::IMAGE_PATH, $path) && Img::absolute($path), 422, 'Ảnh không hợp lệ.');

            $alt = array_intersect_key((array) ($input[$key]['alts'] ?? []), array_flip(Sections::LOCALES));
            $stored[$key] = [
                'path' => $path,
                'alt' => array_map(fn ($a) => mb_substr((string) $a, 0, 200), $alt),
            ];
        }

        return $stored;
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate(['file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120']]);

        $path = $request->file('file')->store('uploads', 'public');
        $payload = Img::payload(['path' => $path]);

        if (! $payload) {
            Storage::disk('public')->delete($path);
            abort(422, 'Không đọc được ảnh.');
        }

        return response()->json($payload + ['path' => $path]);
    }
}
