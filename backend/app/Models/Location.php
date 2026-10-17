<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'code',
        'building',
        'floor',
        'room',
        'name',
        'qr_code',
    ];
}
