<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransferResource;
use App\Models\Transfer;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TransferController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return TransferResource::collection(
            Transfer::orderBy('id', 'desc')->get()
        );
    }
}
