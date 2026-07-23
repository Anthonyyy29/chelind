<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameMatchResource;
use App\Models\GameMatch;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MatchController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = $request->string('status')->lower()->is('finished')
            ? GameMatch::finished()
            : GameMatch::scheduled();

        if ($request->filled('limit')) {
            $query->limit($request->integer('limit'));
        }

        return GameMatchResource::collection($query->get());
    }
}
