<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tickets extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'location_id',
        'category_name',
        'description',
        'priority',
        'status',
        'assigned_personnel_id',
        'photo_url',
        'work_notes',
        'completion_photo_url',
    ];
}
