<?php

namespace App\Filament\Resources\ContentChanges;

use App\Filament\Resources\ContentChanges\Pages\ManageContentChanges;
use App\Models\ContentChange;
use App\Support\History;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use RuntimeException;
use UnitEnum;

class ContentChangeResource extends Resource
{
    protected static ?string $model = ContentChange::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClock;

    protected static string|UnitEnum|null $navigationGroup = 'Nội dung website';

    protected static ?string $navigationLabel = 'Lịch sử chỉnh sửa';

    protected static ?string $modelLabel = 'thay đổi';

    protected static ?string $pluralModelLabel = 'Lịch sử chỉnh sửa';

    protected static ?int $navigationSort = 99;

    private const TYPES = [
        'text' => 'Sửa chữ', 'removed' => 'Xoá / hiện chữ', 'image' => 'Ảnh', 'attr' => 'Cài đặt',
        'item_added' => 'Thêm mục', 'item_deleted' => 'Xoá mục', 'order' => 'Thứ tự',
    ];

    public static function canCreate(): bool
    {
        return false;
    }

    /** Short human description of one side (old/new) of a change. */
    private static function describe(ContentChange $c, mixed $v): string
    {
        return match ($c->type) {
            'text' => (string) $v === '' ? '(trống)' : (string) $v,
            'removed' => ($v['removed'] ?? false) ? 'Đã xoá: '.($v['text'] ?? '') : 'Hiển thị: '.($v['text'] ?? ''),
            'image' => $v ? basename($v['path']) : '(không có ảnh)',
            'attr' => match ($c->field) {
                'active' => $v ? 'Hiện' : 'Ẩn',
                'hidden_locales' => $v ? 'Ẩn ở: '.strtoupper(implode(', ', $v)) : 'Hiện mọi ngôn ngữ',
                default => (string) $v,
            },
            'item_added', 'item_deleted' => $v ? 'Mục trong danh sách' : '—',
            default => 'Danh sách thứ tự',
        };
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')->label('Thời điểm')->dateTime('d/m/Y H:i:s')->sortable(),
                TextColumn::make('user.name')->label('Người sửa'),
                TextColumn::make('place')->label('Vị trí')->searchable()->wrap(),
                TextColumn::make('type')->label('Loại')->badge()
                    ->formatStateUsing(fn ($state, ContentChange $record) => self::TYPES[$state].($record->locale ? ' '.strtoupper($record->locale) : '')),
                TextColumn::make('before')->label('Trước')->wrap()->limit(90)
                    ->state(fn (ContentChange $record) => self::describe($record, $record->old)),
                TextColumn::make('after')->label('Sau')->wrap()->limit(90)
                    ->state(fn (ContentChange $record) => self::describe($record, $record->new)),
            ])
            ->defaultSort('id', 'desc')
            ->filters([SelectFilter::make('type')->label('Loại')->options(self::TYPES)])
            ->recordActions([
                Action::make('restore')
                    ->label('Khôi phục')
                    ->icon(Heroicon::OutlinedArrowUturnLeft)
                    ->requiresConfirmation()
                    ->modalHeading('Khôi phục bản "Trước"?')
                    ->modalDescription('Giá trị hiện tại của vị trí này sẽ được thay bằng bản cũ và hiện ngay trên website.')
                    ->action(function (ContentChange $record) {
                        try {
                            History::restore($record);
                            Notification::make()->title('Đã khôi phục')->success()->send();
                        } catch (RuntimeException $e) {
                            Notification::make()->title($e->getMessage())->danger()->send();
                        }
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageContentChanges::route('/')];
    }
}
