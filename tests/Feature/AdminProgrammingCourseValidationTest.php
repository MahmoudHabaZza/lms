<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProgrammingCourseValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_admin_cannot_assign_student_as_course_instructor(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
            'is_staff' => true,
            'is_superuser' => true,
        ]);
        $student = User::factory()->student()->create();

        $response = $this->actingAs($admin)
            ->from('/admin/courses/create')
            ->post('/admin/courses', [
                'title' => 'مقدمة في الأمن الرقمي',
                'description' => 'وصف تفصيلي للكورس.',
                'thumbnail' => 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
                'short_description' => 'كورس تجريبي لاختبار التحقق من المدرّب.',
                'learning_outcome' => 'فهم الأساسيات',
                'duration_months' => 2,
                'sessions_count' => 8,
                'sessions_per_week' => 2,
                'badge' => 'جديد',
                'accent_color' => '#0f766e',
                'status' => true,
                'sort_order' => 1,
                'instructor_id' => $student->id,
                'price' => 0,
                'total_duration_minutes' => 240,
            ]);

        $response->assertRedirect('/admin/courses/create');
        $response->assertSessionHasErrors(['instructor_id']);
    }
}
