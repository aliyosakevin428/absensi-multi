<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceUserPosition extends Model
{
    protected $table = 'attendance_user_position';

    protected $fillable = [
        'attendance_id',
        'user_id',
        'position_id',
    ];

    public $timestamps = true;

    public function attendance()
    {
        return $this->belongsTo(Attendance::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }
}
