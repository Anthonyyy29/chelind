<?php

namespace App\Models;

use Database\Factories\GameMatchFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameMatch extends Model
{
    /** @use HasFactory<GameMatchFactory> */
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'external_id',
        'competition',
        'opponent',
        'opponent_crest',
        'is_home',
        'kickoff_at',
        'status',
        'score_home',
        'score_away',
        'last_synced_at',
    ];

    protected $casts = [
        'is_home' => 'boolean',
        'kickoff_at' => 'datetime',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Scope untuk jadwal yang belum dimainkan, urut laga terdekat dulu
     *
     * @param  Builder<GameMatch>  $query
     * @return Builder<GameMatch>
     */
    public function scopeScheduled(Builder $query): Builder
    {
        return $query->where('status', 'SCHEDULED')->orderBy('kickoff_at', 'asc');
    }

    /**
     * Scope untuk hasil pertandingan, urut laga terbaru dulu
     *
     * @param  Builder<GameMatch>  $query
     * @return Builder<GameMatch>
     */
    public function scopeFinished(Builder $query): Builder
    {
        return $query->where('status', 'FINISHED')->orderBy('kickoff_at', 'desc');
    }
}
