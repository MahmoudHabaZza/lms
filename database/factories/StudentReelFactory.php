<?php

namespace Database\Factories;

use App\Models\StudentReel;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentReelFactory extends Factory
{
    protected $model = StudentReel::class;

    public function definition(): array
    {
        return [
            'student_name' => 'طالب مبدع',
            'student_title' => 'صاحب مشروع مميز',
            'student_age' => fake()->numberBetween(8, 15),
            'cover_image' => 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
            'video_path' => 'student-reels/sample-reel.mp4',
            'quote' => fake()->randomElement(ArabicSeedSupport::reelQuotes()),
            'status' => true,
            'sort_order' => fake()->numberBetween(1, 20),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}