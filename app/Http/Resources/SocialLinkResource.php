<?php

namespace App\Http\Resources;

use App\Models\SocialLink;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SocialLinkResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var SocialLink $link */
        $link = $this->resource;

        return [
            'id' => $link->id,
            'platform' => $link->platform,
            'handle' => $link->handle,
            'url' => $link->url,
            'description' => $link->description,
            'sort_order' => $link->sort_order,
        ];
    }
}
