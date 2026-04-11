<?php

namespace Tests\Feature;

use App\Models\TopStudent;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminTopStudentCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
        $this->withoutMiddleware(VerifyCsrfToken::class);
        Storage::fake('public');
    }

    public function test_admin_can_create_top_student_with_uploaded_image(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/top-students', [
            'student_name' => 'سارة أحمد',
            'achievement_title' => 'أنجزت مشروع لعبة تعليمية كاملة',
            'image_file' => UploadedFile::fake()->image('top-student.jpg'),
            'status' => true,
            'sort_order' => 3,
        ]);

        $response->assertRedirect('/admin/top-students');
        $response->assertSessionHasNoErrors();

        $student = TopStudent::query()->where('student_name', 'سارة أحمد')->firstOrFail();

        $this->assertSame('أنجزت مشروع لعبة تعليمية كاملة', $student->achievement_title);
        $this->assertTrue($student->status);
        $this->assertSame(3, $student->sort_order);
        $this->assertNotNull($student->image_path);
        Storage::disk('public')->assertExists($student->image_path);
    }

    public function test_admin_can_update_top_student_and_replace_image(): void
    {
        $admin = $this->createAdmin();
        $oldImagePath = UploadedFile::fake()->image('old-top-student.jpg')->store('top-students', 'public');

        $topStudent = TopStudent::query()->create([
            'student_name' => 'آدم محمد',
            'achievement_title' => 'مشروع أولي',
            'image_path' => $oldImagePath,
            'status' => true,
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($admin)->put("/admin/top-students/{$topStudent->id}", [
            'student_name' => 'آدم محمد علي',
            'achievement_title' => 'أتم مسار تطوير الويب بنجاح',
            'image_file' => UploadedFile::fake()->image('new-top-student.jpg'),
            'status' => false,
            'sort_order' => 6,
        ]);

        $response->assertRedirect('/admin/top-students');
        $response->assertSessionHasNoErrors();

        $topStudent->refresh();

        $this->assertSame('آدم محمد علي', $topStudent->student_name);
        $this->assertSame('أتم مسار تطوير الويب بنجاح', $topStudent->achievement_title);
        $this->assertFalse($topStudent->status);
        $this->assertSame(6, $topStudent->sort_order);
        $this->assertNotSame($oldImagePath, $topStudent->image_path);
        Storage::disk('public')->assertMissing($oldImagePath);
        Storage::disk('public')->assertExists($topStudent->image_path);
    }

    public function test_admin_can_delete_top_student_and_its_image(): void
    {
        $admin = $this->createAdmin();
        $imagePath = UploadedFile::fake()->image('delete-top-student.jpg')->store('top-students', 'public');

        $topStudent = TopStudent::query()->create([
            'student_name' => 'مريم خالد',
            'achievement_title' => 'قدمت مشروعها النهائي بثقة',
            'image_path' => $imagePath,
            'status' => true,
            'sort_order' => 2,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/top-students/{$topStudent->id}");

        $response->assertRedirect('/admin/top-students');
        $this->assertDatabaseMissing('top_students', ['id' => $topStudent->id]);
        Storage::disk('public')->assertMissing($imagePath);
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
}
