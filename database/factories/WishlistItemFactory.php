<?php

namespace Database\Factories;

use App\Models\WishlistItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class WishlistItemFactory extends Factory
{
    protected $model = WishlistItem::class;

    public function definition(): array
    {
        return [
            'student_id' => 1,
            'course_id' => 1,
            'created_at' => now()->subDays($this->faker->numberBetween(1, 120)),
        ];
    }
}