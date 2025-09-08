<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'events_id',
        'status',
        'absent_reasons_id',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'attendance_user','attendance_id', 'user_id' );
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

    // public function absent()
    // {
    //     return $this->belongsTo(AbsentReason::class, 'absent_reasons_id');
    // }
}
