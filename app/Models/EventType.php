<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventType extends Model
{
    /** @use HasFactory<\Database\Factories\EventTypeFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function events()
    {
        return $this->hasMany(Event::class, 'event_types_id', 'id');
    }
}
