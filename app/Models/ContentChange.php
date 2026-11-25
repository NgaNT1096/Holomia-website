<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentChange extends Model
{
    protected $fillable = ['batch', 'user_id', 'section_id', 'item_id', 'type', 'field', 'locale', 'place', 'old', 'new'];

    protected function casts(): array
    {
        return ['old' => 'json', 'new' => 'json'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
