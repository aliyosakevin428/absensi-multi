<?php

namespace App\Http\Controllers;

use App\Http\Middleware\WithLandingPageMiddleware;
use App\Models\News;
use App\Models\WartaJemaat;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class WelcomeController extends BaseController
{
    // public function __construct()
    // {
    //     $this->middleware(WithLandingPageMiddleware::class);
    // }

    public function index()
    {
        return Inertia::render('welcome/index', [
            'news' => News::with('media')->orderBy('created_at', 'desc')->limit(3)->get(),
        ]);
    }

    public function berita()
    {
        return Inertia::render('welcome/berita', [
            'news' => News::with('media')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function baca($slug)
    {
        $news = News::where('slug', $slug)->first();

        return Inertia::render('welcome/baca', [
            'news' => $news->load(['media', 'user']),
        ]);
    }

    public function about()
    {
        return Inertia::render('welcome/about');
    }

    public function wartaIndex()
    {
        $wartaJemaat = WartaJemaat::with('creator:id,name')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->firstOrFail();

        return Inertia::render('welcome/warta', [
            'warta' => [
                'id' => $wartaJemaat->id,
                'title' => $wartaJemaat->title,
                'file_url' => $wartaJemaat->getFirstMediaUrl('warta'),
                'is_active' => $wartaJemaat->is_active,
                'creator' => $wartaJemaat->creator,
                'created_at' => $wartaJemaat->created_at?->toDateTimeString(),
                'updated_at' => $wartaJemaat->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function download(WartaJemaat $warta)
    {
         abort_if(!$warta->is_active, 404);

        $media = $warta->getFirstMedia('warta');
        abort_if(!$media, 404);

        return response()->download(
            $media->getPath(),
            $media->file_name,
            [
                'Content-Type' => 'application/pdf',
            ]
        );
    }
}
