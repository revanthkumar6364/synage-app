<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Quotation extends Model
{
    use HasFactory, SoftDeletes;

    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'reference',
        'quotation_number',
        'title',
        'available_size',
        'proposed_size',
        'description',
        'estimate_date',
        'account_id',
        'account_contact_id',
        'billing_address',
        'billing_location',
        'billing_city',
        'billing_zip_code',
        'shipping_address',
        'shipping_location',
        'shipping_city',
        'shipping_zip_code',
        'same_as_billing',
        'notes',
        'client_scope',
        'status',
        'total_amount',
        'tax_amount',
        'discount_amount',
        'grand_total',
        'subtotal',
        'tax_rate',
    ];

    protected $casts = [
        'estimate_date' => 'date',
        'same_as_billing' => 'boolean',
        'total_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $with = ['account', 'account_contact'];

    // Relationships
    public function items(): HasMany
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function account_contact(): BelongsTo
    {
        return $this->belongsTo(AccountContact::class);
    }

    // Totals calculation
    public function calculateTotals(): void
    {
        $subtotal = $this->items->sum('subtotal');
        $discountAmount = $this->items->sum('discount_amount');
        $taxRate = $this->tax_rate ?? 0;
        $taxAmount = ($subtotal - $discountAmount) * ($taxRate / 100);
        $total = $subtotal - $discountAmount + $taxAmount;

        $this->update([
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'tax_amount' => $taxAmount,
            'total_amount' => $total,
            'grand_total' => $total,
        ]);
    }

    // Number generation
    public function generateQuotationNumber(): string
    {
        $prefix = 'QT';
        $year = date('Y');
        $month = date('m');

        $lastQuotation = self::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastQuotation ? (int)substr($lastQuotation->quotation_number, -4) + 1 : 1;

        return sprintf('%s%s%s%04d', $prefix, $year, $month, $sequence);
    }

    // Scopes
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('reference', 'like', "%{$search}%")
                ->orWhere('title', 'like', "%{$search}%")
                ->orWhere('quotation_number', 'like', "%{$search}%")
                ->orWhereHas('account', function ($q) use ($search) {
                    $q->where('business_name', 'like', "%{$search}%");
                });
        });
    }

    public function isValidStatus(string $status): bool
    {
        return in_array($status, [
            self::STATUS_DRAFT,
            self::STATUS_PENDING,
            self::STATUS_APPROVED,
            self::STATUS_REJECTED,
        ]);
    }

    // Auto-fill quotation number on create
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quotation) {
            if (empty($quotation->quotation_number)) {
                $quotation->quotation_number = $quotation->generateQuotationNumber();
            }
        });

        static::saving(function ($quotation) {
            if (!$quotation->isValidStatus($quotation->status)) {
                throw new \InvalidArgumentException('Invalid quotation status');
            }
        });
    }
}
