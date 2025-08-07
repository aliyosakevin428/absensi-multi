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
        return $this->hasMany(Attendance::class, 'attendance_id');
    }
}
