<?php

namespace Database\Seeders;

use App\Models\TopStudent;
use Illuminate\Database\Seeder;

class TopStudentsSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            [
                'student_name' => 'ليان محمود',
                'achievement_title' => 'أنجزت مشروع لعبة تفاعلية كاملة في مسار Scratch وقدّمتها بثقة في حفل التكريم.',
                'image_path' => 'https://images.pexels.com/photos/6623388/pexels-photo-6623388.jpeg?cs=srgb&dl=pexels-ph-m-anh-22474306-6623388.jpg&fm=jpg',
                'status' => true,
                'sort_order' => 1,
            ],
            [
                'student_name' => 'آدم خالد',
                'achievement_title' => 'أتم مسار تطوير الويب للأطفال وصمّم صفحة تعريفية منظمة خاصة بمشروعه.',
                'image_path' => 'https://images.pexels.com/photos/6623391/pexels-photo-6623391.jpeg?cs=srgb&dl=pexels-ph-m-anh-22474306-6623391.jpg&fm=jpg',
                'status' => true,
                'sort_order' => 2,
            ],
            [
                'student_name' => 'يارا محمد',
                'achievement_title' => 'تميّزت في تنفيذ المشروع النهائي وحصلت على إشادة خاصة بجودة العرض والتنفيذ.',
                'image_path' => 'https://images.pexels.com/photos/6623387/pexels-photo-6623387.jpeg?cs=srgb&dl=pexels-ph-m-anh-22474306-6623387.jpg&fm=jpg',
                'status' => true,
                'sort_order' => 3,
            ],
            [
                'student_name' => 'تاليا أحمد',
                'achievement_title' => 'أظهرت تقدماً واضحاً في البرمجة المبكرة وأنهت تحديات المنطق بسرعة مميزة.',
                'image_path' => 'https://images.pexels.com/photos/19697933/pexels-photo-19697933.jpeg?cs=srgb&dl=pexels-fabricio-miranda-59602090-19697933.jpg&fm=jpg',
                'status' => true,
                'sort_order' => 4,
            ],
            [
                'student_name' => 'جنى علي',
                'achievement_title' => 'قدّمت عملاً مميزاً في المسار الإبداعي وأكملت مشروعها بدرجة عالية.',
                'image_path' => 'https://images.pexels.com/photos/19697928/pexels-photo-19697928.jpeg?cs=srgb&dl=pexels-fabricio-miranda-59602090-19697928.jpg&fm=jpg',
                'status' => true,
                'sort_order' => 5,
            ],
            [
                'student_name' => 'سارة طارق',
                'achievement_title' => 'حصلت على شهادة تقدير بعد التزام مستمر وتفوّق واضح في الأنشطة التطبيقية.',
                'image_path' => 'https://images.pexels.com/photos/36781105/pexels-photo-36781105.png?cs=srgb&dl=pexels-ng-c-bich-ki-u-677928210-36781105.jpg&fm=jpg',
                'status' => true,
                'sort_order' => 6,
            ],
            [
                'student_name' => 'زياد كريم',
                'achievement_title' => 'تميّز في العمل الجماعي والمشروع النهائي، وظهر بوضوح في فعالية التكريم المدرسية.',
                'image_path' => 'https://images.pexels.com/photos/31772892/pexels-photo-31772892.jpeg?cs=srgb&dl=pexels-vietchung-31772892.jpg&fm=jpg',
                'status' => true,
                'sort_order' => 7,
            ],
            [
                'student_name' => 'حمزة هشام',
                'achievement_title' => 'حقق نتائج قوية في المسار العملي وكان من أبرز الطلاب في يوم الجوائز.',
                'image_path' => 'https://images.pexels.com/photos/31772913/pexels-photo-31772913.jpeg?cs=srgb&dl=pexels-vietchung-31772913.jpg&fm=jpg',
                'status' => true,
                'sort_order' => 8,
            ],
        ];

        $studentNames = array_column($students, 'student_name');

        foreach ($students as $student) {
            TopStudent::query()->updateOrCreate(
                ['student_name' => $student['student_name']],
                $student,
            );
        }

        TopStudent::query()
            ->whereNotIn('student_name', $studentNames)
            ->update([
                'sort_order' => 999,
            ]);
    }
}
