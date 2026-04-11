<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/roles/index', [
            'roles' => Role::query()
                ->orderBy('name')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Role $r) => $this->adminPayload($r)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/roles/create', [
            'permissions' => Permission::orderBy('name')->get()->map(fn (Permission $p) => ['id' => $p->id, 'name' => $p->name, 'slug' => $p->slug]),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $role = Role::create(['name' => $payload['name'], 'slug' => $payload['slug']]);
        if (! empty($payload['permission_ids'])) {
            $role->permissions()->sync($payload['permission_ids']);
        }

        return to_route('admin.roles.index');
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('admin/roles/edit', [
            'role' => $this->adminPayload($role),
            'permissions' => Permission::orderBy('name')->get()->map(fn (Permission $p) => ['id' => $p->id, 'name' => $p->name, 'slug' => $p->slug]),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $payload = $request->validated();
        $role->update(['name' => $payload['name'], 'slug' => $payload['slug']]);
        $role->permissions()->sync($payload['permission_ids'] ?? []);

        return to_route('admin.roles.index');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->permissions()->detach();
        $role->users()->detach();
        $role->delete();

        return to_route('admin.roles.index');
    }

    private function adminPayload(Role $r): array
    {
        return [
            'id' => $r->id,
            'name' => $r->name,
            'slug' => $r->slug,
            'permissions' => $r->permissions()->pluck('slug')->toArray(),
        ];
    }
}
