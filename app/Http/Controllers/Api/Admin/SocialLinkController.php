<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreSocialLinkRequest;
use App\Http\Requests\Api\Admin\UpdateSocialLinkRequest;
use App\Http\Resources\SocialLinkResource;
use App\Models\SocialLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SocialLinkController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SocialLinkResource::collection(SocialLink::ordered()->get());
    }

    public function store(StoreSocialLinkRequest $request): JsonResponse
    {
        $socialLink = SocialLink::create($request->validated());

        return (new SocialLinkResource($socialLink))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateSocialLinkRequest $request, SocialLink $socialLink): SocialLinkResource
    {
        $socialLink->update($request->validated());

        return new SocialLinkResource($socialLink);
    }

    public function destroy(SocialLink $socialLink): JsonResponse
    {
        $socialLink->delete();

        return response()->json(null, 204);
    }
}
