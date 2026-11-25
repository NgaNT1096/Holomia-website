<?php

namespace App\Filament\Resources\CaseStudies;

use App\Filament\Resources\CaseStudies\Pages\ManageCaseStudies;
use App\Models\CaseStudy;
use BackedEnum;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Select;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CaseStudyResource extends Resource
{
    protected static ?string $model = CaseStudy::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Dữ liệu';
    protected static ?string $navigationLabel = 'Dự án (Case study)';
    protected static ?string $modelLabel = 'Dự án (Case study)';
    protected static ?string $pluralModelLabel = 'Dự án (Case study)';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([

                TextInput::make('title')->label('Tiêu đề')->required()->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set, $get) => $get('slug') ?: $set('slug', \Illuminate\Support\Str::slug($state))),
                TextInput::make('slug')->required()->unique(ignoreRecord: true),
                Select::make('category')->label('Nhóm')->required()->options(['event'=>'Sự kiện','heritage'=>'Di sản','venue'=>'Mặt bằng']),
                TextInput::make('category_label')->label('Nhãn nhóm')->required(),
                TextInput::make('subtitle')->label('Phụ đề'),
                TextInput::make('location')->label('Địa điểm'),
                TextInput::make('headline_metric')->label('Chỉ số nổi bật'),
                Repeater::make('images')->label('Ảnh (ảnh đầu = ảnh đại diện; kéo để đổi thứ tự)')
                    ->schema([
                        FileUpload::make('path')->label('Ảnh')->image()->disk('public')->directory('uploads')
                            ->acceptedFileTypes(['image/jpeg','image/png','image/webp'])->maxSize(5120)->imageEditor()->required(),
                        TextInput::make('alt')->label('Mô tả ảnh (alt) — tuỳ chọn')->maxLength(200),
                        TextInput::make('alt_en')->label('Alt tiếng Anh — tuỳ chọn')->maxLength(200),
                    ])->reorderableWithDragAndDrop()->collapsible()->itemLabel(fn (array $state): ?string => $state['alt'] ?? null)
                    ->defaultItems(0)->addActionLabel('Thêm ảnh')->columnSpanFull(),
                Select::make('featured_span')->label('Kích thước thẻ')->options(['standard'=>'Thường','wide'=>'Rộng'])->default('standard')->required(),
                Textarea::make('problem')->label('Vấn đề')->rows(4)->columnSpanFull(),
                Textarea::make('solution')->label('Giải pháp')->rows(4)->columnSpanFull(),
                TagsInput::make('results')->label('Kết quả (Enter để thêm)')->columnSpanFull(),
                Section::make('Tiếng Anh (bỏ trống = hiện tiếng Việt)')->collapsible()->collapsed()->columnSpanFull()->schema([
                    TextInput::make('en.title')->label('Title'),
                    TextInput::make('en.category_label')->label('Category label'),
                    TextInput::make('en.subtitle')->label('Subtitle'),
                    TextInput::make('en.location')->label('Location'),
                    TextInput::make('en.headline_metric')->label('Headline metric'),
                    Textarea::make('en.problem')->label('Problem')->rows(3),
                    Textarea::make('en.solution')->label('Solution')->rows(3),
                    TagsInput::make('en.results')->label('Results'),
                ]),
                TextInput::make('sort')->label('Thứ tự')->numeric()->default(0),
                Toggle::make('is_published')->label('Hiển thị')->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                ImageColumn::make('images')->label('Ảnh')->state(fn ($record) => $record->images[0]['path'] ?? null)->disk('public')->imageHeight(40),
                TextColumn::make('title')->label('Tiêu đề')->searchable(),
                TextColumn::make('category_label')->label('Nhóm'),
                TextColumn::make('sort')->label('Thứ tự')->sortable(),
                IconColumn::make('is_published')->boolean()->label('Hiển thị'),
            ])
            ->defaultSort('sort')
            ->reorderable('sort')
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageCaseStudies::route('/'),
        ];
    }
}
