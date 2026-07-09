<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Fortify\Rules\Password;

class CreateNewUser implements CreatesNewUsers
{
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', new Password, 'confirmed'],
            'drive_link' => ['nullable', 'url', 'max:255'],
            'telegram_link' => ['nullable', 'url', 'max:255'],
        ])->validate();

        $role = $input['role'] ?? 'student';
        $username = $input['username'] ?? str($input['email'])->before('@')->value();

        $user = User::create([
            'name' => $input['name'],
            'username' => $username,
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'role' => $role,
            'phone_number' => $input['phone_number'] ?? null,
            'drive_link' => $this->normalizeLink($input['drive_link'] ?? null),
            'telegram_link' => $this->normalizeLink($input['telegram_link'] ?? null),
            'is_admin' => false,
            'is_staff' => $role === 'instructor',
            'is_superuser' => false,
            'is_verified' => false,
            'instructor_verified' => false,
        ]);

        $user->assignRole($role);

        return $user;
    }

    private function normalizeLink(?string $link): ?string
    {
        $trimmed = trim((string) $link);

        return $trimmed === '' ? null : $trimmed;
    }
}
