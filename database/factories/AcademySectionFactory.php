<?php

namespace Database\Factories;

use App\Models\AcademySection;
use Illuminate\Database\Eloquent\Factories\Factory;

class AcademySectionFactory extends Factory
{
    protected $model = AcademySection::class;

    public function definition(): array
    {
        return [
            'title' => 'ميزة تعليمية',
            'description' => 'وصف مختصر لميزة داخل الأكاديمية.',
            'status' => true,
            'sort_order' => fake()->numberBetween(1, 10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}