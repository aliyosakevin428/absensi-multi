<?php

namespace App\Http\Controllers;

use App\Models\EventType;
use App\Http\Requests\StoreEventTypeRequest;
use App\Http\Requests\UpdateEventTypeRequest;
use Inertia\Inertia;

class EventTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(EventType::get()->toArray());

        return Inertia::render('eventType/index', [
            'events' => EventType::get(),
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
    public function store(StoreEventTypeRequest $request)
    {
        $data = $request->validated();

        EventType::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(EventType $eventType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EventType $eventType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventTypeRequest $request, EventType $eventType)
    {
        $data = $request->validated();

        $eventType->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventType $eventType)
    {
        $eventType->delete();
    }
}
