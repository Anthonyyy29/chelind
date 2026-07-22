<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ArticleController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $articles = Article::query()
            ->published()
            ->with('category')
            ->when(
                $request->filled('category'),
                fn ($query) => $query->whereHas(
                    'category',
                    fn ($category) => $category->where('slug', $request->string('category'))
                )
            )
            ->when($request->boolean('featured'), fn ($query) => $query->featured())
            ->orderByDesc('published_at')
            ->paginate(10);

        return ArticleResource::collection($articles);
    }

    public function show(Article $article): ArticleResource
    {
        abort_unless($article->status === 'published', 404);

        $article->increment('views');

        return new ArticleResource($article->load(['category', 'author']));
    }
}
