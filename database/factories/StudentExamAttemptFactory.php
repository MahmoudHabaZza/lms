<?php

namespace Database\Factories;

use App\Models\StudentExamAttempt;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentExamAttemptFactory extends Factory
{
    protected $model = StudentExamAttempt::class;

    public function definition(): array
    {
        return [
            'student_id' => 1,
            'exam_id' => 1,
            'score' => $this->faker->randomFloat(2, 8, 25),
            'started_at' => now()->subDays($this->faker->numberBetween(1, 30))->subMinutes(35),
            'finished_at' => now()->subDays($this->faker->numberBetween(1, 30)),
            'is_passed' => $this->faker->boolean(65),
            'status' => $this->faker->randomElement(['submitted', 'auto_submitted', 'terminated']),
            'attempt_number' => $this->faker->numberBetween(1, 2),
            'time_taken_seconds' => $this->faker->numberBetween(300, 1800),
            'tab_switch_count' => $this->faker->numberBetween(0, 2),
            'termination_reason' => null,
            'question_order' => null,
            'answer_order' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}