<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SocialLinkResource;
use App\Models\SocialLink;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SocialLinkController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SocialLinkResource::collection(SocialLink::active()->get());
    }
}
