<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/permissions/index', [
            'permissions' => Permission::query()
                ->orderBy('name')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Permission $p) => ['id' => $p->id, 'name' => $p->name, 'slug' => $p->slug]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/permissions/create');
    }

    public function store(StorePermissionRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        Permission::create($payload);

        return to_route('admin.permissions.index');
    }

    public function edit(Permission $permission): Response
    {
        return Inertia::render('admin/permissions/edit', [
            'permission' => ['id' => $permission->id, 'name' => $permission->name, 'slug' => $permission->slug],
        ]);
    }

    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        $payload = $request->validated();
        $permission->update($payload);

        return to_route('admin.permissions.index');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->users()->detach();
        // detach from roles if pivot exists
        if (Schema::hasTable('role_permission')) {
            DB::table('role_permission')->where('permission_id', $permission->id)->delete();
        }

        $permission->delete();

        return to_route('admin.permissions.index');
    }
}
