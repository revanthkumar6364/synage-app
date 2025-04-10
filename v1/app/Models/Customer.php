<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'business_name',
        'gst_number',
        'industry_type',
        'billing_address',
        'billing_location',
        'billing_city',
        'billing_zip_code',
        'shipping_address',
        'shipping_location',
        'shipping_city',
        'shipping_zip_code',
        'same_as_billing',
        'status'
    ];

    protected $casts = [
        'same_as_billing' => 'boolean',
    ];

    public function contacts(): HasMany
    {
        return $this->hasMany(CustomerContact::class);
    }
}
