<?php

namespace Database\Factories;

use App\Models\Exam;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamFactory extends Factory
{
    protected $model = Exam::class;

    public function definition(): array
    {
        return [
            'course_id' => 1,
            'title' => 'اختبار نهاية الوحدة',
            'description' => 'اختبار قصير يقيس استيعاب أهم المهارات العملية داخل الكورس.',
            'time_limit' => 25,
            'total_marks' => 25,
            'publish_date' => now()->subDays($this->faker->numberBetween(1, 60)),
            'max_attempts' => 2,
            'allowed_tab_switches' => 2,
            'pass_percentage' => 60,
            'randomize_questions' => true,
            'randomize_answers' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}