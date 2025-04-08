<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
            $users->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $users = $users->paginate(10);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }
}
