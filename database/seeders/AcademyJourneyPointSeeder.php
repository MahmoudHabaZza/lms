<?php

namespace Database\Seeders;

use App\Models\AcademyJourneyPoint;
use Illuminate\Database\Seeder;

class AcademyJourneyPointSeeder extends Seeder
{
    public function run(): void
    {
        $points = [
            [
                'title' => 'سيشن أونلاين تفاعلية',
                'icon' => 'Users',
                'bubble_color' => '#1d9bf0',
                'bubble_style' => 'border-sky-500 bg-white text-sky-600',
                'status' => true,
                'sort_order' => 1,
            ],
            [
                'title' => '4 أطفال في الجروب',
                'icon' => 'UserRoundCheck',
                'bubble_color' => '#10b981',
                'bubble_style' => 'border-emerald-500 bg-white text-emerald-600',
                'status' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'شهادة معتمدة',
                'icon' => 'BadgeCheck',
                'bubble_color' => 'var(--site-primary-color)',
                'bubble_style' => 'border-orange-500 bg-white text-orange-500',
                'status' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'حساب خاص لمتابعة أداء الأبناء',
                'icon' => 'Trophy',
                'bubble_color' => '#e11d70',
                'bubble_style' => 'border-rose-600 bg-white text-rose-600',
                'status' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'مشاريع وتحديات تطبيقية',
                'icon' => 'Code2',
                'bubble_color' => 'var(--site-primary-500)',
                'bubble_style' => 'border-amber-500 bg-white text-amber-600',
                'status' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($points as $point) {
            AcademyJourneyPoint::query()->updateOrCreate(
                ['title' => $point['title']],
                $point,
            );
        }
    }
}
