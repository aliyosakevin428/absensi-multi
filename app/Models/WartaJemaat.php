<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class WartaJemaat extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table = 'warta_jemaats';

    protected $fillable = [
        'title',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /** Creator (Admin / Creator) */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** Media collection */
    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('warta')
            ->singleFile(); // 1 PDF per warta
    }

    /** Scope active */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
