<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'General Consultation', 'Dental Cleaning', 'Skin Consultation',
            'Physiotherapy Session', 'Eye Examination', 'Nutrition Consultation',
        ]).' '.$this->faker->unique()->numberBetween(1, 9999);

        return [
            'name' => $name,
            'name_ar' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->sentence(12),
            'description_ar' => $this->faker->sentence(12),
            'duration_minutes' => $this->faker->randomElement([30, 45, 60, 90]),
            'price' => $this->faker->randomFloat(2, 100, 900),
            'active' => true,
        ];
    }
}
