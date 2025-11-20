<?php

namespace App\Policies;

use App\Models\Account;
use App\Models\User;

class AccountPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager', 'sales']);
    }

    public function view(User $user, Account $account): bool
    {
        return in_array($user->role, ['admin', 'manager', 'sales']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager', 'sales']);
    }

    public function update(User $user, Account $account): bool
    {
        return in_array($user->role, ['admin', 'manager', 'sales']);
    }

    public function delete(User $user, Account $account): bool
    {
        return $user->role === 'admin';
    }
}
