<?php

namespace Database\Factories;

use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Schedule>
 */
class ScheduleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'weekday' => $this->faker->numberBetween(0, 4),
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
        ];
    }
}
