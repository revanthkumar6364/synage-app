<?php

namespace App\Models;

use Gate;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class QuotationMedia extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'quotation_id',
        'category',
        'name',
        'file_name',
        'file_path',
        'mime_type',
        'file_size',
        'is_active',
        'sort_order',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'file_size' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['full_url', 'can'];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getFullUrlAttribute()
    {
        return Storage::disk('public')->url("{$this->file_path}/{$this->file_name}");
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByQuotation($query, $quotationId)
    {
        return $query->where('quotation_id', $quotationId);
    }

    public function scopeGeneralFiles($query)
    {
        return $query->whereNull('quotation_id');
    }

    public function getCanAttribute()
    {
        return [
            'view' => Gate::allows('view', $this),
            'update' => Gate::allows('update', $this),
            'delete' => Gate::allows('delete', $this),
        ];
    }
}
