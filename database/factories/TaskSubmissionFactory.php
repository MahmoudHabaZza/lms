<?php

namespace Database\Factories;

use App\Models\TaskSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskSubmissionFactory extends Factory
{
    protected $model = TaskSubmission::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'graded', 'rejected']);

        return [
            'task_id' => 1,
            'student_id' => 1,
            'submission_file' => 'https://cdn.kid-coder.test/submissions/sample-project.zip',
            'submitted_at' => now()->subDays($this->faker->numberBetween(1, 20)),
            'score' => $status === 'graded' ? $this->faker->randomFloat(2, 55, 100) : null,
            'feedback' => $status === 'pending' ? null : 'العمل جيد ويحتاج إلى تحسين بسيط في التنظيم أو التوثيق.',
            'status' => $status,
            'graded_at' => $status === 'graded' ? now()->subDays($this->faker->numberBetween(0, 10)) : null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}