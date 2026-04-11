<?php

namespace Database\Factories;

use App\Models\LessonProgress;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonProgressFactory extends Factory
{
    protected $model = LessonProgress::class;

    public function definition(): array
    {
        $progress = $this->faker->numberBetween(0, 100);

        return [
            'student_id' => 1,
            'lesson_id' => 1,
            'progress_percent' => $progress,
            'time_spent_minutes' => $this->faker->numberBetween(5, 90),
            'is_completed' => $progress === 100,
            'completed_at' => $progress === 100 ? now()->subDays($this->faker->numberBetween(1, 60)) : null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}