<?php

namespace App\Models;

use Database\Factories\SocialLinkFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    /** @use HasFactory<SocialLinkFactory> */
    use HasFactory;

    protected $table = 'social_links';

    protected $fillable = [
        'platform',
        'handle',
        'url',
        'description',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope untuk mengurutkan berdasarkan sort_order
     *
     * @param  Builder<SocialLink>  $query
     * @return Builder<SocialLink>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc');
    }

    /**
     * Scope untuk mendapatkan social links aktif
     *
     * @param  Builder<SocialLink>  $query
     * @return Builder<SocialLink>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->ordered();
    }
}
