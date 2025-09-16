<?php

namespace App\Http\Controllers;

use App\Models\AbsentReason;
use App\Http\Requests\StoreAbsentReasonRequest;
use App\Http\Requests\UpdateAbsentReasonRequest;
use Inertia\Inertia;

class AbsentReasonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->pass('index absent reason');

        return Inertia::render('absentreason/index', [
            'absentreasons' => AbsentReason::get(),
            'permissions' => [
                'canAdd' => $this->user->can('create absent reason'),
                'canShow' => $this->user->can('show absent reason'),
                'canUpdate' => $this->user->can('update absent reason'),
                'canDelete' => $this->user->can('delete absent reason'),
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
    public function store(StoreAbsentReasonRequest $request)
    {
        $this->pass('create absent reason');

        $data = $request->validated();

        AbsentReason::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(AbsentReason $absentReason)
    {
        $this->pass('show absent reason');

        return Inertia::render('absentreason/show', [
            'absentreason' => $absentReason,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AbsentReason $absentReason)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAbsentReasonRequest $request, AbsentReason $absentReason)
    {
        $this->pass('update absent reason');

        $data = $request->validated();

        $absentReason->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AbsentReason $absentReason)
    {
        $this->pass('delete absent reason');

        $absentReason->delete();
    }
}
