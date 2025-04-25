<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'sku',
        'description',
        'price',
        'min_price',
        'max_price',
        'unit',
        'price_per_sqft',
        'brand',
        'type',
        'gst_percentage',
        'hsn_code',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'min_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'price_per_sqft' => 'decimal:2',
        'gst_percentage' => 'decimal:2'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    // Helper method to generate SKU
    public static function generateSKU(): string
    {
        $prefix = 'PRD';
        $random = strtoupper(substr(uniqid(), -6));
        return $prefix . $random;
    }

    public function getPriceRangeAttribute()
    {
        if ($this->min_price && $this->max_price) {
            return "₹{$this->min_price} - ₹{$this->max_price}";
        }
        return "₹{$this->price}";
    }
}
