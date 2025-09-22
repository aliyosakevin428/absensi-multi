<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class News extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\NewsFactory> */
    use HasFactory;
    use InteractsWithMedia;

    /*
    protected $fillable = [
        'title',
        'slug',
        'content',
        'user_id',
    ];
    */

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public $appends = [
        'thumbnail',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('preview')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();
    }

    public function getThumbnailAttribute()
    {
        $thumbnail = $this->getFirstMediaUrl();

        return $thumbnail != '' ? $thumbnail : asset('no_image.png');
    }

    public function getDescriptionAttribute()
    {
        return "Ditulis oleh {$this->user->name} pada {$this->created_at->diffForHumans()}";
    }

}
