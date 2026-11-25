<?php

namespace App\Filament\Resources\EventPackages;

use App\Filament\Resources\EventPackages\Pages\ManageEventPackages;
use App\Models\EventPackage;
use BackedEnum;
use Filament\Schemas\Components\Section;
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

class EventPackageResource extends Resource
{
    protected static ?string $model = EventPackage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Dữ liệu';
    protected static ?string $navigationLabel = 'Gói sự kiện';
    protected static ?string $modelLabel = 'Gói sự kiện';
    protected static ?string $pluralModelLabel = 'Gói sự kiện';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([

                TextInput::make('name')->label('Tên gói')->required()->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set, $get) => $get('slug') ?: $set('slug', \Illuminate\Support\Str::slug($state))),
                TextInput::make('slug')->required()->unique(ignoreRecord: true),
                TextInput::make('scale')->label('Quy mô'),
                TextInput::make('capacity_per_day')->label('Công suất / ngày'),
                TextInput::make('staffing')->label('Nhân sự'),
                TextInput::make('two_day_price')->label('Giá 2 ngày'),
                TextInput::make('extra_day_price')->label('Giá ngày thêm'),
                TextInput::make('recommended_for')->label('Phù hợp cho'),
                Textarea::make('content_included')->label('Nội dung bao gồm')->rows(3)->columnSpanFull(),
                Toggle::make('highlighted')->label('Gói nổi bật'),
                Section::make('Tiếng Anh (bỏ trống = hiện tiếng Việt)')->collapsible()->collapsed()->columnSpanFull()->schema([
                    TextInput::make('en.name')->label('Name'),
                    TextInput::make('en.scale')->label('Scale'),
                    TextInput::make('en.capacity_per_day')->label('Guests per day'),
                    TextInput::make('en.staffing')->label('Staff'),
                    TextInput::make('en.two_day_price')->label('2-day price'),
                    TextInput::make('en.extra_day_price')->label('Extra day price'),
                    TextInput::make('en.recommended_for')->label('Recommended for'),
                    Textarea::make('en.content_included')->label('Content included')->rows(3),
                ]),
                TextInput::make('sort')->label('Thứ tự')->numeric()->default(0),
                Toggle::make('is_published')->label('Hiển thị')->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('name')->label('Gói')->searchable(),
                TextColumn::make('two_day_price')->label('Giá 2 ngày'),
                IconColumn::make('highlighted')->boolean()->label('Nổi bật'),
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
            'index' => ManageEventPackages::route('/'),
        ];
    }
}
