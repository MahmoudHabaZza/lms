<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Notification;
use App\Models\Resource;
use App\Models\Review;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentDashboardFeaturesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_enrolled_student_can_create_or_update_course_review(): void
    {
        [$student, $course] = $this->createEnrolledStudentWithCourse();

        $this->actingAs($student)
            ->post(route('student.courses.reviews.store', $course), [
                'rating' => 5,
                'comment' => 'الكورس منظم جدًا والشرح واضح والمحتوى مناسب للمستوى الحالي.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('reviews', [
            'course_id' => $course->id,
            'student_id' => $student->id,
            'rating' => 5,
        ]);

        $this->actingAs($student)
            ->post(route('student.courses.reviews.store', $course), [
                'rating' => 4,
                'comment' => 'تحديث للتقييم بعد إنهاء المزيد من الدروس، التجربة ما زالت ممتازة.',
            ])
            ->assertRedirect();

        $this->assertSame(1, Review::query()->where('course_id', $course->id)->where('student_id', $student->id)->count());
        $this->assertDatabaseHas('reviews', [
            'course_id' => $course->id,
            'student_id' => $student->id,
            'rating' => 4,
        ]);
    }

    public function test_student_can_submit_task_with_text_only(): void
    {
        [$student, $course, $instructor] = $this->createEnrolledStudentWithCourse();

        $task = Task::query()->create([
            'title' => 'مهمة نصية',
            'description' => 'اكتب شرحًا موجزًا للحل',
            'course_id' => $course->id,
            'instructor_id' => $instructor->id,
            'allow_resubmission' => true,
        ]);

        $this->actingAs($student)
            ->post(route('student.tasks.submit', $task), [
                'submission_text' => 'قمت بحل المهمة عبر تقسيم المشكلة إلى خطوات وكتبت الفكرة الأساسية بالتفصيل.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('task_submissions', [
            'task_id' => $task->id,
            'student_id' => $student->id,
            'submission_text' => 'قمت بحل المهمة عبر تقسيم المشكلة إلى خطوات وكتبت الفكرة الأساسية بالتفصيل.',
        ]);
        $this->assertDatabaseHas('task_submission_revisions', [
            'submission_text' => 'قمت بحل المهمة عبر تقسيم المشكلة إلى خطوات وكتبت الفكرة الأساسية بالتفصيل.',
        ]);
    }

    public function test_student_can_view_notifications_and_mark_them_as_read(): void
    {
        $student = User::factory()->student()->create();

        $notification = Notification::query()->create([
            'user_id' => $student->id,
            'title' => 'تم تقييم مهمتك',
            'message' => 'راجع ملاحظات المدرّس على آخر تسليم.',
            'type' => 'success',
            'is_read' => false,
        ]);

        $this->actingAs($student)
            ->get(route('student.notifications.index'))
            ->assertOk();

        $this->actingAs($student)
            ->post(route('student.notifications.read', $notification))
            ->assertRedirect();

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'is_read' => true,
        ]);
    }

    public function test_student_dashboard_loads_lesson_resources_without_lazy_loading_violations(): void
    {
        [$student, $course] = $this->createEnrolledStudentWithCourse();

        $lesson = Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'الدرس الأول',
            'description' => 'مقدمة سريعة',
            'video_source' => Lesson::VIDEO_SOURCE_YOUTUBE,
            'video_url' => 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            'duration_minutes' => 15,
            'order' => 1,
        ]);

        Resource::query()->create([
            'course_id' => $course->id,
            'lesson_id' => $lesson->id,
            'title' => 'ملف الدرس',
            'file' => 'resources/lesson-one.pdf',
        ]);

        $this->actingAs($student)
            ->get(route('student.dashboard'))
            ->assertOk();
    }

    private function createEnrolledStudentWithCourse(): array
    {
        $student = User::factory()->student()->create();
        $instructor = User::factory()->instructor()->create();
        $category = Category::query()->create([
            'name' => 'تطوير الويب',
            'slug' => 'web-development-'.str()->random(6),
        ]);
        $course = Course::query()->create([
            'title' => 'مقدمة في تطوير الويب',
            'description' => 'كورس تجريبي لاختبارات لوحة الطالب.',
            'instructor_id' => $instructor->id,
            'category_id' => $category->id,
            'price' => 0,
            'total_duration_minutes' => 120,
        ]);

        Enrollment::query()->create([
            'student_id' => $student->id,
            'course_id' => $course->id,
            'enrolled_at' => now(),
        ]);

        return [$student, $course, $instructor];
    }
}
