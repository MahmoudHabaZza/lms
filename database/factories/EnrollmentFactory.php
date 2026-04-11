<?php

namespace Database\Factories;

use App\Models\Enrollment;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentFactory extends Factory
{
    protected $model = Enrollment::class;

    public function definition(): array
    {
        return [
            'student_id' => 1,
            'course_id' => 1,
            'enrolled_at' => now()->subDays($this->faker->numberBetween(1, 180)),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}