<?php

namespace App\Support;

use App\Models\ContentChange;
use App\Models\ContentSection;
use App\Models\Section;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/** Change log of inline-edited content, one row per changed value, each restorable on its own. */
class History
{
    private const SECTION_NAMES = [
        'hero' => 'Hero', 'partners' => 'Đối tác & số liệu', 'platform' => 'Nền tảng', 'pillars' => 'Mô hình triển khai',
        'cases' => 'Dự án', 'roi' => 'ROI', 'showroom' => 'Showroom', 'header' => 'Header', 'footer' => 'Footer',
        'footprints' => 'Cấu hình mặt bằng', 'specs' => 'Thông số thiết bị', 'report' => 'Báo cáo ca',
        'videos' => 'Video demo', 'custom' => 'Holomia Custom',
        'locations' => 'Địa điểm Showroom', 'milestones' => 'Cột mốc', 'images' => 'Ảnh dùng chung',
        'text.platform' => 'Nền tảng lõi', 'text.platformvideo' => 'Video demo', 'text.tablet' => 'Mô phỏng Tablet',
        'text.solutions' => 'Giải pháp', 'text.venue' => 'Giải pháp mặt bằng', 'text.roi' => 'Máy tính ROI',
        'text.cases' => 'Trang Dự án', 'text.showroom' => 'Trang Showroom', 'text.about' => 'Về Holomia',
        'text.lead' => 'Form tải tài liệu', 'text.livinglab' => 'Form đặt lịch',
    ];

    private const ITEM_ATTRS = ['kind', 'fields', 'images', 'link', 'icon', 'sort', 'active'];

    /** Runs $mutate and logs everything it changed. */
    public static function track(callable $mutate): void
    {
        DB::transaction(function () use ($mutate) {
            $before = self::snapshot();
            $mutate();
            self::record($before, self::snapshot());
        });
    }

    private static function snapshot(): array
    {
        return Section::with(['page', 'items'])->orderBy('page_id')->orderBy('sort')->orderBy('id')->get()
            ->mapWithKeys(fn (Section $s) => [$s->id => [
                'template' => $s->template,
                'page' => $s->page_id,
                'attrs' => ['active' => $s->active, 'hidden_locales' => $s->hidden_locales ?? []],
                'fields' => $s->fields ?? [],
                'images' => $s->images ?? [],
                'items' => $s->items->mapWithKeys(fn ($i) => [$i->id => $i->only(self::ITEM_ATTRS)])->all(),
            ]])->all();
    }

    private static function record(array $before, array $after): void
    {
        $batch = (string) Str::uuid();
        $log = fn (array $row) => ContentChange::create($row + ['batch' => $batch, 'user_id' => auth()->id()]);

        foreach ($after as $id => $now) {
            if (! isset($before[$id])) {
                continue;
            }
            $was = $before[$id];
            $name = self::SECTION_NAMES[$now['template']] ?? str_replace('text.data.', 'Dữ liệu ', $now['template']);
            $base = ['section_id' => $id, 'place' => $name];

            foreach ($now['attrs'] as $attr => $value) {
                if ($was['attrs'][$attr] != $value) {
                    $log($base + ['type' => 'attr', 'field' => $attr, 'old' => $was['attrs'][$attr], 'new' => $value]);
                }
            }
            self::diffContent($log, $base, $was, $now);

            foreach ($now['items'] as $itemId => $item) {
                $place = ['section_id' => $id, 'item_id' => $itemId, 'place' => "$name › ".self::itemName($item)];
                if (! isset($was['items'][$itemId])) {
                    $log($place + ['type' => 'item_added', 'new' => $item]);

                    continue;
                }
                $old = $was['items'][$itemId];
                foreach (['active', 'link'] as $attr) {
                    if ($old[$attr] != $item[$attr]) {
                        $log($place + ['type' => 'attr', 'field' => $attr, 'old' => $old[$attr], 'new' => $item[$attr]]);
                    }
                }
                self::diffContent($log, $place, $old, $item);
            }
            foreach (array_diff_key($was['items'], $now['items']) as $itemId => $item) {
                $log([
                    'section_id' => $id, 'item_id' => $itemId, 'place' => "$name › ".self::itemName($item),
                    'type' => 'item_deleted', 'old' => $item,
                ]);
            }

            $oldOrder = array_values(array_intersect(array_keys($was['items']), array_keys($now['items'])));
            $newOrder = array_values(array_intersect(array_keys($now['items']), array_keys($was['items'])));
            if ($oldOrder !== $newOrder) {
                $log($base + ['type' => 'order', 'field' => 'items', 'old' => $oldOrder, 'new' => $newOrder]);
            }
        }

        // Order of the sections inside each page.
        $orders = fn (array $snap) => collect($snap)->map(fn ($s, $id) => ['id' => $id, 'page' => $s['page']])
            ->groupBy('page')->map(fn ($g) => $g->pluck('id')->all())->all();
        $newOrders = $orders($after);
        foreach ($orders($before) as $page => $ids) {
            if (($newOrders[$page] ?? []) !== $ids) {
                $log(['type' => 'order', 'field' => 'sections', 'place' => 'Thứ tự khối trên trang', 'old' => $ids, 'new' => $newOrders[$page]]);
            }
        }
    }

