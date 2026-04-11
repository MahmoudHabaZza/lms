<?php

namespace Database\Factories;

use App\Models\City;
use Illuminate\Database\Eloquent\Factories\Factory;

class CityFactory extends Factory
{
    protected $model = City::class;

    public function definition(): array
    {
        return [
            'name' => 'مدينة تجريبية',
            'slug' => 'test-city-'.fake()->unique()->numberBetween(1, 999),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}