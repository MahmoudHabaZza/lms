<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademySection;
use App\Models\BannerSlide;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\CertificateRequest;
use App\Models\Course;
use App\Models\CourseReel;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Faq;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Notification;
use App\Models\Permission;
use App\Models\Question;
use App\Models\Resource;
use App\Models\Role;
use App\Models\StudentAnswer;
use App\Models\StudentExamAttempt;
use App\Models\StudentFeedbackImage;
use App\Models\StudentReel;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\TopStudent;
use App\Models\User;
use App\Models\WishlistItem;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    private function countActive(string $modelClass, string $column = 'status', mixed $activeValue = true): ?int
    {
        $table = (new $modelClass)->getTable();

        if (! Schema::hasColumn($table, $column)) {
            return null;
        }

        return $modelClass::query()->where($column, $activeValue)->count();
    }

    public function index(): Response
    {
        $students = User::query()->where('role', 'student')->count();

        return Inertia::render('admin/dashboard/index', [
            'highlights' => [
                'users' => User::query()->count(),
                'students' => $students,
                'courses' => Course::query()->count(),
                'enrollments' => Enrollment::query()->count(),
            ],
            'sections' => [
                [
                    'title' => 'المحتوى والواجهة',
                    'items' => [
                        ['label' => 'شرائح الواجهة', 'total' => BannerSlide::query()->count(), 'active' => $this->countActive(BannerSlide::class), 'href' => '/admin/banner-slides'],
                        ['label' => 'أقسام الأكاديمية', 'total' => AcademySection::query()->count(), 'active' => $this->countActive(AcademySection::class), 'href' => '/admin/academy-sections'],
                        ['label' => 'التصنيفات', 'total' => Category::query()->count(), 'href' => '/admin/categories'],
                        ['label' => 'ريلز الطلاب', 'total' => StudentReel::query()->count(), 'active' => $this->countActive(StudentReel::class), 'href' => '/admin/student-reels'],
                        ['label' => 'ريلز الكورسات', 'total' => CourseReel::query()->count(), 'active' => $this->countActive(CourseReel::class), 'href' => '/admin/course-reels'],
                        ['label' => 'الطلاب المتفوقون', 'total' => TopStudent::query()->count(), 'active' => $this->countActive(TopStudent::class), 'href' => '/admin/top-students'],
                        ['label' => 'آراء الطلاب', 'total' => StudentFeedbackImage::query()->count(), 'active' => $this->countActive(StudentFeedbackImage::class), 'href' => '/admin/student-feedback-images'],
                        ['label' => 'الأسئلة الشائعة', 'total' => Faq::query()->count(), 'active' => $this->countActive(Faq::class), 'href' => '/admin/faqs'],
                    ],
                ],
                [
                    'title' => 'التعلم والمحتوى الدراسي',
                    'items' => [
                        ['label' => 'الكورسات', 'total' => Course::query()->count(), 'active' => $this->countActive(Course::class), 'href' => '/admin/courses'],
                        ['label' => 'الدروس', 'total' => Lesson::query()->count(), 'active' => $this->countActive(Lesson::class), 'href' => '/admin/lessons'],
                        ['label' => 'الموارد', 'total' => Resource::query()->count(), 'active' => $this->countActive(Resource::class), 'href' => '/admin/resources'],
                        ['label' => 'طلبات التسجيل', 'total' => Enrollment::query()->count(), 'href' => '/admin/enrollments'],
                        ['label' => 'المفضلة', 'total' => WishlistItem::query()->count(), 'href' => '/admin/wishlist-items'],
                        ['label' => 'المهام', 'total' => Task::query()->count(), 'active' => $this->countActive(Task::class), 'href' => '/admin/tasks'],
                        ['label' => 'تسليمات المهام', 'total' => TaskSubmission::query()->count(), 'href' => '/admin/task-submissions'],
                        ['label' => 'تقدم الدروس', 'total' => LessonProgress::query()->count(), 'href' => '/admin/lesson-progress'],
                    ],
                ],
                [
                    'title' => 'التقييمات والشهادات',
                    'items' => [
                        ['label' => 'الاختبارات', 'total' => Exam::query()->count(), 'active' => $this->countActive(Exam::class), 'href' => '/admin/exams'],
                        ['label' => 'الأسئلة', 'total' => Question::query()->count(), 'href' => '/admin/questions'],
                        ['label' => 'محاولات الاختبار', 'total' => StudentExamAttempt::query()->count(), 'href' => '/admin/attempts'],
                        ['label' => 'إجابات الطلاب', 'total' => StudentAnswer::query()->count(), 'href' => '/admin/student-answers'],
                        ['label' => 'الشهادات', 'total' => Certificate::query()->count(), 'href' => '/admin/certificates'],
                        ['label' => 'طلبات الشهادات', 'total' => CertificateRequest::query()->count(), 'href' => '/admin/certificate-requests'],
                    ],
                ],
                [
                    'title' => 'المستخدمون والصلاحيات',
                    'items' => [
                        ['label' => 'كل المستخدمين', 'total' => User::query()->count(), 'href' => '/admin/users'],
                        ['label' => 'المشرفون', 'total' => User::query()->where('is_admin', true)->count(), 'href' => '/admin/users'],
                        ['label' => 'الطلاب', 'total' => $students, 'href' => '/admin/students'],
                        ['label' => 'الأدوار', 'total' => Role::query()->count(), 'href' => '/admin/roles'],
                        ['label' => 'الصلاحيات', 'total' => Permission::query()->count(), 'href' => '/admin/permissions'],
                        ['label' => 'الإشعارات', 'total' => Notification::query()->count(), 'href' => '/admin/notifications'],
                    ],
                ],
            ],
            'quickLinks' => [
                ['title' => 'إدارة شرائح الواجهة', 'href' => '/admin/banner-slides'],
                ['title' => 'إدارة أقسام الأكاديمية', 'href' => '/admin/academy-sections'],
                ['title' => 'إدارة الكورسات', 'href' => '/admin/courses'],
                ['title' => 'إدارة الطلاب', 'href' => '/admin/students'],
                ['title' => 'إدارة الاختبارات', 'href' => '/admin/exams'],
                ['title' => 'إعدادات الموقع', 'href' => '/admin/settings'],
                ['title' => 'عرض الموقع', 'href' => '/'],
            ],
        ]);
    }
}
