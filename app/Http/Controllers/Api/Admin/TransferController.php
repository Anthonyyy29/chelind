<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreTransferRequest;
use App\Http\Requests\Api\Admin\UpdateTransferRequest;
use App\Http\Resources\TransferResource;
use App\Models\Transfer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class TransferController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return TransferResource::collection(
            Transfer::orderBy('id', 'desc')->get()
        );
    }

    public function store(StoreTransferRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('transfers', 'public');
        }

        $transfer = Transfer::create($data);

        return (new TransferResource($transfer))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateTransferRequest $request, Transfer $transfer): TransferResource
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if ($transfer->photo) {
                Storage::disk('public')->delete($transfer->photo);
            }

            $data['photo'] = $request->file('photo')->store('transfers', 'public');
        }

        $transfer->update($data);

        return new TransferResource($transfer);
    }

    public function destroy(Transfer $transfer): JsonResponse
    {
        if ($transfer->photo) {
            Storage::disk('public')->delete($transfer->photo);
        }

        $transfer->delete();

        return response()->json(null, 204);
    }
}
