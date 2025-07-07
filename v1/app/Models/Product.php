<?php

namespace App\Models;

use Gate;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'product_type',
        'name',
        'sku',
        'description',
        'size',
        'h_mm',
        'w_mm',
        'size_inch',
        'upto_pix',
        'price',
        'unit',
        'price_per_sqft',
        'brand',
        'hsn_code',
        'type',
        'gst_percentage',
        'min_price',
        'max_price',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'min_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'price_per_sqft' => 'decimal:2',
        'gst_percentage' => 'decimal:2',
        'h_mm' => 'integer',
        'w_mm' => 'integer',
        'upto_pix' => 'integer'
    ];

    protected $appends = ['price_range', 'can', 'unit_size'];

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

    public function getCanAttribute()
    {
        return [
            'update' => Gate::allows('update', $this),
            'delete' => Gate::allows('delete', $this),
            'view' => Gate::allows('view', $this),
        ];
    }

    public function getUnitSizeAttribute()
    {
        // Return the unit size based on product dimensions
        if ($this->h_mm && $this->w_mm) {
            return [
                'width_mm' => $this->w_mm,
                'height_mm' => $this->h_mm,
                'width_ft' => round($this->w_mm / 304.8, 2),
                'height_ft' => round($this->h_mm / 304.8, 2)
            ];
        }

        // Fallback to default size if no dimensions available
        return [
            'width_mm' => 320,
            'height_mm' => 160,
            'width_ft' => 1.05,
            'height_ft' => 0.52
        ];
    }

    public function scopeByType($query, $type)
    {
        // Map the 3 main types to the actual product types
        switch ($type) {
            case 'indoor':
                return $query->where('product_type', 'indoor_led');
            case 'outdoor':
                return $query->where('product_type', 'outdoor_led');
            case 'standard_led':
                return $query->whereIn('product_type', ['kiosk', 'controllers', 'tv_screens']);
            default:
                return $query;
        }
    }

    public function scopeByMainType($query, $mainType)
    {
        return $this->scopeByType($query, $mainType);
    }
}
