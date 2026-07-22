<?php

namespace App\Actions\Booking;

use App\Enums\BookingStatus;
use App\Exceptions\SlotUnavailableException;
use App\Models\Booking;
use App\Models\Doctor;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CreateBooking
{
    /**
     * @throws SlotUnavailableException
     */
    public function handle(User $user, Doctor $doctor, Service $service, Carbon $startsAt): Booking
    {
        return DB::transaction(function () use ($user, $doctor, $service, $startsAt) {
            try {
                return Booking::query()->create([
                    'user_id' => $user->id,
                    'doctor_id' => $doctor->id,
                    'service_id' => $service->id,
                    'starts_at' => $startsAt,
                    'ends_at' => $startsAt->copy()->addMinutes($service->duration_minutes),
                    'status' => BookingStatus::Pending,
                ]);
            } catch (QueryException $e) {
                if ($e->getCode() === '23000') {
                    throw new SlotUnavailableException;
                }

                throw $e;
            }
        });
    }
}
