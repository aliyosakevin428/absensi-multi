<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        // return User::with('team', 'positions')->get()->toArray();
        return Inertia::render('user/index', [
            'users' => User::with('team', 'positions')->get(),
            'teams' => Team::get(),
            'positions' => Position::get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return Inertia::render('user/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'kontak'=> 'nullable|string',
            'password' => 'required|min:6',
            // 'role' => 'required',
            'team_id' => 'nullable',
            'position_id' => 'nullable|array',
        ]);

        $user = User::create($data);
        $user->positions()->sync($request->position_id);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // return Inertia::render('user/show', [
        //     'user' => $user
        // ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // return Inertia::render('user/edit', [
        //     'user' => $user
        // ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required',
            // 'role' => 'required',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'password' => 'nullable|min:6',
            'team_id' => 'nullable',
            'position_id' => 'nullable',
        ]);

        $user->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
    }
}
