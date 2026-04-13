<?php

namespace Database\Factories;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition(): array
    {
        return [
            'course_id' => 1,
            'title' => 'درس تطبيقي',
            'description' => 'شرح مبسط وتمرين عملي.',
            'video_source' => Lesson::VIDEO_SOURCE_YOUTUBE,
            'video_url' => 'https://www.youtube.com/embed/UB1O30fR-EE',
            'video_path' => null,
            'duration_minutes' => $this->faker->numberBetween(18, 35),
            'order' => $this->faker->numberBetween(1, 12),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}