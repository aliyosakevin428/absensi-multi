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
        $this->pass('index eventType');

        return Inertia::render('eventType/index', [
            'events' => EventType::get(),
            'permissions' => [
                'canAdd' => $this->user->can('create eventType'),
                'canShow' => $this->user->can('show eventType'),
                'canUpdate' => $this->user->can('update eventType'),
                'canDelete' => $this->user->can('delete eventType'),
                'canMenu' => $this->user->can('menu eventType'),
            ]
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
        $this->pass('create eventType');

        $data = $request->validated();

        EventType::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(EventType $eventType)
    {
        $this->pass('show eventType');

        $eventType->load(['events']); // eager load daftar event

            return Inertia::render('eventType/show', [
            'eventType' => $eventType,
    ]);
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
        $this->pass('update eventType');

        $data = $request->validated();

        $eventType->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventType $eventType)
    {
        $this->pass('delete eventType');

        $eventType->delete();
    }
}
