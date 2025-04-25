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
        'unit',
        'hsn_code',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'status' => 'string',
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
}
