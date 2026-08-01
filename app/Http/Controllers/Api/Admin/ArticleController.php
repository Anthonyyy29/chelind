<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreArticleRequest;
use App\Http\Requests\Api\Admin\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $articles = Article::with(['category', 'author'])
            ->latest()
            ->paginate(15);

        return ArticleResource::collection($articles);
    }

    public function store(StoreArticleRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['slug'] = Article::generateUniqueSlug($data['title']);
        $data['author_id'] = $request->user()->id;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        if (($data['status'] ?? 'draft') === 'published') {
            $data['published_at'] = now();
        }

        $article = Article::create($data);

        return (new ArticleResource($article->load(['category', 'author'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Article $article): ArticleResource
    {
        return new ArticleResource($article->load(['category', 'author']));
    }

    public function update(UpdateArticleRequest $request, Article $article): ArticleResource
    {
        $data = $request->validated();

        if (isset($data['title']) && $data['title'] !== $article->title) {
            $data['slug'] = Article::generateUniqueSlug($data['title'], $article->id);
        }

        if ($request->hasFile('cover_image')) {
            if ($article->cover_image) {
                Storage::disk('public')->delete($article->cover_image);
            }

            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $newStatus = $data['status'] ?? $article->status;
        if ($newStatus === 'published' && $article->status !== 'published') {
            $data['published_at'] = now();
        }

        $article->update($data);

        return new ArticleResource($article->fresh(['category', 'author']));
    }

    public function destroy(Article $article): JsonResponse
    {
        if ($article->cover_image) {
            Storage::disk('public')->delete($article->cover_image);
        }

        $article->delete();

        return response()->json(null, 204);
    }
}
