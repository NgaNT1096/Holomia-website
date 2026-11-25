<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = ['tag','name','email','phone','company','message','payload','ip','handled'];

    protected function casts(): array
    {
        return ['payload'=>'array','handled'=>'bool'];
    }
}
