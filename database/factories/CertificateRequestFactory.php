<?php

namespace Database\Factories;

use App\Models\CertificateRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class CertificateRequestFactory extends Factory
{
    protected $model = CertificateRequest::class;

    public function definition(): array
    {
        return [
            'student_id' => 1,
            'instructor_id' => 1,
            'course_title' => 'كورس تجريبي',
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}