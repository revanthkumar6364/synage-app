<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query();

        if ($request->user()->cannot('viewAny', User::class)) {
            abort(403);
        }

        if ($request->has('search')) {
            $users->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->input('search') . '%')
                    ->orWhere('email', 'like', '%' . $request->input('search') . '%');
            });
        }

        if ($request->has('role') && $request->input('role') !== 'all') {
            $users->where('role', $request->input('role'));
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $users->where('status', $request->input('status'));
        }

        $users = $users->paginate(config('all.pagination.per_page'));

        return Inertia::render('users/index', [
            'users' => UserResource::collection($users),
            'filters' => $request->only(['search', 'role', 'status']),
            'roles' => config('all.roles'),
            'statuses' => config('all.statuses'),
        ]);
    }

    public function create()
    {
        return Inertia::render('users/create', [
            'country_codes' => config('all.country_codes'),
            'roles' => config('all.roles'),
            'statuses' => config('all.statuses'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:admin,manager,user'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'country_code' => ['required', 'string'],
            'mobile' => ['required', 'string', 'max:10', 'unique:users'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => $request->status,
            'country_code' => $request->country_code,
            'mobile' => $request->mobile,
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        if (request()->user()->cannot('update', $user)) {
            abort(403);
        }

        return Inertia::render('users/edit', [
            'user' => new UserResource($user),
            'roles' => config('all.roles'),
            'statuses' => config('all.statuses'),
            'country_codes' => config('all.country_codes'),
        ]);
    }

    public function changePassword(User $user)
    {
        if (request()->user()->cannot('update', $user)) {
            abort(403);
        }

        return Inertia::render('users/change-password', [
            'user' => new UserResource($user),
        ]);
    }

    public function updatePassword(Request $request, User $user)
    {
        if ($request->user()->cannot('update', $user)) {
            abort(403);
        }

        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')
            ->with('success', 'Password updated successfully.');
    }

    public function update(Request $request, User $user)
    {
        if ($request->user()->cannot('update', $user)) {
            abort(403);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['required', 'string', 'in:' . implode(',', array_keys(config('all.roles')))],
            'status' => ['required', 'string', 'in:' . implode(',', array_keys(config('all.statuses')))],
            'country_code' => ['required', 'string'],
            'mobile' => ['required', 'string', 'max:15', 'unique:users,mobile,' . $user->id],
        ]);

        $user->update($request->only(['name', 'email', 'role', 'status', 'country_code', 'mobile']));

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return redirect()->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', 'string', 'in:' . implode(',', array_keys(config('all.roles')))],
        ]);

        if ($user->id === $request->user()->id) {
            return redirect()->route('users.index')
                ->with('error', 'You cannot change your own role.');
        }

        if ($request->user()->cannot('update', $user)) {
            abort(403);
        }

        $user->update([
            'role' => $request->role,
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User role updated successfully.');
    }
}
