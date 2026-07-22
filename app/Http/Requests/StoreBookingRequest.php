<?php

namespace App\Http\Requests;

use App\Models\Doctor;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'doctor_id' => ['required', 'integer', 'exists:doctors,id'],
            'starts_at' => ['required', 'date', 'after:now'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $doctorId = $this->input('doctor_id');
            $serviceId = $this->input('service_id');

            if (! $doctorId || ! $serviceId) {
                return;
            }

            $offers = Doctor::query()
                ->whereKey($doctorId)
                ->whereHas('services', fn ($q) => $q->whereKey($serviceId))
                ->exists();

            if (! $offers) {
                $validator->errors()->add('doctor_id', 'This doctor does not offer the selected service.');
            }
        });
    }
}
