<?php

namespace Database\Factories;

use App\Models\Course;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        $blueprint = $this->faker->randomElement(ArabicSeedSupport::courseBlueprints());

        return [
            'instructor_id' => 1,
            'category_id' => 1,
            'title' => $blueprint['title'],
            'description' => ArabicSeedSupport::courseDescription($blueprint),
            'thumbnail' => $blueprint['thumbnail'],
            'price' => $blueprint['price'],
            'total_duration_minutes' => 360,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}