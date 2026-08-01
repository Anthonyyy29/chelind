<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'direction' => ['sometimes', Rule::in(['in', 'out'])],
            'is_loan' => ['sometimes', 'boolean'],
            'player_name' => ['sometimes', 'string', 'max:255'],
            'position' => ['sometimes', 'string', 'max:50'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'club_from' => ['sometimes', 'string', 'max:255'],
            'club_to' => ['sometimes', 'string', 'max:255'],
            'fee' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
