<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status,
            'parent_id' => $this->parent_id,
            'parent' => $this->parent,
            'sort_order' => $this->sort_order,
            'full_path' => $this->full_path,
            'has_children' => $this->hasChildren(),
            'has_parent' => $this->hasParent(),
            'children_count' => $this->children()->count(),
            'products_count' => $this->products()->count(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'can' => [
                'edit' => $request->user()?->can('update', $this->resource),
                'delete' => $request->user()?->can('delete', $this->resource),
            ],
        ];
    }
}
