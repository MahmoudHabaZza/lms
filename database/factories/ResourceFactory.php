<?php

namespace Database\Factories;

use App\Models\Resource;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceFactory extends Factory
{
    protected $model = Resource::class;

    public function definition(): array
    {
        return [
            'course_id' => 1,
            'lesson_id' => null,
            'title' => 'ملف مساعد',
            'file' => ArabicSeedSupport::resourceFile('general/support-file'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}