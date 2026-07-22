<?php

namespace Database\Factories;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Doctor>
 */
class DoctorFactory extends Factory
{
    public function definition(): array
    {
        $name = 'Dr. '.$this->faker->unique()->name();

        return [
            'user_id' => null,
            'name' => $name,
            'name_ar' => $name,
            'slug' => Str::slug($name),
            'title' => 'General Practitioner',
            'title_ar' => 'طبيب عام',
            'photo_path' => null,
            'bio' => $this->faker->paragraph(),
            'bio_ar' => $this->faker->paragraph(),
            'active' => true,
        ];
    }
}
