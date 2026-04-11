<?php

namespace Database\Factories;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    public function definition(): array
    {
        return [
            'attempt_id' => 1,
            'student_id' => 1,
            'exam_id' => 1,
            'certificate_code' => 'CERT-'.Str::upper(Str::random(10)),
            'verification_code' => 'VERIFY-'.Str::upper(Str::random(12)),
            'image' => 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
            'issued_at' => now()->subDays($this->faker->numberBetween(1, 30)),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}