<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StudentLearningAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_open_lesson_for_course_they_do_not_own(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'is_active' => true,
        ]);
        $instructor = User::factory()->create(['role' => 'instructor']);
        $category = Category::query()->create(['name' => 'برمجة']);
        $course = Course::query()->create([
            'title' => 'كورس غير مسجل',
            'description' => 'وصف',
            'instructor_id' => $instructor->id,
            'category_id' => $category->id,
            'price' => 0,
            'total_duration_minutes' => 40,
        ]);
        $lesson = Lesson::query()->create([
            'course_id' => $course->id,
            'title' => 'الدرس الأول',
            'description' => 'وصف',
            'duration_minutes' => 20,
            'order' => 1,
        ]);

        $this->actingAs($student)
            ->get(route('student.lessons.show', $lesson))
            ->assertForbidden();
    }

    public function test_student_cannot_resubmit_task_when_resubmission_is_disabled(): void
    {
        Storage::fake('public');

        $student = User::factory()->create([
            'role' => 'student',
            'is_active' => true,
        ]);
        $instructor = User::factory()->create(['role' => 'instructor']);
        $category = Category::query()->create(['name' => 'روبوتكس']);
        $course = Course::query()->create([
            'title' => 'كورس الطالب',
            'description' => 'وصف',
            'instructor_id' => $instructor->id,
            'category_id' => $category->id,
            'price' => 0,
            'total_duration_minutes' => 60,
        ]);
        Enrollment::query()->create([
            'student_id' => $student->id,
            'course_id' => $course->id,
            'enrolled_at' => now(),
        ]);
        $task = Task::query()->create([
            'title' => 'مهمة 1',
            'description' => 'ارفع الحل',
            'course_id' => $course->id,
            'instructor_id' => $instructor->id,
            'allow_resubmission' => false,
        ]);

        $this->actingAs($student)
            ->withSession(['_token' => 'test-token'])
            ->post(route('student.tasks.submit', $task), [
                '_token' => 'test-token',
                'file' => UploadedFile::fake()->create('solution-one.pdf', 120, 'application/pdf'),
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('task_submissions', [
            'task_id' => $task->id,
            'student_id' => $student->id,
            'status' => 'pending',
        ]);

        $this->actingAs($student)
            ->withSession(['_token' => 'test-token'])
            ->post(route('student.tasks.submit', $task), [
                '_token' => 'test-token',
                'file' => UploadedFile::fake()->create('solution-two.pdf', 120, 'application/pdf'),
            ])
            ->assertSessionHasErrors('file');
    }
}
