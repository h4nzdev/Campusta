<?php

namespace App\Enums;

enum UserRole: string
{
    case STUDENT = 'student';
    case FACULTY = 'faculty';
    case MAINTENANCE = 'maintenance';
    case ADMIN = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::STUDENT => 'Student',
            self::FACULTY => 'Faculty',
            self::MAINTENANCE => 'Maintenance Personnel',
            self::ADMIN => 'Administrator',
        };
    }
}
