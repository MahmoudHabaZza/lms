<?php

namespace Database\Factories;

use App\Models\TopStudent;
use Illuminate\Database\Eloquent\Factories\Factory;

class TopStudentFactory extends Factory
{
    protected $model = TopStudent::class;

    public function definition(): array
    {
        $achievements = [
            'حصل على شهادة التميز في البرمجة الإبداعية',
            'أنجز مشروع لعبة تفاعلية متقدمة',
            'تميّز في مسار تطوير الويب للأطفال',
            'قدّم مشروعه النهائي بثقة واحترافية',
            'أبدع في تصميم واجهة مشروعه الشخصي',
            'أنهى المسار بدرجات عالية وإنجاز واضح',
        ];

        return [
            'student_name' => 'طالب متفوق',
            'achievement_title' => fake()->randomElement($achievements),
            'image_path' => fake()->randomElement([
                'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80',
            ]),
            'status' => true,
            'sort_order' => fake()->numberBetween(1, 20),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
