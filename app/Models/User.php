<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable, InteractsWithMedia;

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

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profile_photo')
            ->singleFile();
    }

    public function getAvatarAttribute()
    {
        if ($this->hasMedia('profile_photo')) {
            return $this->getFirstMediaUrl('profile_photo');
        }

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
            ->withPivot(['absent_reason_id', 'attended_at'])
            ->withTimestamps();
    }

    public function attendancePositions()
    {
        return $this->belongsToMany(Attendance::class, 'attendance_user_position', 'user_id', 'attendance_id')
            ->withPivot('position_id')
            ->withTimestamps();
    }
}
