<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'kontak',
        'team_id',
        'position_id',
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

    public $appends = ['avatar'];

    public function getAvatarAttribute()
    {
        return "https://api.dicebear.com/9.x/dylan/png?seed={$this->email}";
    }

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
        ];
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function positions()
    {
        return $this->belongsToMany(Position::class, 'position_user', 'user_id', 'position_id');
    }

    public function attendances()
    {
        return $this->belongsToMany(Attendance::class, 'attendance_user', 'user_id', 'attendance_id')
            ->withPivot(['absent_reason_id'])
            ->withTimestamps();
    }

    public function attendancePositions()
    {
        return $this->belongsToMany(Attendance::class, 'attendance_user_position', 'user_id', 'attendance_id')
            ->withPivot('position_id')
            ->withTimestamps();
    }
}
