<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $data = $request->validate([
            'view' => ['nullable', Rule::in(['day', 'week', 'month'])],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $view = $data['view'] ?? 'week';
        $anchor = isset($data['date'])
            ? Carbon::createFromFormat('Y-m-d', $data['date'])
            : Carbon::now();

        [$rangeStart, $rangeEnd] = match ($view) {
            'day' => [$anchor->copy()->startOfDay(), $anchor->copy()->endOfDay()],
            'month' => [
                $anchor->copy()->startOfMonth()->startOfWeek(Carbon::SUNDAY),
                $anchor->copy()->endOfMonth()->startOfWeek(Carbon::SUNDAY)->addDays(6)->endOfDay(),
            ],
            default => [$anchor->copy()->startOfWeek(Carbon::SUNDAY), $anchor->copy()->startOfWeek(Carbon::SUNDAY)->addDays(6)->endOfDay()],
        };

        $bookings = Booking::query()
            ->with(['user', 'doctor', 'service'])
            ->whereBetween('starts_at', [$rangeStart, $rangeEnd])
            ->where('status', '!=', 'cancelled')
            ->orderBy('starts_at')
            ->get()
            ->groupBy(fn (Booking $b) => $b->starts_at->toDateString());

        $dayCount = (int) $rangeStart->diffInDays($rangeEnd) + 1;
        $currentMonth = $anchor->month;

        $days = collect(range(0, $dayCount - 1))->map(function (int $i) use ($rangeStart, $bookings, $currentMonth) {
            $date = $rangeStart->copy()->addDays($i);

            return [
                'date' => $date->toDateString(),
                'label' => $date->translatedFormat('D, j M'),
                'dayNumber' => $date->day,
                'isCurrentMonth' => $date->month === $currentMonth,
                'bookings' => BookingResource::collection($bookings->get($date->toDateString(), collect())),
            ];
        });

        [$prevAnchor, $nextAnchor] = match ($view) {
            'day' => [$anchor->copy()->subDay(), $anchor->copy()->addDay()],
            'month' => [$anchor->copy()->subMonth(), $anchor->copy()->addMonth()],
            default => [$anchor->copy()->subWeek(), $anchor->copy()->addWeek()],
        };

        return Inertia::render('admin/calendar', [
            'view' => $view,
            'date' => $anchor->toDateString(),
            'rangeStart' => $rangeStart->toDateString(),
            'rangeEnd' => $rangeEnd->toDateString(),
            'rangeLabel' => $this->rangeLabel($view, $rangeStart, $rangeEnd, $anchor),
            'prevDate' => $prevAnchor->toDateString(),
            'nextDate' => $nextAnchor->toDateString(),
            'today' => Carbon::now()->toDateString(),
            'days' => $days,
        ]);
    }

    private function rangeLabel(string $view, Carbon $start, Carbon $end, Carbon $anchor): string
    {
        return match ($view) {
            'day' => $anchor->translatedFormat('l, j F Y'),
            'month' => $anchor->translatedFormat('F Y'),
            default => $start->translatedFormat('j M').' - '.$end->translatedFormat('j M Y'),
        };
    }
}
