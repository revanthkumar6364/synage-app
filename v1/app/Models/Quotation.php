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
        'parent_id',
        'reference',
        'quotation_number',
        'title',
        'available_size_width_mm',
        'available_size_height_mm',
        'proposed_size_width_mm',
        'proposed_size_height_mm',
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
        'taxes_terms',
        'warranty_terms',
        'delivery_terms',
        'payment_terms',
        'electrical_terms',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'grand_total',
        'status',
        'editable',
        'last_action',
        'created_by',
        'updated_by',
        'approved_at',
        'approved_by',
        'rejected_at',
        'rejected_by',
        'rejection_reason',
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
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    protected $with = ['account', 'account_contact'];

    // Relationships
    public function items()
    {
        return $this->hasMany(QuotationItem::class)->with('product');
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
        $taxAmount = $this->items->sum('tax_amount');
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

        // Ensure the sequence is padded with leading zeros
        $paddedSequence = str_pad($sequence, 4, '0', STR_PAD_LEFT);

        // Format: QT-YYYYMM-XXXX
        return sprintf('%s-%s%s-%s', $prefix, $year, $month, $paddedSequence);
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

    // Status transition validation
    private function validateStatusTransition(string $newStatus): bool
    {
        $validTransitions = [
            self::STATUS_DRAFT => [self::STATUS_PENDING, self::STATUS_REJECTED],
            self::STATUS_PENDING => [self::STATUS_APPROVED, self::STATUS_REJECTED],
            self::STATUS_APPROVED => [self::STATUS_REJECTED],
            self::STATUS_REJECTED => [self::STATUS_DRAFT],
        ];

        return in_array($newStatus, $validTransitions[$this->status] ?? []);
    }

    // Status transition methods
    public function markAsPending(): bool
    {
        if ($this->validateStatusTransition(self::STATUS_PENDING)) {
            $this->status = self::STATUS_PENDING;
            return $this->save();
        }
        return false;
    }

    public function markAsApproved(): bool
    {
        if ($this->validateStatusTransition(self::STATUS_APPROVED)) {
            $this->status = self::STATUS_APPROVED;
            return $this->save();
        }
        return false;
    }

    public function markAsRejected(): bool
    {
        if ($this->validateStatusTransition(self::STATUS_REJECTED)) {
            $this->status = self::STATUS_REJECTED;
            return $this->save();
        }
        return false;
    }

    public function markAsDraft(): bool
    {
        if ($this->validateStatusTransition(self::STATUS_DRAFT)) {
            $this->status = self::STATUS_DRAFT;
            return $this->save();
        }
        return false;
    }

    // Status check methods
    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }
}
