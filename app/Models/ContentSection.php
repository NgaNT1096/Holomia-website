<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentSection extends Model
{
    protected $fillable = ['section_id', 'kind', 'fields', 'images', 'link', 'icon', 'sort', 'active'];

    protected function casts(): array
    {
        return ['fields' => 'array', 'images' => 'array', 'active' => 'bool'];
    }
}
