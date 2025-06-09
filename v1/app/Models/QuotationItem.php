<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuotationItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'quotation_id',
        'product_id',
        'quantity',
        'unit_price',
        'proposed_unit_price',
        'discount_percentage',
        'discount_amount',
        'taxable_amount',
        'tax_percentage',
        'tax_amount',
        'subtotal',
        'total',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'proposed_unit_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_percentage' => 'decimal:2',
        'taxable_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function calculateTotals()
    {
        // Calculate subtotal based on proposed_unit_price
        $this->subtotal = $this->quantity * $this->proposed_unit_price;

        // Calculate discount amount
        $this->discount_amount = ($this->subtotal * $this->discount_percentage) / 100;

        // Calculate taxable amount (after discount)
        $this->taxable_amount = $this->subtotal - $this->discount_amount;

        // Calculate tax amount
        $this->tax_amount = ($this->taxable_amount * $this->tax_percentage) / 100;

        // Calculate total
        $this->total = $this->taxable_amount + $this->tax_amount;

        return $this;
    }
}
