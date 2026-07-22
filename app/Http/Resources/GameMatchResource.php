<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameMatchResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'competition' => $this->competition,
            'opponent' => $this->opponent,
            'is_home' => $this->is_home,
            'kickoff_at' => $this->kickoff_at,
            'status' => $this->status,
            'score_home' => $this->score_home,
            'score_away' => $this->score_away,
        ];
    }
}
