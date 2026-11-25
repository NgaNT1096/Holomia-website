<?php

namespace App\Filament\Resources\Insights;

use App\Filament\Resources\Insights\Pages\ManageInsights;
use App\Models\Insight;
use BackedEnum;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TagsInput;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class InsightResource extends Resource
{
    protected static ?string $model = Insight::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Dữ liệu';
    protected static ?string $navigationLabel = 'Bài viết Insight';
    protected static ?string $modelLabel = 'Bài viết Insight';
    protected static ?string $pluralModelLabel = 'Bài viết Insight';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([

                TextInput::make('title')->label('Tiêu đề')->required()->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set, $get) => $get('slug') ?: $set('slug', \Illuminate\Support\Str::slug($state))),
                TextInput::make('slug')->required()->unique(ignoreRecord: true),
                TextInput::make('category')->label('Chuyên mục')->required(),
                TextInput::make('read_time')->label('Thời gian đọc'),
                TextInput::make('date_label')->label('Ngày (hiển thị)'),
                Textarea::make('summary')->label('Tóm tắt')->rows(3)->columnSpanFull(),
                Repeater::make('images')->label('Ảnh (ảnh đầu = ảnh đại diện; kéo để đổi thứ tự)')
                    ->schema([
                        FileUpload::make('path')->label('Ảnh')->image()->disk('public')->directory('uploads')
                            ->acceptedFileTypes(['image/jpeg','image/png','image/webp'])->maxSize(5120)->imageEditor()->required(),
                        TextInput::make('alt')->label('Mô tả ảnh (alt) — tuỳ chọn')->maxLength(200),
                    ])->reorderableWithDragAndDrop()->collapsible()->itemLabel(fn (array $state): ?string => $state['alt'] ?? null)
                    ->defaultItems(0)->addActionLabel('Thêm ảnh')->columnSpanFull(),
                TagsInput::make('key_takeaways')->label('Ý chính')->columnSpanFull(),
                Repeater::make('body')->label('Nội dung (các đoạn)')->simple(Textarea::make('p')->rows(3)->required())->columnSpanFull(),
                TextInput::make('sort')->label('Thứ tự')->numeric()->default(0),
                Toggle::make('is_published')->label('Hiển thị')->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('title')->label('Tiêu đề')->searchable(),
                TextColumn::make('category')->label('Chuyên mục'),
                TextColumn::make('date_label')->label('Ngày'),
                IconColumn::make('is_published')->boolean()->label('Hiển thị'),
            ])
            ->defaultSort('sort')
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
            'index' => ManageInsights::route('/'),
        ];
    }
}
