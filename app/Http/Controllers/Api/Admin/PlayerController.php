<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StorePlayerRequest;
use App\Http\Requests\Api\Admin\UpdatePlayerRequest;
use App\Http\Resources\PlayerResource;
use App\Models\Player;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class PlayerController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PlayerResource::collection(Player::orderBy('name')->get());
    }

    public function store(StorePlayerRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('players', 'public');
        }

        $player = Player::create($data);

        return (new PlayerResource($player))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePlayerRequest $request, Player $player): PlayerResource
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if ($player->photo) {
                Storage::disk('public')->delete($player->photo);
            }

            $data['photo'] = $request->file('photo')->store('players', 'public');
        }

        $player->update($data);

        return new PlayerResource($player);
    }

    public function destroy(Player $player): JsonResponse
    {
        if ($player->photo) {
            Storage::disk('public')->delete($player->photo);
        }

        $player->delete();

        return response()->json(null, 204);
    }
}
