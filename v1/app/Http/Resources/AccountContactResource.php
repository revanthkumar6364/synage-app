<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountContactResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get account - check if relationship is loaded to avoid N+1 queries
        $account = null;
        if ($this->relationLoaded('account')) {
            $account = $this->account;
        } elseif ($this->account_id) {
            // Only load if not already loaded (fallback)
            $account = \App\Models\Account::find($this->account_id);
        }

        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'name' => $this->name,
            'email' => $this->email,
            'contact_number' => $this->contact_number,
            'role' => $this->role,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'zip_code' => $this->zip_code,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'can' => [
                'edit' => $account ? $request->user()->can('update', $account) : false,
                'delete' => $account ? $request->user()->can('delete', $account) : false,
            ],
        ];
    }
}
