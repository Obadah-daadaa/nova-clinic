<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Booking\ConfirmBooking;
use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
        ]);
    }

    public function update(Request $request, Booking $booking, ConfirmBooking $confirmBooking): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::enum(BookingStatus::class)],
        ]);

        $status = BookingStatus::from($data['status']);

        if ($status === BookingStatus::Confirmed) {
            $confirmBooking->handle($booking);
        } else {
            $booking->update(['status' => $status]);
        }

        return back()->with('success', 'Booking updated.');
    }
}
