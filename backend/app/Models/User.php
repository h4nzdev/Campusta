<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'school_id',
        'name',
        'username',
        'email',
        'password',
        'role',
        'department',
        'course',
        'year_level',
        'contact',
        'profile_pic',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    public function reportedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'reporter_id');
    }

    public function assignedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'assigned_personnel_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function hasRole(UserRole|string|array $roles): bool
    {
        if (is_array($roles)) {
            $userRoleVal = $this->role instanceof UserRole ? $this->role->value : $this->role;
            return in_array($userRoleVal, array_map(fn($r) => $r instanceof UserRole ? $r->value : $r, $roles));
        }

        $roleValue = $roles instanceof UserRole ? $roles->value : $roles;
        return ($this->role instanceof UserRole ? $this->role->value : $this->role) === $roleValue;
    }
}
