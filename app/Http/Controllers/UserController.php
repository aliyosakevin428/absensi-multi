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
        // dd(User::with('team', 'positions')->get()->toArray());
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
            'password' => 'required|min:3',
            'team_id' => 'nullable',
            'position_ids' => 'nullable|array',
            'position_ids.*' => 'exists:positions,id',
            ]);

            $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'kontak' => $data['kontak'] ?? null,
            'password' => bcrypt($data['password']),
            'team_id' => $data['team_id'] ?? null,
            ]);

        if (!empty($data['position_ids'])) {
            $user->positions()->sync($data['position_ids']);
        }

        return redirect()->route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load(['team', 'positions']);

        return Inertia::render('user/show', [
            'user' => $user,
            'teams' => Team::get(),
            'positions' => Position::get(),
        ]);
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
            'email' => 'required|email|unique:users,email,' . $user->id,
            'kontak'=> 'nullable|string',
            'password' => 'nullable|min:6',
            'team_id' => 'nullable|exists:teams,id',
            'position_ids' => 'nullable|array',
            'position_ids.*' => 'exists:positions,id',
        ]);

        // Jika password dikirim, hash dulu
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        // Update user
            $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'kontak' => $data['kontak'] ?? $user->kontak,
            'password' => isset($data['password']) ? bcrypt($data['password']) : $user->password,
            'team_id' => $data['team_id'] ?? $user->team_id,
        ]);

        // Update posisi di pivot table
        $user->positions()->sync($data['position_ids'] ?? []);

        return redirect()->route('users.index');

    }

    public function updatePositionsAndTeam(Request $request, User $user)
    {
        $data = $request->validate([
            'team_id' => 'nullable|exists:teams,id',
            'position_ids' => 'nullable|array',
            'position_ids.*' => 'exists:positions,id',
        ]);

        // Update tim
        $user->update([
            'team_id' => $data['team_id'] ?? $user->team_id,
        ]);

        // Update posisi di pivot
        $user->positions()->sync($data['position_ids'] ?? []);

        return redirect()
            ->route('users.index')
            ->with('success', 'Tim & posisi berhasil diperbarui');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
    }
}
