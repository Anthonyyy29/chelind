<?php

namespace App\Models;

use Database\Factories\TransferFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    /** @use HasFactory<TransferFactory> */
    use HasFactory;

    protected $fillable = [
        'direction',
        'is_loan',
        'player_name',
        'position',
        'photo',
        'club_from',
        'club_to',
        'fee',
    ];

    protected $casts = [
        'is_loan' => 'boolean',
        'fee' => 'decimal:2',
    ];
}
