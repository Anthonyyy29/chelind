<?php

namespace App\Http\Resources;

use App\Models\Transfer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TransferResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Transfer $transfer */
        $transfer = $this->resource;

        return [
            'id' => $transfer->id,
            'direction' => $transfer->direction,
            'is_loan' => $transfer->is_loan,
            'player_name' => $transfer->player_name,
            'position' => $transfer->position,
            'photo' => $transfer->photo ? Storage::disk('public')->url($transfer->photo) : null,
            'club_from' => $transfer->club_from,
            'club_to' => $transfer->club_to,
            'fee' => $transfer->fee !== null ? (float) $transfer->fee : null,
            'created_at' => $transfer->created_at,
            'updated_at' => $transfer->updated_at,
        ];
    }
}
