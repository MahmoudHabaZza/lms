<?php

namespace Database\Factories;

use App\Models\ProgrammingCourse;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgrammingCourseFactory extends Factory
{
    protected $model = ProgrammingCourse::class;

    public function definition(): array
    {
        $blueprint = fake()->randomElement(ArabicSeedSupport::programmingCourseBlueprints());

        return array_merge($blueprint, [
            'instructor_id' => 1,
            'age_group' => ProgrammingCourse::AGE_GROUP_5_TO_17,
            'category_id' => null,
            'drive_link' => 'https://drive.google.com/drive/folders/sample-course-folder',
            'status' => true,
            'sort_order' => fake()->numberBetween(1, 20),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
