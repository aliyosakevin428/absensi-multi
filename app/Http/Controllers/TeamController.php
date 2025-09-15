<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass('index team');

        $data = Team::query()
                    // ->with(['roles'])
                    ->when($request->name, function($q, $v){
                        $q->where('name', $v);
                    });
        return Inertia::render('team/index', [
            'teams' => $data->get(),
            'query' => $request->input(),
            'permissions' => [
                // 'canView' => $this->user->can('index team'),
                'canAdd' => $this->user->can('create team'),
                'canShow' => $this->user->can('show team'),
                'canUpdate' => $this->user->can('update team'),
                'canDelete' => $this->user->can('delete team'),
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
    public function store(StoreTeamRequest $request)
    {
        $this->pass('create team');

        $data = $request->validated();
        Team::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        $this->pass('show team');

        $team->load(['users.positions']);

        return Inertia::render('team/show', [
            'team' => $team,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Team $team)
    {
        // Auth::user()->can('update', $team);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeamRequest $request, Team $team)
    {
        $this->pass('update team');

        $data = $request->validated();
        $team->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        $this->pass('delete team');

        $team->delete();
    }
}
