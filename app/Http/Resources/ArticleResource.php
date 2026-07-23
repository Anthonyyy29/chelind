<?php

namespace App\Http\Resources;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ArticleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Article $article */
        $article = $this->resource;

        return [
            'id' => $article->id,
            'title' => $article->title,
            'slug' => $article->slug,
            'excerpt' => $article->excerpt,
            'body' => $article->body,
            'cover_image' => $article->cover_image ? Storage::disk('public')->url($article->cover_image) : null,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'author' => $this->whenLoaded('author', fn () => [
                'id' => $article->author->id,
                'name' => $article->author->name,
            ]),
            'is_featured' => $article->is_featured,
            'status' => $article->status,
            'published_at' => $article->published_at,
            'views' => $article->views,
            'created_at' => $article->created_at,
            'updated_at' => $article->updated_at,
        ];
    }
}
