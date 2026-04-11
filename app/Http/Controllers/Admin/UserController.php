<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRolesRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->with('roles:id,name,slug')
            ->orderByDesc('id')
            ->paginate(20)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->map(fn (Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                ])->values(),
            ]);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function edit(User $user)
    {
        $roles = Role::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles()
                    ->orderBy('name')
                    ->get(['roles.id', 'roles.name', 'roles.slug']),
            ],
            'roles' => $roles,
        ]);
    }

    public function update(UpdateUserRolesRequest $request, User $user): RedirectResponse
    {
        $user->roles()->sync($request->input('role_ids', []));

        return redirect()->route('admin.users.edit', $user->id)->with('success', 'تم تحديث أدوار المستخدم بنجاح');
    }
}
