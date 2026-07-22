<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    public function definition(): array
    {
        $startsAt = $this->faker->dateTimeBetween('-2 weeks', '+2 weeks');

        return [
            'starts_at' => $startsAt,
            'ends_at' => (clone $startsAt)->modify('+30 minutes'),
            'status' => BookingStatus::Pending,
            'notes' => null,
        ];
    }
}
