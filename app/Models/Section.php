<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['page_id', 'template', 'fields', 'images', 'hidden_locales', 'sort', 'active'];

    protected function casts(): array
    {
        return ['fields' => 'array', 'images' => 'array', 'hidden_locales' => 'array', 'active' => 'bool'];
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function items()
    {
        return $this->hasMany(ContentSection::class)->orderBy('sort')->orderBy('id');
    }
}
