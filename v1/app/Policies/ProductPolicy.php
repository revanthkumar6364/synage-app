<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager', 'sales']);
    }

    public function view(User $user, Product $product): bool
    {
        return in_array($user->role, ['admin', 'manager', 'sales']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }

    public function update(User $user, Product $product): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }

    public function delete(User $user, Product $product): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }

    public function restore(User $user, Product $product): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }

    public function forceDelete(User $user, Product $product): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }
}
