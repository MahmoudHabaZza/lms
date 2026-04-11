<?php

namespace Database\Factories;

use App\Models\BannerSlide;
use Illuminate\Database\Eloquent\Factories\Factory;

class BannerSlideFactory extends Factory
{
    protected $model = BannerSlide::class;

    public function definition(): array
    {
        return [
            'title' => 'عنوان رئيسي',
            'sub_title' => 'عنوان فرعي',
            'description' => 'وصف قصير لشريحة الصفحة الرئيسية.',
            'button_link' => '/courses',
            'background_image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
            'status' => true,
            'sort_order' => fake()->numberBetween(1, 10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}