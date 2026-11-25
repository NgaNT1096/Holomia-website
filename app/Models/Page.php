<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['slug', 'title'];

    public function sections()
    {
        return $this->hasMany(Section::class)->orderBy('sort')->orderBy('id');
    }
}
