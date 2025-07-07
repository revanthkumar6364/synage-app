<?php

namespace App\Models;

use Gate;
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
        'product_type',
        'selected_product_id',
        'available_size_width',
        'available_size_height',
        'available_size_unit',
        'proposed_size_width',
        'proposed_size_height',
        'proposed_size_unit',
        'available_size_width_mm',
        'available_size_height_mm',
        'proposed_size_width_mm',
        'proposed_size_height_mm',
        'available_size_width_ft',
        'available_size_height_ft',
        'proposed_size_width_ft',
        'proposed_size_height_ft',
        'available_size_sqft',
        'proposed_size_sqft',
        'facade_type',
        'facade_notes',
        'quantity',
        'max_quantity',
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
        'category',
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
        'sales_user_id',
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

    protected $with = ['account', 'account_contact', 'salesUser'];
    protected $appends = ['can'];

    public function getCanAttribute()
    {
        return [
            'view' => Gate::allows('view', $this),
            'update' => Gate::allows('update', $this),
            'delete' => Gate::allows('delete', $this),
            'approve' => Gate::allows('approve', $this),
            'reject' => Gate::allows('reject', $this),
            'editTerms' => Gate::allows('editTerms', $this),
            'editFiles' => Gate::allows('editFiles', $this),
        ];
    }
    // Relationships
    public function items()
    {
        return $this->hasMany(QuotationItem::class)->with('product');
    }

    public function media()
    {
        return $this->hasMany(QuotationMedia::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function account_contact(): BelongsTo
    {
        return $this->belongsTo(AccountContact::class);
    }

    public function salesUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sales_user_id','id');
    }

    public function selectedProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'selected_product_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(Quotation::class, 'parent_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Quotation::class, 'parent_id');
    }

    // Totals calculation
    public function calculateTotals()
    {
        // Initialize totals
        $this->subtotal = 0;
        $this->discount_amount = 0;
        $this->tax_amount = 0;
        $this->total_amount = 0;

        // Calculate totals from items using proposed_unit_price
        foreach ($this->items as $item) {
            $this->subtotal += $item->quantity * $item->proposed_unit_price;
            $this->discount_amount += $item->discount_amount;
            $this->tax_amount += $item->tax_amount;
            $this->total_amount += $item->total;
        }

        $this->save();

        return $this;
    }

    // Number generation
    public function generateQuotationNumber(): string
    {
        $prefix = 'QT';
        $year = date('Y');
        $month = date('m');

        // Count quotations for current month and year
        $count = self::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count();

        // Start from 1 (001) for the first quotation of the month
        $sequence = $count + 1;

        // Ensure the sequence is padded with leading zeros
        $paddedSequence = str_pad($sequence, 4, '0', STR_PAD_LEFT);

        // Format: QT-YYYYMM-XXXX
        return sprintf('%s-%s%s-%s', $prefix, $year, $month, $paddedSequence);
    }
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
    // Reference number generation
    public function generateReferenceNumber(): string
    {
        $prefix = 'RSPL';
        $month = date('M');
        $year = date('Y');

        // Count quotations for current month and year
        $count = self::whereYear('created_at', $year)
            ->whereMonth('created_at', date('m'))
            ->count();

        // Start from 1 (001) for the first quotation of the month
        $sequence = $count + 1;

        // Ensure the sequence is padded with leading zeros
        $paddedSequence = str_pad($sequence, 3, '0', STR_PAD_LEFT);

        // Format: RSPL/MON/YYYY-XXX
        return sprintf('%s/%s/%s-%s', $prefix, strtoupper($month), $year, $paddedSequence);
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

        static::saving(function ($quotation) {
            if (!$quotation->isValidStatus($quotation->status)) {
                throw new \InvalidArgumentException('Invalid quotation status');
            }
        });
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
