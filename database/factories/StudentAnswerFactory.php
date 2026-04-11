<?php

namespace Database\Factories;

use App\Models\StudentAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentAnswerFactory extends Factory
{
    protected $model = StudentAnswer::class;

    public function definition(): array
    {
        return [
            'attempt_id' => 1,
            'question_id' => 1,
            'selected_option' => $this->faker->randomElement(['A', 'B', 'C', 'D']),
            'is_correct' => $this->faker->boolean(60),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}