    private static function diffContent(callable $log, array $base, array $was, array $now): void
    {
        foreach ($now['fields'] ?? [] as $key => $value) {
            $old = $was['fields'][$key] ?? [];
            foreach (Sections::LOCALES as $locale) {
                if (($old[$locale] ?? '') !== ($value[$locale] ?? '')) {
                    $log($base + ['type' => 'text', 'field' => $key, 'locale' => $locale, 'old' => $old[$locale] ?? '', 'new' => $value[$locale] ?? '']);
                }
            }
            if (! empty($old['removed']) !== ! empty($value['removed'])) {
                $text = $value['vi'] ?? '';
                $log($base + ['type' => 'removed', 'field' => $key, 'old' => ['removed' => ! empty($old['removed']), 'text' => $text], 'new' => ['removed' => ! empty($value['removed']), 'text' => $text]]);
            }
        }

        $keys = array_unique([...array_keys($was['images'] ?? []), ...array_keys($now['images'] ?? [])]);
        foreach ($keys as $key) {
            $old = $was['images'][$key] ?? null;
            $new = $now['images'][$key] ?? null;
            if ($old != $new) {
                $log($base + ['type' => 'image', 'field' => $key, 'old' => $old, 'new' => $new]);
            }
        }
    }

    private static function itemName(array $item): string
    {
        $f = $item['fields'] ?? [];
        foreach (['title', 'name', 'label', 'value'] as $key) {
            if (! empty($f[$key]['vi'])) {
                return Str::limit($f[$key]['vi'], 40);
            }
        }

        return $item['kind'] ?? 'mục';
    }

    /** Puts the old value of one change back. The restore itself is logged, so it can be undone too. */
    public static function restore(ContentChange $change): void
    {
        self::track(function () use ($change) {
            if ($change->type === 'order' && $change->field === 'sections') {
                foreach ($change->old as $sort => $id) {
                    Section::find($id)?->update(['sort' => $sort]);
                }

                return;
            }

            $section = Section::find($change->section_id) ?? throw new RuntimeException('Khối này không còn tồn tại.');

            if ($change->type === 'order') {
                foreach ($change->old as $sort => $id) {
                    $section->items()->find($id)?->update(['sort' => $sort]);
                }

                return;
            }
            if ($change->type === 'item_added') {
                $section->items()->find($change->item_id)?->delete();

                return;
            }
            if ($change->type === 'item_deleted') {
                if (! ContentSection::find($change->item_id)) {
                    // Same id, so older history rows of this item still apply.
                    (new ContentSection)->forceFill($change->old + ['id' => $change->item_id, 'section_id' => $section->id])->save();
                }

                return;
            }

            $target = $change->item_id
                ? ($section->items()->find($change->item_id) ?? throw new RuntimeException('Mục này đã bị xoá — hãy khôi phục mục trước.'))
                : $section;

            if ($change->type === 'attr') {
                $target->{$change->field} = $change->old;
            } elseif ($change->type === 'image') {
                $images = $target->images ?? [];
                if ($change->old) {
                    $images[$change->field] = $change->old;
                } else {
                    unset($images[$change->field]);
                }
                $target->images = $images;
            } else {
                $fields = $target->fields ?? [];
                if ($change->type === 'text') {
                    $fields[$change->field][$change->locale] = $change->old;
                } else {
                    $fields[$change->field]['removed'] = (bool) $change->old['removed'];
                }
                $target->fields = $fields;
            }
            $target->save();
        });
    }
}
