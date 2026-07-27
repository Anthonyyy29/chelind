<?php

namespace App\Http\Resources;

use App\Models\GameMatch;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameMatchResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var GameMatch $match */
        $match = $this->resource;

        return [
            'id' => $match->id,
            'competition' => $match->competition,
            'opponent' => $match->opponent,
            'opponent_crest' => $match->opponent_crest,
            'is_home' => $match->is_home,
            'kickoff_at' => $match->kickoff_at,
            'status' => $match->status,
            'score_home' => $match->score_home,
            'score_away' => $match->score_away,
        ];
    }
}
