<?php

namespace App\Policies;

use App\Models\QuotationMedia;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class QuotationMediaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager', 'sales']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, QuotationMedia $quotationMedia): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, QuotationMedia $quotationMedia): bool
    {
        // Allow admin and manager to update any media
        if (in_array($user->role, ['admin', 'manager'])) {
            return true;
        }

        // Allow sales users to update media that belongs to their quotations
        if ($user->role === 'sales' && $quotationMedia->quotation_id) {
            // Check if the quotation belongs to the sales user
            return $quotationMedia->quotation->created_by === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, QuotationMedia $quotationMedia): bool
    {
        return in_array($user->role, ['admin', 'manager']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, QuotationMedia $quotationMedia): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, QuotationMedia $quotationMedia): bool
    {
        return false;
    }
}
