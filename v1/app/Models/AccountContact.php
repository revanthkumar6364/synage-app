<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'name',
        'email',
        'contact_number',
        'role',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'status'
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
