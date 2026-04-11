<?php

namespace Database\Factories;

use App\Models\CourseReel;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseReelFactory extends Factory
{
    protected $model = CourseReel::class;

    public function definition(): array
    {
        return [
            'course_id' => 1,
            'title' => 'لقطة من مسار برمجي',
            'cover_image' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
            'video_source' => 'upload',
            'video_url' => 'https://www.youtube.com/embed/UB1O30fR-EE',
            'video_path' => 'course-reels/sample-reel.mp4',
            'description' => 'عرض سريع لفكرة المسار والمشروع النهائي المتوقع.',
            'status' => true,
            'sort_order' => fake()->numberBetween(1, 20),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
