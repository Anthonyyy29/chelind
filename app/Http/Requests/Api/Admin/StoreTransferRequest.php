<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransferRequest extends FormRequest
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
            'direction' => ['required', Rule::in(['in', 'out'])],
            'is_loan' => ['sometimes', 'boolean'],
            'player_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:50'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'club_from' => ['required', 'string', 'max:255'],
            'club_to' => ['required', 'string', 'max:255'],
            'fee' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
