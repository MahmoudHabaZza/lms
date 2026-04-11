<?php

namespace Database\Factories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

class SettingFactory extends Factory
{
    protected $model = Setting::class;

    public function definition(): array
    {
        return [
            'key' => 'setting_'.fake()->unique()->slug(),
            'value' => fake()->sentence(),
            'type' => 'string',
            'group' => fake()->randomElement(['general', 'colors', 'mail']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}