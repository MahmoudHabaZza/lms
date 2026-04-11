<?php

namespace Database\Factories;

use App\Models\InstructorApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

class InstructorApplicationFactory extends Factory
{
    protected $model = InstructorApplication::class;

    public function definition(): array
    {
        return [
            'first_name' => 'متقدم',
            'last_name' => 'جديد',
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+201011223344',
            'position' => fake()->randomElement(array_keys(InstructorApplication::POSITIONS)),
            'cv_path' => 'applications/sample-cv.pdf',
            'notes' => 'يمتلك خبرة مناسبة في تعليم البرمجة للأطفال.',
            'status' => fake()->randomElement(InstructorApplication::STATUSES),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}