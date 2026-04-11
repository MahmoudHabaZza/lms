<?php

namespace Database\Factories;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'title' => 'إشعار جديد',
            'message' => 'تم تحديث حالة نشاطك داخل المنصة.',
            'type' => fake()->randomElement(['info', 'success', 'warning', 'error']),
            'is_read' => fake()->boolean(40),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}