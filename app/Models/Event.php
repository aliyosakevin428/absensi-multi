<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'tanggal_kegiatan',
        'waktu_kegiatan',
        'lokasi_kegiatan',
        'event_types_id',
    ];

    public function event_types()
    {
        return $this->belongsTo(EventType::class, 'event_types_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'attendance_id');
    }
}
