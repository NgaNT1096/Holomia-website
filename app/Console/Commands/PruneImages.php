<?php

namespace App\Console\Commands;

use App\Models\CaseStudy;
use App\Models\Insight;
use App\Support\Img;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PruneImages extends Command
{
    protected $signature = 'images:prune {--dry-run : Only list files that would be deleted}';

    protected $description = 'Delete uploaded images and generated WebP variants that no record references any more';

    public function handle(): int
    {
        $used = collect();
        foreach (CaseStudy::pluck('images') as $set) {
            $used = $used->merge(collect($set)->pluck('path'));
        }
        foreach (Insight::pluck('images') as $set) {
            $used = $used->merge(collect($set)->pluck('path'));
        }
        foreach (\App\Models\Section::pluck('images') as $set) {
            $used = $used->merge(collect($set)->pluck('path'));
        }
        foreach (\App\Models\ContentSection::pluck('images') as $set) {
            $used = $used->merge(collect($set)->pluck('path'));
        }
        foreach (\App\Models\ContentChange::whereIn('type', ['image', 'item_deleted'])->get() as $change) {
            $values = [$change->old, $change->new];
            array_walk_recursive($values, function ($v, $k) use ($used) {
                $k === 'path' && $used->push($v);
            });
        }
        $used = $used->filter()->unique();
        $hashes = $used->map(fn ($p) => Img::key($p))->flip();

        $disk = Storage::disk('public');
        $dry = $this->option('dry-run');
        $removed = 0;

        foreach ($disk->files('uploads') as $file) {
            if (! $used->contains($file)) {
                $this->line(($dry ? '[dry] ' : '').'delete '.$file);
                $dry || $disk->delete($file);
                $removed++;
            }
        }
        foreach ($disk->allFiles('variants') as $file) {
            if (! isset($hashes[pathinfo($file, PATHINFO_FILENAME)])) {
                $dry || $disk->delete($file);
                $removed++;
            }
        }

        $this->info("$removed file(s) ".($dry ? 'would be ' : '').'removed.');

        return self::SUCCESS;
    }
}
