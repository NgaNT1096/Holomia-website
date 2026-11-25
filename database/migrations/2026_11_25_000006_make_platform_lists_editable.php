<?php

use App\Models\Page;
use App\Models\Section;
use Illuminate\Database\Migrations\Migration;

/**
 * Floor-plan sizes, hardware specs, shift report, video scenes and the "Holomia Custom" cards were
 * (partly) hardcoded. They become list sections, keeping edits already made.
 */
return new class extends Migration
{
    public function up(): void
    {
        $page = Page::where('slug', '_site')->first();
        if (! $page) {
            return; // fresh install: PageSeeder loads the finished structure
        }

        $text = fn (string $template) => $page->sections()->where('template', $template)->first()?->fields ?? [];
        $images = $page->sections()->where('template', 'images')->first();
        $bank = $images?->images ?? [];

        $list = fn (string $template, array $fields = []) => $page->sections()->firstOrCreate(
            ['template' => $template],
            ['fields' => $fields, 'images' => [], 'sort' => 10],
        );
        $add = function (Section $section, string $kind, array $rows) {
            if ($section->items()->where('kind', $kind)->exists()) {
                return;
            }
            foreach ($rows as $sort => $row) {
                $section->items()->create($row + ['kind' => $kind, 'sort' => $sort]);
            }
        };
        // Stored (possibly edited) value, otherwise the old in-code default.
        $value = fn (array $stored, string $key, string $default) => $stored[$key] ?? ['vi' => $default];

        // Floor-plan sizes
        $s = $text('text.data.VENUE_FOOTPRINTS');
        $defaults = [
            ['50 m²', '6 – 8 kính', '1.5 kW', '600+ lượt/ngày', 'Góc TTTM · Sự kiện'],
            ['120 m²', '12 – 15 kính', '2.0 kW', '1.500+ lượt/ngày', 'Landmark 81 · Arena'],
            ['300 m²', '24 – 100 kính', '3.5 kW', '2.000+ lượt/ngày', 'Sự kiện quốc gia'],
        ];
        $names = ['area', 'players', 'power', 'throughput', 'idealFor'];
        $add($list('footprints', ['heading' => ['vi' => 'Cấu hình đề xuất']]), 'footprint', array_map(
            fn ($row, $i) => ['fields' => collect($names)->mapWithKeys(
                fn ($n, $j) => [$n => $value($s, "data.VENUE_FOOTPRINTS.$i.$n", $row[$j])]
            )->all()],
            $defaults, array_keys($defaults),
        ));

        // Hardware specs
        $s = $text('text.data.HARDWARE_SPECS');
        $defaults = [
            ['Mặt bằng', '50 – 300 m²'], ['Thiết bị', 'Không dây · Không ba lô'],
            ['Điều phối', '1 Tablet · 100 Kính'], ['Điện năng', '~2.0 kW'],
        ];
        $add($list('specs'), 'spec', array_map(
            fn ($row, $i) => ['fields' => [
                'label' => $value($s, "data.HARDWARE_SPECS.$i.label", $row[0]),
                'value' => $value($s, "data.HARDWARE_SPECS.$i.value", $row[1]),
            ]],
            $defaults, array_keys($defaults),
        ));

        // Shift report (sample figures from the original design)
        $s = $text('text.data.SHIFT_LOGS');
        $defaults = [
            ['Ca sáng (09:00 – 13:00)', 'Holomia Journey', '28', '382', '100%'],
            ['Ca chiều (13:30 – 17:30)', 'Holomia Journey', '34', '468', '100%'],
            ['Ca tối (18:00 – 22:00)', 'Omega Arena', '22', '246', '100%'],
        ];
        $add($list('report'), 'shift', array_map(
            fn ($row, $i) => ['fields' => [
                'shift' => $value($s, "data.SHIFT_LOGS.$i.shift", $row[0]),
                'mode' => $value($s, "data.SHIFT_LOGS.$i.mode", $row[1]),
                'sessions' => ['vi' => $row[2]],
                'guests' => ['vi' => $row[3]],
                'uptime' => ['vi' => $row[4]],
            ]],
            $defaults, array_keys($defaults),
        ));

        // Video scenes (a slideshow of images with captions)
        $s = $text('text.data.VIDEO_CHANNELS');
        $videos = $list('videos', [
            'journeyVenue' => $value($s, 'data.VIDEO_CHANNELS.journey.venue', 'Bưu điện Hà Nội · Sơn Đoòng'),
            'arenaVenue' => $value($s, 'data.VIDEO_CHANNELS.arena.venue', 'Landmark 81 · Lotte Center'),
            'duration' => ['vi' => '00:18'],
            'playing' => ['vi' => 'Đang phát tự động'],
            'paused' => ['vi' => 'Đã tạm dừng'],
            'scene' => ['vi' => 'Cảnh'],
        ]);
        $captions = [
            'journey' => [
                'Tablet phát lệnh đồng loạt tới toàn bộ kính trong nhóm',
                'Đoàn khách tham quan trải nghiệm đồng bộ theo lượt 5 phút',
                'Tái hiện không gian Hang Sơn Đoòng & Di sản Việt Nam',
            ],
            'arena' => [
                'Chuyển sang sàn đấu không dây chỉ bằng 1 chạm trên Tablet',
                'Người chơi tự do di chuyển, đối kháng trực tiếp theo đội',
                'Sơ đồ mặt bằng tự định vị chính xác trong không gian 50–300 m²',
            ],
        ];
        foreach ($captions as $mode => $rows) {
            $add($videos, $mode, array_map(
                fn ($caption, $i) => [
                    'fields' => [
                        'caption' => $value($s, "data.VIDEO_CHANNELS.$mode.frames.$i.caption", $caption),
                        'timecode' => ['vi' => sprintf('00:%02d', $i * 6)],
                    ],
                    'images' => array_filter(['image' => $bank["platform.{$mode}_frames.$i"] ?? null]),
                ],
                $rows, array_keys($rows),
            ));
        }

        // "Holomia Custom" cards
        $solutions = $page->sections()->where('template', 'text.solutions')->first();
        $s = $solutions?->fields ?? [];
        $cards = [
            ['solutions.051', null, 'VR5D / VR9D', 'solutions.052', 'img.case_truong_son'],
            ['solutions.053', 'solutions.054', 'Vali VR Kit', 'solutions.055', 'img.case_son_doong'],
            ['solutions.056', 'solutions.057', 'Số hóa Di sản', 'solutions.058', 'img.case_vov'],
        ];
        $add($list('custom'), 'card', array_map(fn ($c) => [
            'fields' => [
                'tag' => $s[$c[0]] ?? ['vi' => ''],
                'title' => $c[1] ? $value($s, $c[1], $c[2]) : ['vi' => $c[2]],
                'description' => $s[$c[3]] ?? ['vi' => ''],
            ],
            'images' => array_filter(['image' => $bank[$c[4]] ?? null]),
        ], $cards));

        // Remove what has moved.
        $page->sections()->whereIn('template', [
            'text.data.VENUE_FOOTPRINTS', 'text.data.HARDWARE_SPECS', 'text.data.SHIFT_LOGS', 'text.data.VIDEO_CHANNELS',
        ])->delete();
        $images?->update(['images' => collect($bank)->reject(fn ($v, $k) => str_ends_with(preg_replace('/\.\d+$/', '', $k), '_frames'))->all()]);
        if ($solutions) {
            $solutions->update(['fields' => collect($s)->except(array_map(fn ($n) => "solutions.0$n", range(51, 58)))->all()]);
        }
    }

    public function down(): void
    {
        // Restore from a database backup if needed.
    }
};
