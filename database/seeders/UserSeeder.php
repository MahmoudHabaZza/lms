<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Database\Factories\UserFactory;
use Database\Seeders\Concerns\SeedsInChunks;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    use SeedsInChunks;

    public function run(): void
    {
        $now = now();
        $rows = [];

        for ($i = 0; $i < 3; $i++) {
            $profile = ArabicSeedSupport::userProfile(900 + $i, 'admin', $i === 1 ? 'female' : 'male');
            $rows[] = array_merge(UserFactory::new()->admin()->raw(), $profile, [
                'email' => $i === 0 ? 'admin@kid-coder.test' : ($i === 1 ? 'operations@kid-coder.test' : 'content@kid-coder.test'),
                'username' => $i === 0 ? 'superadmin' : ($i === 1 ? 'operationsadmin' : 'contentadmin'),
                'email_verified_at' => $now,
                'date_joined' => $now->copy()->subMonths(12 - $i),
                'created_at' => $now,
                'updated_at' => $now,
                'is_active' => true,
                'is_verified' => true,
                'is_superuser' => $i === 0,
                'instructor_verified' => false,
            ]);
        }

        for ($i = 0; $i < 18; $i++) {
            $profile = ArabicSeedSupport::userProfile(500 + $i, 'instructor');
            $rows[] = array_merge(UserFactory::new()->instructor()->raw(), $profile, [
                'email_verified_at' => $now->copy()->subDays($i),
                'date_joined' => $now->copy()->subDays(120 + $i * 5),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        for ($i = 0; $i < 90; $i++) {
            $profile = ArabicSeedSupport::userProfile($i + 1, 'student');
            $rows[] = array_merge(UserFactory::new()->student()->raw(), $profile, [
                'email_verified_at' => $profile['is_verified'] ? $now->copy()->subDays($i % 20) : null,
                'date_joined' => $now->copy()->subDays(180 - ($i % 90)),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->insertInChunks('users', $rows);

        $roleIds = Role::query()->pluck('id', 'slug');
        $permissionIds = Permission::query()->pluck('id', 'slug');
        $users = User::query()->select('id', 'role')->get();

        $roleRows = $users->map(fn (User $user) => [
            'role_id' => $roleIds[$user->role],
            'user_id' => $user->id,
        ])->all();
        DB::table('role_user')->insert($roleRows);

        $permissionRows = [];
        foreach ($users as $user) {
            if ($user->role === 'admin') {
                foreach ($permissionIds as $permissionId) {
                    $permissionRows[] = ['permission_id' => $permissionId, 'user_id' => $user->id];
                }
            }

            if ($user->role === 'instructor') {
                foreach ($permissionIds->only(['manage-courses', 'manage-lessons', 'manage-tasks', 'manage-exams', 'view-analytics']) as $permissionId) {
                    $permissionRows[] = ['permission_id' => $permissionId, 'user_id' => $user->id];
                }
            }
        }

        $this->insertInChunks('permission_user', $permissionRows);
    }
}