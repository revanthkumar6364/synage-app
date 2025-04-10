<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'business_id' => $this->business_id,
            'business_name' => $this->business_name,
            'gst_number' => $this->gst_number,
            'industry_type' => $this->industry_type,
            'billing_address' => $this->billing_address,
            'billing_location' => $this->billing_location,
            'billing_city' => $this->billing_city,
            'billing_zip_code' => $this->billing_zip_code,
            'shipping_address' => $this->shipping_address,
            'shipping_location' => $this->shipping_location,
            'shipping_city' => $this->shipping_city,
            'shipping_zip_code' => $this->shipping_zip_code,
            'same_as_billing' => $this->same_as_billing,
            'status' => $this->status,
            'contacts' => CustomerContactResource::collection($this->whenLoaded('contacts')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'can' => [
                'edit' => $request->user()->can('update', $this->resource),
                'delete' => $request->user()->can('delete', $this->resource),
            ],
        ];
    }
}