<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AdminStudentCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_admin_can_create_student_and_assign_courses(): void
    {
        Mail::fake();

        $admin = $this->createAdmin();
        [$firstCourse, $secondCourse] = $this->createCourses();
        $generatedPassword = 'AaKid89!xy';

        $response = $this->actingAs($admin)->post('/admin/students', [
            'name' => 'أحمد محمد',
            'email' => 'ahmed.student@kid-coder.test',
            'username' => 'ahmedstudent',
            'phone_number' => '+201001112233',
            'is_active' => true,
            'password_mode' => 'auto',
            'password' => $generatedPassword,
            'course_ids' => [$firstCourse->id, $secondCourse->id],
        ]);

        $response->assertRedirect('/admin/students');
        $response->assertSessionHasNoErrors();

        $student = User::query()->where('email', 'ahmed.student@kid-coder.test')->firstOrFail();

        $this->assertSame('student', $student->role);
        $this->assertTrue($student->is_active);
        $this->assertTrue(Hash::check($generatedPassword, $student->password));
        $this->assertDatabaseHas('enrollments', [
            'student_id' => $student->id,
            'course_id' => $firstCourse->id,
        ]);
        $this->assertDatabaseHas('enrollments', [
            'student_id' => $student->id,
            'course_id' => $secondCourse->id,
        ]);

        Mail::assertNothingSent();
    }

    public function test_admin_can_update_student_and_sync_courses(): void
    {
        Mail::fake();

        $admin = $this->createAdmin();
        [$oldCourse, $newCourse] = $this->createCourses();
        $student = User::factory()->student()->create();

        Enrollment::query()->create([
            'student_id' => $student->id,
            'course_id' => $oldCourse->id,
            'enrolled_at' => now(),
        ]);

        $response = $this->actingAs($admin)->put("/admin/students/{$student->id}", [
            'name' => 'سارة علي',
            'email' => 'sara.updated@kid-coder.test',
            'username' => 'saraupdated',
            'phone_number' => '+201009998887',
            'is_active' => false,
            'password_action' => 'keep',
            'course_ids' => [$newCourse->id],
        ]);

        $response->assertRedirect("/admin/students/{$student->id}/edit");
        $response->assertSessionHasNoErrors();

        $student->refresh();

        $this->assertSame('سارة علي', $student->name);
        $this->assertSame('sara.updated@kid-coder.test', $student->email);
        $this->assertFalse($student->is_active);
        $this->assertDatabaseMissing('enrollments', [
            'student_id' => $student->id,
            'course_id' => $oldCourse->id,
        ]);
        $this->assertDatabaseHas('enrollments', [
            'student_id' => $student->id,
            'course_id' => $newCourse->id,
        ]);

        Mail::assertNothingSent();
    }

    public function test_admin_can_delete_student_and_related_enrollments(): void
    {
        $admin = $this->createAdmin();
        [$course] = $this->createCourses(1);
        $student = User::factory()->student()->create();

        Enrollment::query()->create([
            'student_id' => $student->id,
            'course_id' => $course->id,
            'enrolled_at' => now(),
        ]);

        $response = $this->actingAs($admin)->delete("/admin/students/{$student->id}");

        $response->assertRedirect('/admin/students');
        $this->assertDatabaseMissing('users', ['id' => $student->id]);
        $this->assertDatabaseMissing('enrollments', ['student_id' => $student->id]);
    }

    public function test_student_creation_validates_required_fields(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->from('/admin/students/create')->post('/admin/students', [
            'name' => '',
            'email' => 'not-an-email',
            'password_mode' => 'manual',
            'password' => '',
        ]);

        $response->assertRedirect('/admin/students/create');
        $response->assertSessionHasErrors(['name', 'email', 'password']);
    }

    private function createAdmin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
            'is_staff' => true,
            'is_superuser' => true,
        ]);
    }

    /**
     * @return array<int, Course>
     */
    private function createCourses(int $count = 2): array
    {
        $instructor = User::factory()->instructor()->create();
        $category = Category::query()->create([
            'name' => 'تطوير الويب',
            'slug' => 'web-development-'.str()->random(6),
        ]);

        return collect(range(1, $count))
            ->map(fn (int $index) => Course::query()->create([
                'title' => 'كورس برمجة '.$index,
                'description' => 'وصف تفصيلي مبسط للكورس.',
                'short_description' => 'وصف مختصر لكورس برمجة مخصص لاختبارات لوحة التحكم.',
                'learning_outcome' => 'بناء مشروع بسيط وتطبيق المفاهيم الأساسية.',
                'instructor_id' => $instructor->id,
                'category_id' => $category->id,
                'drive_link' => 'https://drive.google.com/drive/folders/course-'.$index,
                'age_group' => Course::AGE_GROUP_5_TO_17,
                'thumbnail' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
                'duration_months' => 3,
                'sessions_count' => 12,
                'sessions_per_week' => 2,
                'badge' => 'مناسب للمبتدئين',
                'accent_color' => '#f97316',
                'status' => true,
                'sort_order' => $index,
                'price' => 1200,
                'total_duration_minutes' => 480,
            ]))
            ->all();
    }
}
