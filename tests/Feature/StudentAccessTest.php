<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StudentAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_login_with_email(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'is_active' => true,
            'username' => 'student_login',
            'email' => 'student@example.com',
            'password' => Hash::make('Secret123!'),
        ]);

        $this->withSession(['_token' => 'test-token'])
            ->post('/student/login', [
                '_token' => 'test-token',
                'login' => $student->email,
                'password' => 'Secret123!',
            ])->assertRedirect(route('student.dashboard'));

        $this->assertAuthenticatedAs($student);
    }

    public function test_non_student_users_cannot_access_student_routes(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $this->actingAs($admin)
            ->get('/student/profile')
            ->assertRedirect(route('admin.dashboard'));
    }
}
