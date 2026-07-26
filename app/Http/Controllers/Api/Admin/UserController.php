<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreUserRequest;
use App\Http\Requests\Api\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return UserResource::collection(User::with('role')->orderBy('name')->get());
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create($request->validated());

        return (new UserResource($user->load('role')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $data = $request->validated();

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return new UserResource($user->fresh('role'));
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        abort_if($user->is($request->user()), 422, 'Tidak bisa menghapus akun sendiri.');

        $user->delete();

        return response()->json(null, 204);
    }
}
