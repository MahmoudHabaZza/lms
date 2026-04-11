<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Database\Factories\CourseReelFactory;
use Database\Factories\EnrollmentFactory;
use Database\Factories\ProgrammingCourseFactory;
use Database\Factories\StudentFeedbackImageFactory;
use Database\Factories\StudentReelFactory;
use Database\Seeders\Concerns\SeedsInChunks;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Seeder;

class ProgrammingShowcaseSeeder extends Seeder
{
    use SeedsInChunks;

    /**
     * @return array<int, array<string, int|float|string>>
     */
    private function extraProgrammingCourseBlueprints(): array
    {
        return [
            [
                'title' => 'ورشة Python للمبتدئين',
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'مدخل تدريجي للبرمجة النصية عبر Python بمشكلات وأنشطة مناسبة للناشئين.',
                'learning_outcome' => 'يكتب الطالب برامج قصيرة ويتعلم المتغيرات والشروط والحلقات بطريقة واضحة.',
                'duration_months' => 3,
                'sessions_count' => 20,
                'sessions_per_week' => 2,
                'badge' => 'مهارة أساسية',
                'accent_color' => '#1d4ed8',
                'price' => 459.00,
                'total_duration_minutes' => 1200,
            ],
            [
                'title' => 'مختبر التفكير الخوارزمي',
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'تدريبات ممتعة على تحليل المشكلة وتقسيمها إلى خطوات قابلة للتنفيذ.',
                'learning_outcome' => 'يكتسب الطالب مهارة كتابة خوارزميات مبسطة واختبارها وتحسينها.',
                'duration_months' => 2,
                'sessions_count' => 14,
                'sessions_per_week' => 2,
                'badge' => 'منطقي',
                'accent_color' => '#0f766e',
                'price' => 259.00,
                'total_duration_minutes' => 840,
            ],
            [
                'title' => 'ورشة القصص التفاعلية الرقمية',
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'صناعة قصص مرئية وشخصيات متحركة تجمع بين السرد والتفاعل والبرمجة.',
                'learning_outcome' => 'يبني الطالب قصة تفاعلية بصوت وحركة ومسارات متعددة للنهاية.',
                'duration_months' => 2,
                'sessions_count' => 16,
                'sessions_per_week' => 2,
                'badge' => 'إبداع رقمي',
                'accent_color' => '#db2777',
                'price' => 339.00,
                'total_duration_minutes' => 960,
            ],
            [
                'title' => 'معسكر بناء المتاجر الإلكترونية الصغيرة',
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'تعلم تصميم واجهات بيع مبسطة وربط المنتجات والسلة في مشروع تدريبي.',
                'learning_outcome' => 'يخرج الطالب بواجهة متجر رقمي صغيرة تعرض منتجاته وأفكاره.',
                'duration_months' => 3,
                'sessions_count' => 22,
                'sessions_per_week' => 2,
                'badge' => 'تجاري تقني',
                'accent_color' => '#ea580c',
                'price' => 489.00,
                'total_duration_minutes' => 1320,
            ],
            [
                'title' => 'تحدي الأمن الرقمي الذكي',
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1516321310764-8d2e0e0a0b5d?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'سيناريوهات عملية لتعليم الأطفال واليافعين حماية الحسابات والتعامل الآمن أونلاين.',
                'learning_outcome' => 'يفرق الطالب بين السلوك الرقمي الآمن والمخاطر الشائعة ويتخذ قرارات أفضل.',
                'duration_months' => 2,
                'sessions_count' => 12,
                'sessions_per_week' => 2,
                'badge' => 'وعي رقمي',
                'accent_color' => '#475569',
                'price' => 229.00,
                'total_duration_minutes' => 720,
            ],
            [
                'title' => 'مشروع روبوت المنزل الذكي',
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'مشروع تطبيقي يجمع الحساسات والبرمجة والمنطق لبناء سيناريو روبوت ذكي بسيط.',
                'learning_outcome' => 'يطور الطالب نموذجاً أولياً يفهم منه العلاقة بين الكود والأجهزة والمخرجات.',
                'duration_months' => 3,
                'sessions_count' => 22,
                'sessions_per_week' => 2,
                'badge' => 'STEM',
                'accent_color' => '#b91c1c',
                'price' => 559.00,
                'total_duration_minutes' => 1320,
            ],
            [
                'title' => 'استوديو التصميم الإبداعي للواجهات',
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'تعلم مبادئ الألوان والواجهة وتجربة المستخدم عبر مشروعات مناسبة للأعمار المختلفة.',
                'learning_outcome' => 'يصمم الطالب واجهات واضحة وجذابة لتطبيق أو موقع أو لعبة تعليمية.',
                'duration_months' => 2,
                'sessions_count' => 14,
                'sessions_per_week' => 2,
                'badge' => 'تصميم',
                'accent_color' => '#7c2d12',
                'price' => 319.00,
                'total_duration_minutes' => 840,
            ],
            [
                'title' => 'معمل صانع المحتوى البرمجي',
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'دمج البرمجة مع العرض والشرح ليصنع الطالب محتوى تقنياً مرئياً منظماً.',
                'learning_outcome' => 'ينتج الطالب عرضاً عملياً يشرح فيه مشروعه البرمجي بلغة بسيطة وواثقة.',
                'duration_months' => 2,
                'sessions_count' => 12,
                'sessions_per_week' => 2,
                'badge' => 'عرض ومهارات',
                'accent_color' => '#4338ca',
                'price' => 289.00,
                'total_duration_minutes' => 720,
            ],
        ];
    }

