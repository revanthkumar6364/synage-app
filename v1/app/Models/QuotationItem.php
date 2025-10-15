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
        'available_size_width_mm',
        'available_size_height_mm',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'proposed_unit_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_percentage' => 'decimal:2',
        'taxable_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'total' => 'decimal:2',
        'available_size_width_mm' => 'decimal:2',
        'available_size_height_mm' => 'decimal:2',
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

        // Calculate tax amount (on taxable amount, not subtotal)
        $this->tax_amount = ($this->taxable_amount * $this->tax_percentage) / 100;

        // Calculate total (taxable amount + tax amount)
        $this->total = $this->taxable_amount + $this->tax_amount;

        return $this;
    }

    /**
     * Check if proposed price is outside the product's standard pricing range
     */
    public function isOutsideStandardRange(): bool
    {
        if (!$this->product) {
            return false;
        }

        // If product doesn't have min/max price defined, no standard range exists
        if (!$this->product->min_price || !$this->product->max_price) {
            return false;
        }

        // Check if proposed price is below min or above max
        return $this->proposed_unit_price < $this->product->min_price
            || $this->proposed_unit_price > $this->product->max_price;
    }

    /**
     * Get the standard pricing range message
     */
    public function getStandardRangeMessage(): ?string
    {
        if (!$this->product || !$this->product->min_price || !$this->product->max_price) {
            return null;
        }

        if ($this->isOutsideStandardRange()) {
            return sprintf(
                "Price ₹%s is outside standard range (₹%s - ₹%s)",
                number_format($this->proposed_unit_price, 2),
                number_format($this->product->min_price, 2),
                number_format($this->product->max_price, 2)
            );
        }

        return null;
    }
}
