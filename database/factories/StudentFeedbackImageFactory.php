<?php

namespace Database\Factories;

use App\Models\StudentFeedbackImage;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFeedbackImageFactory extends Factory
{
    protected $model = StudentFeedbackImage::class;

    public function definition(): array
    {
        return [
            'student_name' => 'طالب مجتهد',
            'caption' => fake()->randomElement(ArabicSeedSupport::feedbackCaptions()),
            'image_path' => 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80',
            'status' => true,
            'sort_order' => fake()->numberBetween(1, 20),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}