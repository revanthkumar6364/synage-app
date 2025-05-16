<?php

namespace App\Http\Resources;

use App\Models\Quotation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuotationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Quotation $this */
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'quotation_number' => $this->quotation_number,
            'title' => $this->title,
            'available_size_width_mm' => $this->available_size_width_mm,
            'available_size_height_mm' => $this->available_size_height_mm,
            'proposed_size_width_mm' => $this->proposed_size_width_mm,
            'proposed_size_height_mm' => $this->proposed_size_height_mm,
            'description' => $this->description,
            'estimate_date' => $this->estimate_date,
            'account' => $this->account,
            'account_contact' => $this->account_contact,
            'billing_address' => $this->billing_address,
            'billing_location' => $this->billing_location,
            'billing_city' => $this->billing_city,
            'billing_zip_code' => $this->billing_zip_code,
            'shipping_address' => $this->shipping_address,
            'shipping_location' => $this->shipping_location,
            'shipping_city' => $this->shipping_city,
            'shipping_zip_code' => $this->shipping_zip_code,
            'same_as_billing' => $this->same_as_billing,
            'notes' => $this->notes,
            'client_scope' => $this->client_scope,
            'status' => $this->status,
            'items' => $this->items,
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'tax_rate' => $this->tax_rate,
            'tax_amount' => $this->tax_amount,
            'total_amount' => $this->total_amount,
            'grand_total' => $this->grand_total,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'can' => [
                'edit' => $request->user()->can('update', $this->resource),
                'delete' => $request->user()->can('delete', $this->resource),
            ],
        ];
    }
}
