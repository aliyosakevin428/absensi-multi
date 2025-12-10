<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbsentReason extends Model
{
    /** @use HasFactory<\Database\Factories\AbsentReasonFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function attendances()
    {
        return $this->belongsToMany(
            Attendance::class,
            'attendance_user',     // pivot table
            'absent_reason_id',    // FK di pivot menuju AbsentReason
            'attendance_id'        // FK di pivot menuju Attendance
        )->withPivot('user_id')
        ->withTimestamps()
        ->with('event'); // eager load event supaya mudah
    }

}
