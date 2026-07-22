<?php

namespace App\Actions\Booking;

use App\Enums\BookingStatus;
use App\Models\Booking;
use RuntimeException;

class CancelBooking
{
    /**
     * @throws RuntimeException
     */
    public function handle(Booking $booking): Booking
    {
        if (! $booking->canBeCancelled()) {
            throw new RuntimeException('This booking can no longer be cancelled — it is either already over or starts in less than 24 hours.');
        }

        $booking->update(['status' => BookingStatus::Cancelled]);

        return $booking;
    }
}
