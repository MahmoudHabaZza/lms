<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPermissionBypassTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_can_access_permission_protected_admin_routes_without_explicit_permissions(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $this->actingAs($admin);

        $this->get('/admin/courses')->assertOk();
    }
}
