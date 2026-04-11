<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Database\Factories\PermissionFactory;
use Database\Factories\RoleFactory;
use Database\Seeders\Concerns\SeedsInChunks;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    use SeedsInChunks;

    public function run(): void
    {
        $now = now();

        $roles = collect(ArabicSeedSupport::roles())
            ->map(fn (array $role) => array_merge(RoleFactory::new()->raw(), $role, ['created_at' => $now, 'updated_at' => $now]))
            ->all();

        $permissions = collect(ArabicSeedSupport::permissions())
            ->map(fn (array $permission) => array_merge(PermissionFactory::new()->raw(), $permission, ['created_at' => $now, 'updated_at' => $now]))
            ->all();

        $this->insertInChunks('roles', $roles);
        $this->insertInChunks('permissions', $permissions);

        $roleIds = Role::query()->pluck('id', 'slug');
        $permissionIds = Permission::query()->pluck('id', 'slug');

        $rolePermissionMap = [
            'admin' => $permissionIds->values()->all(),
            'instructor' => $permissionIds->only(['manage-courses', 'manage-lessons', 'manage-tasks', 'manage-exams', 'view-analytics'])->values()->all(),
            'student' => [],
        ];

        $pivotRows = [];

        foreach ($rolePermissionMap as $roleSlug => $permissionList) {
            foreach ($permissionList as $permissionId) {
                $pivotRows[] = [
                    'role_id' => $roleIds[$roleSlug],
                    'permission_id' => $permissionId,
                ];
            }
        }

        if ($pivotRows !== []) {
            DB::table('role_permission')->insert($pivotRows);
        }
    }
}