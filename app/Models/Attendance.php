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
        'event_id',
        'status',
        'absent_reason_id',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'attendance_user','attendance_id', 'user_id' );
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'events_id');
    }

    public function absent_reason()
    {
        return $this->belongsTo(AbsentReason::class, 'absent_reasons_id');
    }

    public function absent()
    {
        return $this->belongsTo(AbsentReason::class, 'absent_reasons_id');
    }
}
