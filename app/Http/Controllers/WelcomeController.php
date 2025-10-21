<?php

namespace App\Http\Controllers;

use App\Http\Middleware\WithLandingPageMiddleware;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class WelcomeController extends BaseController
{
    // public function __construct()
    // {
    //     $this->middleware(WithLandingPageMiddleware::class);
    // }

    public function index()
    {
        return Inertia::render('welcome/index', [
            'news' => News::with('media')->orderBy('created_at', 'desc')->limit(4)->get(),
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
}