    public function run(): void
    {
        $now = now();
        $instructors = User::query()->where('role', 'instructor')->orderBy('id')->get(['id']);
        $students = User::query()->where('role', 'student')->orderBy('id')->get(['id']);
        $courseRows = [];
        $courseBlueprints = [
            ...ArabicSeedSupport::programmingCourseBlueprints(),
            ...$this->extraProgrammingCourseBlueprints(),
        ];

        foreach ($courseBlueprints as $index => $blueprint) {
            $courseRows[] = array_merge(ProgrammingCourseFactory::new()->raw(), $blueprint, [
                'description' => $blueprint['short_description'],
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'instructor_id' => $instructors[$index % $instructors->count()]->id,
                'category_id' => null,
                'drive_link' => 'https://drive.google.com/drive/folders/programming-course-'.($index + 1),
                'status' => true,
                'sort_order' => $index + 1,
                'legacy_programming_course_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
        $this->insertInChunks('courses', $courseRows);

        $courses = Course::query()->orderBy('id')->get();

        $enrollments = [];
        foreach ($students as $index => $student) {
            $courseCount = 1 + ($index % 2);
            $selected = [];
            for ($i = 0; $i < $courseCount; $i++) {
                $selected[] = $courses[($index + $i * 3) % $courses->count()]->id;
            }
            foreach (array_unique($selected) as $courseId) {
                $enrollments[] = array_merge(EnrollmentFactory::new()->raw(), [
                    'student_id' => $student->id,
                    'course_id' => $courseId,
                    'enrolled_at' => $now->copy()->subDays(($student->id + $courseId) % 180),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('enrollments', $enrollments);

        $reels = [];
        foreach ($courses as $index => $course) {
            $reels[] = array_merge(CourseReelFactory::new()->raw(), [
                'course_id' => $course->id,
                'title' => 'جولة سريعة داخل '.$course->title,
                'description' => 'فيديو قصير يعرض طبيعة الأنشطة والمشروع النهائي المتوقع داخل هذا الكورس.',
                'sort_order' => $index + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
        $this->insertInChunks('course_reels', $reels);

        $studentReels = [];
        for ($i = 0; $i < 10; $i++) {
            $profile = ArabicSeedSupport::userProfile($i + 40, 'student');
            $studentReels[] = array_merge(StudentReelFactory::new()->raw(), [
                'student_name' => $profile['name'],
                'student_title' => 'أنجز مشروعاً لافتاً داخل المنصة',
                'student_age' => 8 + ($i % 7),
                'quote' => ArabicSeedSupport::reelQuotes()[$i % count(ArabicSeedSupport::reelQuotes())],
                'sort_order' => $i + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
        $this->insertInChunks('student_reels', $studentReels);

        $feedbackImages = [];
        for ($i = 0; $i < 12; $i++) {
            $profile = ArabicSeedSupport::userProfile($i + 60, 'student', $i % 2 === 0 ? 'female' : 'male');
            $feedbackImages[] = array_merge(StudentFeedbackImageFactory::new()->raw(), [
                'student_name' => $profile['name'],
                'caption' => ArabicSeedSupport::feedbackCaptions()[$i % count(ArabicSeedSupport::feedbackCaptions())],
                'sort_order' => $i + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
        $this->insertInChunks('student_feedback_images', $feedbackImages);
    }
}
