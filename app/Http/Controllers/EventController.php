<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\EventType;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Event::get()->toArray());
        $this->pass('index event');
        return Inertia::render('event/index', [
            'eventses' => Event::with('event_types')->get(),
            'event_types' => EventType::get(),
            'permissions' => [
                'canAdd' => $this->user->can('create event'),
                'canShow' => $this->user->can('show event'),
                'canUpdate' => $this->user->can('update event'),
                'canDelete' => $this->user->can('delete event'),
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
    public function store(StoreEventRequest $request)
    {
        // dd($request->all());
        $this->pass('create event');
        $data = $request->validated();

        Event::create($data);

        return redirect()->route('event.index')
        ->with('success', 'Event created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $this->pass('show event');
        $event->load(['attendances']);

            return Inertia::render('event/show', [
            'event' => $event,
    ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
       $this->pass('update event');

       $event->update($request->validated());

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $this->pass('delete event');
        
        $event->delete();
    }
}
