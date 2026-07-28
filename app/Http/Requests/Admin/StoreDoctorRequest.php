<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDoctorRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('doctors', 'slug')],
            'title' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'bio_ar' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'active' => ['boolean'],
            'service_ids' => ['array'],
            'service_ids.*' => ['integer', Rule::exists('services', 'id')],
        ];
    }
}
