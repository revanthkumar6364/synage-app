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
        'discount_percentage',
        'discount_amount',
        'tax_percentage',
        'tax_amount',
        'subtotal',
        'total',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_percentage' => 'decimal:2',
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

    public function calculateTotals(): void
    {
        // Calculate subtotal
        $this->subtotal = $this->quantity * $this->unit_price;

        // Calculate discount amount if percentage is provided
        if ($this->discount_percentage > 0) {
            $this->discount_amount = ($this->subtotal * $this->discount_percentage) / 100;
        }

        // Calculate amount after discount
        $amountAfterDiscount = $this->subtotal - $this->discount_amount;

        // Calculate tax amount if percentage is provided
        if ($this->tax_percentage > 0) {
            $this->tax_amount = ($amountAfterDiscount * $this->tax_percentage) / 100;
        }

        // Calculate final total
        $this->total = $amountAfterDiscount + $this->tax_amount;

        $this->save();
    }
}
