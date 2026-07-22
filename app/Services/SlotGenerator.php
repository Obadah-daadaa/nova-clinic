<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Doctor;
use App\Models\Service;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class SlotGenerator
{
    /**
     * Build the list of available start times for a doctor performing a
     * given service on a given date, based on their weekly schedule minus
     * any slots already booked (and, for today, minus times already past).
     *
     * @return Collection<int, CarbonInterface>
     */
    public function forDoctorOnDate(Doctor $doctor, Service $service, CarbonInterface $date): Collection
    {
        $weekday = $date->dayOfWeek;

        $schedules = $doctor->schedules()->where('weekday', $weekday)->get();

        if ($schedules->isEmpty()) {
            return collect();
        }

        $duration = $service->duration_minutes;

        $taken = $doctor->bookings()
            ->whereDate('starts_at', $date->toDateString())
            ->where('status', '!=', BookingStatus::Cancelled->value)
            ->pluck('starts_at')
            ->map(fn ($startsAt) => Carbon::parse($startsAt)->format('H:i'))
            ->all();

        $now = now();

        $slots = collect();

        foreach ($schedules as $schedule) {
            $cursor = $date->copy()->setTimeFromTimeString($schedule->start_time);
            $end = $date->copy()->setTimeFromTimeString($schedule->end_time);

            while ($cursor->copy()->addMinutes($duration)->lte($end)) {
                if (! in_array($cursor->format('H:i'), $taken, true) && $cursor->gt($now)) {
                    $slots->push($cursor->copy());
                }

                $cursor = $cursor->addMinutes($duration);
            }
        }

        return $slots->values();
    }
}
