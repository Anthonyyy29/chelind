<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlayerResource;
use App\Models\Player;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlayerController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PlayerResource::collection(Player::active()->orderBy('name')->get());
    }
}
