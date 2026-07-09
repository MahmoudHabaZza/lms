<?php

namespace Tests\Feature\Student;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\Student\StudentCourseService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentCourseLinksTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_registration_can_store_optional_drive_and_telegram_links(): void
    {
        $response = $this->post('/register', [
            'name' => 'Student Name',
            'email' => 'student@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'student',
            'drive_link' => 'https://drive.google.com/drive/folders/abc123',
            'telegram_link' => 'https://t.me/kidcoder',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email' => 'student@example.com',
            'drive_link' => 'https://drive.google.com/drive/folders/abc123',
            'telegram_link' => 'https://t.me/kidcoder',
        ]);
    }

    public function test_course_payload_uses_external_content_when_student_has_links(): void
    {
        $student = User::factory()->student()->create();
        $course = Course::create([
            'title' => 'Test course',
            'description' => 'Test description',
            'status' => true,
        ]);

        Enrollment::create([
            'student_id' => $student->id,
            'course_id' => $course->id,
            'enrolled_at' => now(),
        ]);

        $student->forceFill([
            'drive_link' => 'https://drive.google.com/drive/folders/abc123',
            'telegram_link' => null,
        ])->save();

        $service = app(StudentCourseService::class);
        $payload = $service->courseShowPayload($student, $course);

        $this->assertSame('links', $payload['content_mode']);
        $this->assertSame('https://drive.google.com/drive/folders/abc123', $payload['course_links']['drive_link']);
        $this->assertNull($payload['course_links']['telegram_link']);
    }
}
