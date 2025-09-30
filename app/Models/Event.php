<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'waktu_kegiatan',
        'lokasi_kegiatan',
        'event_types_id',
    ];

    protected $casts = [
        'waktu_kegiatan' => 'datetime:Y-m-d H:i:s',
    ];

    public function event_types()
    {
        return $this->belongsTo(EventType::class, 'event_types_id', 'id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'events_id', 'id');
    }

    // public function setWaktuKegiatanAttribute($value)
    // {
    //     $this->attributes['waktu_kegiatan'] = Carbon::parse($value)->format('Y-m-d H:i:s');
    // }
}
