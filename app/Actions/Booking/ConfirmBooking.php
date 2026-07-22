<?php

namespace App\Actions\Booking;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Notifications\BookingConfirmed;

class ConfirmBooking
{
    public function handle(Booking $booking): Booking
    {
        $booking->update(['status' => BookingStatus::Confirmed]);

        $booking->user->notify(new BookingConfirmed($booking));

        return $booking;
    }
}
