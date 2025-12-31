<?php

namespace App\Http\Controllers;

use App\Models\WartaJemaat;
use App\Http\Requests\StoreWartaJemaatRequest;
use App\Http\Requests\UpdateWartaJemaatRequest;
use Inertia\Inertia;

class WartaJemaatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $wartas = WartaJemaat::with('creator:id,name')->latest()->get()
            ->map(fn ($warta) => [
                'id' => $warta->id,
                'title' => $warta->title,
                'file_url' => $warta->getFirstMediaUrl('warta'),
                'is_active' => $warta->is_active,
                'creator' => $warta->creator,
                'created_at' => $warta->created_at->toDateTimeString(),
            ]);

        return Inertia::render('warta-jemaat/index', [
            'wartas' => $wartas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWartaJemaatRequest $request)
    {
        $warta = WartaJemaat::create([
            'title' => $request->title,
            'is_active' => $request->boolean('is_active', false),
            'created_by' => $request->user()->id,
        ]);

        if ($request->hasFile('file')) {
            $warta->addMediaFromRequest('file')->toMediaCollection('warta');
        }

        return redirect()->route('warta-jemaat.index')->with('success', 'Warta Jemaat created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(WartaJemaat $wartaJemaat)
    {
        return Inertia::render('warta-jemaat/show', [
            'warta' => [
                'id' => $wartaJemaat->id,
                'title' => $wartaJemaat->title,
                'file_url' => $wartaJemaat->getFirstMediaUrl('warta'),
                'is_active' => $wartaJemaat->is_active,
                'creator' => $wartaJemaat->creator,
                'created_at' => $wartaJemaat->created_at->toDateTimeString(),
                'updated_at' => $wartaJemaat->updated_at->toDateTimeString(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WartaJemaat $wartaJemaat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWartaJemaatRequest $request, WartaJemaat $wartaJemaat)
    {
        $wartaJemaat->update([
            'title' => $request->title,
            'is_active' => $request->has('is_active') ? $request->is_active : $wartaJemaat->is_active,
        ]);

        if ($request->hasFile('file')) {
            $wartaJemaat->clearMediaCollection('warta'); // hapus file lama
            $wartaJemaat->addMediaFromRequest('file')->toMediaCollection('warta'); // upload file baru
        }

        return redirect()->route('warta-jemaat.index')->with('success', 'Warta Jemaat updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WartaJemaat $wartaJemaat)
    {
        $wartaJemaat->delete(); // Spatie otomatis hapus file

        return redirect()->route('warta-jemaat.index');
    }

    /**
     * Activate a Warta Jemaat and deactivate others.
     */
    public function activated(WartaJemaat $wartaJemaat)
    {
        WartaJemaat::query()->update(['is_active' => false]);

        $wartaJemaat->update(['is_active' => true]);

        return redirect()->route('warta-jemaat.index')->with('success', 'Warta Jemaat activated successfully.');
    }
}
