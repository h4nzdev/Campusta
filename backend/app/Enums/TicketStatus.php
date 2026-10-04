<?php

namespace App\Enums;

enum TicketStatus: string
{
    case PENDING = 'Pending';
    case ASSIGNED = 'Assigned';
    case IN_PROGRESS = 'In Progress';
    case RESOLVED = 'Resolved';
    case CLOSED = 'Closed';
}
