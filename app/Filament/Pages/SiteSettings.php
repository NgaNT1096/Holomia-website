<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

/** Logo, favicon and the browser title / description of every public page. */
class SiteSettings extends Page implements HasSchemas
{
    use InteractsWithSchemas;

    protected string $view = 'filament.pages.site-settings';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'Nội dung website';

    protected static ?string $navigationLabel = 'Logo, tiêu đề & favicon';

    protected static ?string $title = 'Logo, tiêu đề & favicon';

    private const PAGES = [
        'home' => 'Trang chủ', 'platform' => 'Nền tảng lõi', 'solutions-event' => 'Giải pháp: Sự kiện',
        'solutions-venue' => 'Giải pháp: Mặt bằng', 'solutions-custom' => 'Giải pháp: Dự án riêng',
        'case-studies' => 'Dự án', 'showroom' => 'Showroom', 'about' => 'Về Holomia & Tin tức',
    ];

    public ?array $data = [];

    public function mount(): void
    {
        // Show what the site currently uses, so the text can be edited in place.
        $seo = [];
        foreach (array_keys(self::PAGES) as $page) {
            foreach (['vi', 'en'] as $locale) {
                $seo[$page][$locale] = Setting::seo($page, $locale);
            }
        }
        $this->form->fill(['logo' => Setting::read('logo'), 'favicon' => Setting::read('favicon'), 'seo' => $seo]);
    }

    public function form(Schema $schema): Schema
    {
        $pages = [];
        foreach (self::PAGES as $key => $label) {
            $columns = [];
            foreach (['vi' => 'Tiếng Việt', 'en' => 'Tiếng Anh'] as $locale => $language) {
                $columns[] = Grid::make(1)->schema([
                    TextInput::make("seo.$key.$locale.title")->label("Tiêu đề ($language)")
                        ->maxLength(120),
                    Textarea::make("seo.$key.$locale.description")->label("Mô tả ($language)")
                        ->rows(3)->maxLength(300),
                ])->columnSpan(1);
            }
            $pages[] = Section::make($label)->description(config('site_routes')[$key]['vi']['path'])
                ->schema($columns)->columns(2)->collapsible()->collapsed($key !== 'home');
        }

        return $schema->statePath('data')->components([
            Section::make('Logo')->description('Hiện ở header và footer thay cho chữ HOLOMIA. PNG hoặc WebP nền trong suốt, nên cao từ 80px, tối đa 1MB. Website nền tối nên dùng logo màu sáng.')
                ->schema([
                    // No SVG: it can carry scripts.
                    FileUpload::make('logo')->hiddenLabel()->disk('public')->directory('brand')
                        ->acceptedFileTypes(['image/png', 'image/webp', 'image/jpeg'])
                        ->maxSize(1024),
                ]),
            Section::make('Favicon')->description('Biểu tượng trên tab trình duyệt. Ảnh vuông PNG hoặc ICO, nên từ 192×192, tối đa 512KB.')
                ->schema([
                    // No SVG: it can carry scripts.
                    FileUpload::make('favicon')->hiddenLabel()->disk('public')->directory('favicon')
                        ->acceptedFileTypes(['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'])
                        ->maxSize(512),
                ]),
            ...$pages,
        ]);
    }

    public function save(): void
    {
        $state = $this->form->getState();

        Setting::write('logo', $state['logo'] ?? null);
        Setting::write('favicon', $state['favicon'] ?? null);
        // Keep only what differs from the defaults; a cleared field goes back to its default.
        $seo = [];
        foreach ($state['seo'] ?? [] as $page => $locales) {
            foreach ($locales as $locale => $values) {
                foreach ($values as $name => $value) {
                    if (filled($value) && trim($value) !== config('site_routes')[$page][$locale][$name]) {
                        $seo[$page][$locale][$name] = trim($value);
                    }
                }
            }
        }
        Setting::write('seo', $seo);
        $this->mount();

        Notification::make()->title('Đã lưu — tải lại website để thấy thay đổi')->success()->send();
    }
}
