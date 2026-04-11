<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'instructor_id' => 1,
            'course_id' => 1,
            'title' => 'مهمة تطبيقية',
            'description' => 'نفّذ المطلوب وارفع ملف الحل أو رابط المشروع.',
            'file' => null,
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'due_date' => now()->addDays($this->faker->numberBetween(3, 14)),
            'allow_resubmission' => $this->faker->boolean(35),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}