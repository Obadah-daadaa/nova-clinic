<?php

namespace App\Http\Requests\Admin;

use App\Models\Doctor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorRequest extends FormRequest
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
        /** @var Doctor $doctor */
        $doctor = $this->route('doctor');

        return [
            'name' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('doctors', 'slug')->ignore($doctor->id)],
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
