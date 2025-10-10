<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Attendance extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\AttendanceFactory> */
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'events_id',
        'status',
        'absent_reasons_id',
    ];

    public function users()
    {
    return $this->belongsToMany(User::class, 'attendance_user', 'attendance_id', 'user_id')
                ->withTimestamps();
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'events_id', 'id');
    }

    public function absent_reason()
    {
        return $this->belongsTo(AbsentReason::class, 'absent_reasons_id');
    }

    public function userPositions()
    {
        return $this->hasMany(AttendanceUserPosition::class);
    }

    public function usersWithPositions()
    {
        return $this->belongsToMany(User::class, 'attendance_user_position', 'attendance_id', 'user_id')
            ->withPivot('position_id')
            ->withTimestamps();
    }

    // public function registerMediaConversions(?Media $media = null): void
    // {
    //     $this->addMediaConversion('preview')
    //         ->fit(Fit::Contain, 300, 300)
    //         ->nonQueued();
    // }
}
