<?php

namespace App\Filament\Resources\Leads;

use App\Filament\Resources\Leads\Pages\ManageLeads;
use App\Models\Lead;
use BackedEnum;
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

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Khách hàng';
    protected static ?string $navigationLabel = 'Khách liên hệ (Leads)';
    protected static ?string $modelLabel = 'Khách liên hệ (Leads)';
    protected static ?string $pluralModelLabel = 'Khách liên hệ (Leads)';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([

                TextInput::make('tag')->disabled(),
                TextInput::make('name')->label('Họ tên'),
                TextInput::make('email'),
                TextInput::make('phone')->label('Điện thoại'),
                TextInput::make('company')->label('Công ty'),
                Textarea::make('message')->label('Lời nhắn')->columnSpanFull(),
                Toggle::make('handled')->label('Đã xử lý'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('created_at')->label('Ngày')->dateTime('d/m/Y H:i')->sortable(),
                TextColumn::make('tag')->badge(),
                TextColumn::make('name')->label('Họ tên')->searchable(),
                TextColumn::make('email')->searchable(),
                TextColumn::make('phone')->label('SĐT'),
                TextColumn::make('company')->label('Công ty'),
                IconColumn::make('handled')->boolean()->label('Đã xử lý'),
            ])
            ->defaultSort('created_at','desc')
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
            'index' => ManageLeads::route('/'),
        ];
    }
}
