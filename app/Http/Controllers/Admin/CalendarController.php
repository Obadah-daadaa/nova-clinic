<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $data = $request->validate([
            'week' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $weekStart = isset($data['week'])
            ? Carbon::createFromFormat('Y-m-d', $data['week'])->startOfWeek(Carbon::SUNDAY)
            : now()->startOfWeek(Carbon::SUNDAY);

        $weekEnd = $weekStart->copy()->addDays(6)->endOfDay();

        $bookings = Booking::query()
            ->with(['user', 'doctor', 'service'])
            ->whereBetween('starts_at', [$weekStart, $weekEnd])
            ->where('status', '!=', 'cancelled')
            ->orderBy('starts_at')
            ->get()
            ->groupBy(fn (Booking $b) => $b->starts_at->toDateString());

        $days = collect(range(0, 6))->map(function (int $i) use ($weekStart, $bookings) {
            $date = $weekStart->copy()->addDays($i);

            return [
                'date' => $date->toDateString(),
                'label' => $date->translatedFormat('D, j M'),
                'bookings' => BookingResource::collection($bookings->get($date->toDateString(), collect())),
            ];
        });

        return Inertia::render('admin/calendar', [
            'weekStart' => $weekStart->toDateString(),
            'prevWeek' => $weekStart->copy()->subWeek()->toDateString(),
            'nextWeek' => $weekStart->copy()->addWeek()->toDateString(),
            'days' => $days,
        ]);
    }
}
