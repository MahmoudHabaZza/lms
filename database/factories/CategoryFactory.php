<?php

namespace Database\Factories;

use App\Models\Category;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $category = $this->faker->randomElement(ArabicSeedSupport::categories());

        return [
            'name' => $category['name'],
            'slug' => $category['slug'].'-'.$this->faker->unique()->numberBetween(1, 999),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}