<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Booking\ConfirmBooking;
use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\DoctorResource;
use App\Http\Resources\ServiceResource;
use App\Models\Booking;
use App\Models\Doctor;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $data = $request->validate([
            'status' => ['nullable', Rule::enum(BookingStatus::class)],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $bookings = Booking::query()
            ->with(['user', 'doctor', 'service'])
            ->when($data['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($data['date'] ?? null, fn ($q, $date) => $q->whereDate('starts_at', $date))
            ->orderByDesc('starts_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/bookings', [
            'bookings' => [
                'data' => BookingResource::collection($bookings)->resolve(),
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'total' => $bookings->total(),
            ],
            'filters' => [
                'status' => $data['status'] ?? null,
                'date' => $data['date'] ?? null,
            ],
            'statuses' => array_map(fn (BookingStatus $s) => ['value' => $s->value, 'label' => $s->label()], BookingStatus::cases()),
            'doctors' => DoctorResource::collection(Doctor::query()->where('active', true)->orderBy('name')->get())->resolve(),
            'services' => ServiceResource::collection(Service::query()->where('active', true)->orderBy('name')->get())->resolve(),
        ]);
    }

    public function update(Request $request, Booking $booking, ConfirmBooking $confirmBooking): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', Rule::enum(BookingStatus::class)],
            'doctor_id' => ['sometimes', 'integer', Rule::exists('doctors', 'id')],
            'service_id' => ['sometimes', 'integer', Rule::exists('services', 'id')],
            'starts_at' => ['sometimes', 'date'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ]);

        if (array_key_exists('doctor_id', $data) || array_key_exists('service_id', $data) || array_key_exists('starts_at', $data)) {
            $doctorId = $data['doctor_id'] ?? $booking->doctor_id;
            $serviceId = $data['service_id'] ?? $booking->service_id;
            $startsAt = isset($data['starts_at']) ? Carbon::parse($data['starts_at']) : $booking->starts_at;
            $duration = Service::query()->findOrFail($serviceId)->duration_minutes;

            $conflict = Booking::query()
                ->where('doctor_id', $doctorId)
                ->where('starts_at', $startsAt)
                ->where('id', '!=', $booking->id)
                ->exists();

            if ($conflict) {
                throw ValidationException::withMessages([
                    'starts_at' => 'This doctor already has a booking at that time.',
                ]);
            }

            $booking->update([
                'doctor_id' => $doctorId,
                'service_id' => $serviceId,
                'starts_at' => $startsAt,
                'ends_at' => $startsAt->clone()->addMinutes($duration),
                'notes' => $data['notes'] ?? $booking->notes,
            ]);
        }

        if (isset($data['status'])) {
            $status = BookingStatus::from($data['status']);

            if ($status === BookingStatus::Confirmed) {
                $confirmBooking->handle($booking);
            } else {
                $booking->update(['status' => $status]);
            }
        }

        return back()->with('success', 'Booking updated.');
    }
}
