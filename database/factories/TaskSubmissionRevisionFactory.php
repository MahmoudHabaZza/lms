<?php

namespace Database\Factories;

use App\Models\TaskSubmissionRevision;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskSubmissionRevisionFactory extends Factory
{
    protected $model = TaskSubmissionRevision::class;

    public function definition(): array
    {
        return [
            'task_submission_id' => 1,
            'submission_file' => 'https://cdn.kid-coder.test/submissions/revision-project.zip',
            'submitted_at' => now()->subDays($this->faker->numberBetween(0, 7)),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}