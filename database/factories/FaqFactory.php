<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

class FaqFactory extends Factory
{
    protected $model = Faq::class;

    public function definition(): array
    {
        return [
            'question' => 'سؤال شائع',
            'answer_type' => 'text',
            'answer_text' => 'إجابة توضيحية مختصرة.',
            'video_url' => null,
            'video_path' => null,
            'video_cover_image' => 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80',
            'status' => true,
            'sort_order' => fake()->numberBetween(1, 10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}