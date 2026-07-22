<?php

namespace App\Http\Controllers;

use App\Actions\Booking\CancelBooking;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyAppointmentController extends Controller
{
    public function index(Request $request): Response
    {
        $bookings = $request->user()
            ->bookings()
            ->with(['doctor', 'service'])
            ->orderByDesc('starts_at')
            ->get();

        return Inertia::render('appointments/index', [
            'upcoming' => BookingResource::collection(
                $bookings->filter(fn (Booking $b) => $b->starts_at->isFuture())->sortBy('starts_at')->values()
            ),
            'past' => BookingResource::collection(
                $bookings->filter(fn (Booking $b) => $b->starts_at->isPast())->values()
            ),
        ]);
    }

    public function cancel(Request $request, Booking $booking, CancelBooking $action): RedirectResponse
    {
        abort_unless($booking->user_id === $request->user()->id, 403);

        try {
            $action->handle($booking);
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Your appointment has been cancelled.');
    }
}
