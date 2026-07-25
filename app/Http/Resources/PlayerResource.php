<?php

namespace App\Http\Resources;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PlayerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Player $player */
        $player = $this->resource;

        return [
            'id' => $player->id,
            'name' => $player->name,
            'position' => $player->position,
            'photo' => $player->photo ? Storage::disk('public')->url($player->photo) : null,
            'is_active' => $player->is_active,
        ];
    }
}
