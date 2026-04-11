<?php

namespace Database\Factories;

use App\Models\CourseEnrollment;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseEnrollmentFactory extends Factory
{
    protected $model = CourseEnrollment::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'programming_course_id' => 1,
            'enrolled_at' => now()->subDays(fake()->numberBetween(1, 180)),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
