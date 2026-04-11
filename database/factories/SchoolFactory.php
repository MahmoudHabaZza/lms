<?php

namespace Database\Factories;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class SchoolFactory extends Factory
{
    protected $model = School::class;

    public function definition(): array
    {
        return [
            'city_id' => 1,
            'name' => 'مدرسة تجريبية',
            'address' => 'شارع المدرسة، الحي التعليمي',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}