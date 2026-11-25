<?php

namespace App\Console\Commands;

use App\Models\CaseStudy;
use App\Models\ContentSection;
use App\Models\EventPackage;
use App\Models\Insight;
use App\Models\Section;
use App\Support\SiteData;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/**
 * Fills EMPTY English values from database/translations/en.json (matched on the Vietnamese text).
 * Existing English text is never overwritten, so it is safe to run again.
 */
class TranslateContent extends Command
{
    protected $signature = 'content:translate';

    protected $description = 'Fill missing English content from the draft translation file';

    private array $map = [];

    private int $filled = 0;

    private array $missing = [];

    public function handle(): int
    {
        $this->map = json_decode(File::get(database_path('translations/en.json')), true);

        foreach ([...Section::all(), ...ContentSection::all()] as $model) {
            $fields = $model->fields ?? [];
            foreach ($fields as $key => $value) {
                if (empty($value['en']) && ($en = $this->translate($value['vi'] ?? null))) {
                    $fields[$key]['en'] = $en;
                }
            }
            $images = $model->images ?? [];
            foreach ($images as $key => $image) {
                if (empty($image['alt']['en']) && ($en = $this->translate($image['alt']['vi'] ?? null))) {
                    $images[$key]['alt']['en'] = $en;
                }
            }
            $model->update(['fields' => $fields, 'images' => $images]);
        }

        $this->collection(CaseStudy::class, ['category_label', 'title', 'subtitle', 'location', 'headline_metric', 'problem', 'solution'], ['results']);
        $this->collection(EventPackage::class, ['name', 'scale', 'capacity_per_day', 'staffing', 'content_included', 'two_day_price', 'extra_day_price', 'recommended_for']);
        $this->collection(Insight::class, ['category', 'read_time', 'date_label', 'title', 'summary'], ['key_takeaways', 'body']);

        SiteData::flush();
        $this->info("Filled {$this->filled} English values.");
        if ($this->missing) {
            $this->warn(count($this->missing).' Vietnamese texts have no draft translation (edit them on /en/...?edit=1 or in admin):');
            foreach (array_slice(array_keys($this->missing), 0, 15) as $text) {
                $this->line('  - '.mb_strimwidth($text, 0, 100, '…'));
            }
        }

        return self::SUCCESS;
    }

    private function translate(?string $vi): ?string
    {
        if (! $vi) {
            return null;
        }
        if (isset($this->map[$vi])) {
            $this->filled++;

            return $this->map[$vi];
        }
        // Only report text that is clearly Vietnamese; brand names and numbers fall back as they are.
        if (preg_match('/[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/iu', $vi)) {
            $this->missing[$vi] = true;
        }

        return null;
    }

    private function collection(string $model, array $texts, array $lists = []): void
    {
        foreach ($model::all() as $record) {
            $en = $record->en ?? [];
            foreach ($texts as $key) {
                if (empty($en[$key]) && ($value = $this->translate($record->$key))) {
                    $en[$key] = $value;
                }
            }
            foreach ($lists as $key) {
                if (! empty($en[$key]) || ! $record->$key) {
                    continue;
                }
                $found = false;
                $list = array_map(function ($row) use (&$found) {
                    $vi = is_array($row) ? ($row['p'] ?? '') : $row;
                    $value = $this->translate($vi);
                    $found = $found || $value !== null;

                    return is_array($row) ? ['p' => $value ?? $vi] : ($value ?? $vi);
                }, $record->$key);
                if ($found) {
                    $en[$key] = $list;
                }
            }
            $record->en = $en;

            if (isset($record->images)) {
                $record->images = array_map(function ($image) {
                    if (empty($image['alt_en']) && ($value = $this->translate($image['alt'] ?? null))) {
                        $image['alt_en'] = $value;
                    }

                    return $image;
                }, $record->images);
            }
            $record->save();
        }
    }
}
