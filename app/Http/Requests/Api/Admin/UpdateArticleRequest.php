<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Field terstruktur (`tags`, `match_stats`) dikirim sebagai JSON string
     * lewat multipart form (karena ada file upload di request yang sama),
     * jadi perlu di-decode dulu sebelum divalidasi sebagai array.
     */
    protected function prepareForValidation(): void
    {
        foreach (['tags', 'match_stats'] as $field) {
            if (is_string($this->input($field))) {
                $decoded = json_decode((string) $this->input($field), true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    $this->merge([$field => $decoded]);
                }
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['sometimes', 'string'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string', 'max:50'],
            'quote_text' => ['nullable', 'string', 'max:1000'],
            'quote_author' => ['nullable', 'string', 'max:255'],
            'match_stats' => ['nullable', 'array'],
            'match_stats.home_team' => ['nullable', 'string', 'max:255'],
            'match_stats.away_team' => ['nullable', 'string', 'max:255'],
            'match_stats.home_score' => ['nullable', 'string', 'max:10'],
            'match_stats.away_score' => ['nullable', 'string', 'max:10'],
            'match_stats.possession_home' => ['nullable', 'integer', 'between:0,100'],
            'match_stats.possession_away' => ['nullable', 'integer', 'between:0,100'],
            'match_stats.shots_home' => ['nullable', 'integer', 'min:0'],
            'match_stats.shots_away' => ['nullable', 'integer', 'min:0'],
            'match_stats.pass_home' => ['nullable', 'integer', 'between:0,100'],
            'match_stats.pass_away' => ['nullable', 'integer', 'between:0,100'],
            'match_stats.corners_home' => ['nullable', 'integer', 'min:0'],
            'match_stats.corners_away' => ['nullable', 'integer', 'min:0'],
            'match_stats.goalscorers_text' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'is_featured' => ['sometimes', 'boolean'],
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
        ];
    }
}
