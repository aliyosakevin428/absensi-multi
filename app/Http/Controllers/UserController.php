<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // dd(auth()->user()->getRoleNames(), auth()->user()->getAllPermissions()->pluck('name'));
        $this->pass('index user');

            $users = User::query()
            ->with(['team', 'positions', 'roles'])
            ->withoutRole('superadmin') // exclude superadmin
            ->when($request->role, fn($q, $v) =>
                $q->role($v) // filter role
            )
            ->when($request->name, fn($q, $v) =>
                $q->where('name', 'like', "%$v%") // filter by name
            )
            ->get()
            ->map(fn($user) => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'kontak'    => $user->kontak,
                'team'      => $user->team,
                'positions' => $user->positions,
                'roles'     => $user->getRoleNames()->toArray(),
            ]);

        return Inertia::render('user/index', [
            'users'     => $users,
            'query'     => $request->input(),
            'roles'     => Role::whereNot('name', "superadmin")->get(),
            'teams'     => Team::get(),
            'positions' => Position::get(),
            'permissions' => [
                // 'canView' => $this->user->can('index user'),
                'canAdd' => $this->user->can('create user'),
                'canShow' => $this->user->can('show user'),
                'canUpdate' => $this->user->can('update user'),
                'canDelete' => $this->user->can('delete user'),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->pass('create user');
        $data = $request->validate([
            'name'         => 'required',
            'email'        => 'required|email|unique:users,email',
            'kontak'       => 'nullable|string',
            'password'     => 'required|min:3',
            'team_id'      => 'nullable|exists:teams,id',
            'position_ids' => 'nullable|array',
            'position_ids.*' => 'exists:positions,id',
            'roles'        => 'array',
            'roles.*'      => 'exists:roles,name',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'kontak'   => $data['kontak'] ?? null,
            'password' => bcrypt($data['password']),
            'team_id'  => $data['team_id'] ?? null,
        ]);

        if (!empty($data['position_ids'])) {
            $user->positions()->sync($data['position_ids']);
        }

        if (!empty($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return redirect()->route('users.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->pass('update user');

        $data = $request->validate([
            'name'         => 'required',
            'email'        => 'required|email|unique:users,email,' . $user->id,
            'kontak'       => 'nullable|string',
            'password'     => 'nullable|min:3',
            'team_id'      => 'nullable|exists:teams,id',
            'position_ids' => 'nullable|array',
            'position_ids.*' => 'exists:positions,id',
            'roles'        => 'array',
        ]);

        // Hash password hanya kalau dikirim
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'kontak'   => $data['kontak'] ?? $user->kontak,
            'password' => $data['password'] ?? $user->password,
            'team_id'  => $data['team_id'] ?? $user->team_id,
        ]);

        $user->positions()->sync($data['position_ids'] ?? []);
        $user->syncRoles($data['roles'] ?? []);

        return redirect()->route('users.index');
    }

    public function updatePositionsAndTeam(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'team_id'       => 'nullable|exists:teams,id',
            'position_ids'  => 'nullable|array',
            'position_ids.*'=> 'exists:positions,id',
        ]);

        // update team
        $user->team_id = $data['team_id'] ?? $user->team_id;
        $user->save();

        // update positions (many-to-many sync)
        if (isset($data['position_ids'])) {
            $user->positions()->sync($data['position_ids']);
        }

        return redirect()
        ->route('users.index')
        ->with('success', 'Anggota Telah Di Perbarui!');
    }


    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->pass('show user');
        $user->load(['team', 'positions', 'roles']);

        return Inertia::render('user/show', [
            'user' => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'kontak'    => $user->kontak,
                'team'      => $user->team,
                'positions' => $user->positions,
                'roles'     => $user->getRoleNames()->toArray(),
            ],
            'teams'     => Team::get(),
            'positions' => Position::get(),
            'roles'     => Role::whereNot('name', 'superadmin')->pluck('name'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->pass('delete user');

        $user->delete();

        return redirect()->route('users.index');
    }
}
