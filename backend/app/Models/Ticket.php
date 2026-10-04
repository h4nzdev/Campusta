<?php

namespace App\Models;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use HasFactory;

    protected $table = 'tickets';

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
        'completion_photo_url'
    ];

    protected function casts(): array
    {
        return [
            'status' => TicketStatus::class,
            'priority' => TicketPriority::class,
        ];
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function assignedPersonnel(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_personnel_id');
    }

    public function history(): HasMany
    {
        return $this->hasMany(TicketHistory::class, 'ticket_id')->orderBy('timestamp', 'asc');
    }
}
