<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'exam_id' => 1,
            'question_text' => 'سؤال تدريبي',
            'option_a' => 'الإجابة الأولى',
            'option_b' => 'الإجابة الثانية',
            'option_c' => 'الإجابة الثالثة',
            'option_d' => 'الإجابة الرابعة',
            'correct_option' => 'A',
            'mark' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}