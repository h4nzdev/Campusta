<?php

namespace App\Models;

use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketHistory extends Model
{
    use HasFactory;

    protected $table = 'ticket_histories';

    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'status',
        'note',
        'timestamp',
    ];

    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }
}
