<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'country_code' => $this->country_code,
            'mobile' => $this->mobile,
            'email' => $this->email,
            'role' => $this->role,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'can' => [
                'edit' => $request->user()->can('update', $this->resource),
                'delete' => $request->user()->can('delete', $this->resource),
                'change_role' => $request->user()->can('update', $this->resource) && $request->user()->id !== $this->id,
            ],
        ];
    }
}
