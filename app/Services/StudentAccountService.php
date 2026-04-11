<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentAccountService
{
    public function create(array $payload): array
    {
        $plainPassword = $payload['password_mode'] === 'manual'
            ? $payload['password']
            : $this->resolveAutoPassword($payload['password'] ?? null);

        $courseIds = $payload['course_ids'] ?? [];

        unset($payload['password_mode'], $payload['password'], $payload['course_ids']);

        $payload['role'] = 'student';
        $payload['is_admin'] = false;
        $payload['is_staff'] = false;
        $payload['is_superuser'] = false;
        $payload['is_active'] = (bool) ($payload['is_active'] ?? true);
        $payload['username'] = $this->generateUniqueUsername($payload['username'] ?? null, $payload['email'], $payload['name']);
        $payload['password'] = $plainPassword;

        $student = DB::transaction(function () use ($payload, $courseIds) {
            $student = User::create($payload);
            $this->syncCourses($student, $courseIds);

            return $student->load('assignedCourses:id,title');
        });

        return [
            'student' => $student,
            'plain_password' => $plainPassword,
        ];
    }

    public function update(User $student, array $payload): array
    {
        $passwordAction = $payload['password_action'] ?? 'keep';
        $plainPassword = null;
        $courseIds = $payload['course_ids'] ?? [];
        $incomingPassword = $payload['password'] ?? null;

        unset($payload['password_action'], $payload['password'], $payload['course_ids']);

        $payload['role'] = 'student';
        $payload['is_active'] = (bool) ($payload['is_active'] ?? true);
        $payload['username'] = $this->generateUniqueUsername($payload['username'] ?? $student->username, $payload['email'], $payload['name'], $student->id);

        if ($passwordAction === 'manual') {
            $plainPassword = (string) $incomingPassword;
            $payload['password'] = $plainPassword;
        }

        if ($passwordAction === 'auto') {
            $plainPassword = $this->resolveAutoPassword($incomingPassword);
            $payload['password'] = $plainPassword;
        }

        DB::transaction(function () use ($student, $payload, $courseIds) {
            $student->update($payload);
            $this->syncCourses($student, $courseIds);
        });

        return [
            'student' => $student->fresh()->load('assignedCourses:id,title'),
            'plain_password' => $plainPassword,
        ];
    }

    public function generatePassword(): string
    {
        $seed = [
            Str::upper(Str::random(2)),
            Str::lower(Str::random(5)),
            (string) random_int(10, 99),
            '!@#$%'[random_int(0, 4)],
        ];

        return str_shuffle(implode('', $seed));
    }

    private function resolveAutoPassword(?string $password): string
    {
        $password = trim((string) $password);

        return $password !== '' ? $password : $this->generatePassword();
    }

    private function generateUniqueUsername(?string $preferred, string $email, string $name, ?int $ignoreId = null): string
    {
        $base = trim((string) $preferred);

        if ($base === '') {
            $base = Str::lower(preg_replace('/[^A-Za-z0-9_]/', '', Str::before($email, '@')) ?: '');
        }

        if ($base === '') {
            $base = Str::lower(preg_replace('/[^A-Za-z0-9_]/', '', Str::slug($name, '')) ?: '');
        }

        if ($base === '') {
            $base = 'student';
        }

        $username = $base;
        $suffix = 1;

        while (User::query()
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->where('username', $username)
            ->exists()) {
            $username = $base.$suffix;
            $suffix++;
        }

        return $username;
    }

    private function syncCourses(User $student, array $courseIds): void
    {
        $courseIds = collect($courseIds)
            ->filter(fn ($id) => filled($id))
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        if ($courseIds->isEmpty()) {
            $student->courseEnrollments()->delete();
        } else {
            $student->courseEnrollments()
                ->whereNotIn('course_id', $courseIds->all())
                ->delete();
        }

        $courseIds->each(function (int $courseId) use ($student): void {
            Enrollment::query()->firstOrCreate(
                [
                    'student_id' => $student->id,
                    'course_id' => $courseId,
                ],
                [
                    'enrolled_at' => now(),
                ],
            );
        });
    }

}
