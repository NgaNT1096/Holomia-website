<?php

namespace App\Support;

use App\Models\Section;

/** Payload of every editable section (home page + global header/footer). */
class Sections
{
    public const LOCALES = ['vi', 'en'];

    /**
     * Guests get one resolved language and never receive hidden content;
     * editors get everything with all languages.
     */
    public static function payload(string $locale, bool $canEdit): array
    {
        // A removed text resolves to '' for visitors; editors keep it so it can be shown again.
        $pick = fn (array $v) => ! empty($v['removed']) ? '' : (($v[$locale] ?? '') !== '' ? $v[$locale] : ($v['vi'] ?? ''));

        $fields = fn (?array $f) => (object) ($canEdit ? ($f ?? []) : array_map($pick, $f ?? []));

        $images = fn (?array $set) => (object) collect($set ?? [])->map(function ($i) use ($canEdit, $pick) {
            $alt = $i['alt'] ?? [];
            $payload = Img::payload(['path' => $i['path'] ?? null, 'alt' => $pick($alt)]);

            return $payload && $canEdit ? $payload + ['path' => $i['path'], 'alts' => (object) $alt] : $payload;
        })->filter()->all();

        $sections = Section::with(['page', 'items'])->orderBy('page_id')->orderBy('sort')->orderBy('id')->get();

        if (! $canEdit) {
            $sections = $sections->filter(fn ($s) => $s->active && ! in_array($locale, $s->hidden_locales ?? [], true));
        }

        return $sections->values()->map(fn (Section $s) => [
            'id' => $s->id,
            'page' => $s->page->slug,
            'template' => $s->template,
            'active' => $s->active,
            'hiddenLocales' => $s->hidden_locales ?? [],
            'fields' => $fields($s->fields),
            'images' => $images($s->images),
            'items' => $s->items->filter(fn ($i) => $canEdit || $i->active)->values()->map(fn ($i) => [
                'id' => $i->id,
                'kind' => $i->kind,
                'active' => $i->active,
                'link' => $i->link,
                'icon' => $i->icon,
                'fields' => $fields($i->fields),
                'images' => $images($i->images),
            ])->all(),
        ])->all();
    }
}
