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
        $courseLinks = $this->normalizeCourseLinks($payload['course_links'] ?? []);

        // Normalize the optional links
        if (empty($payload['drive_link'])) {
            $payload['drive_link'] = null;
        }
        if (empty($payload['telegram_link'])) {
            $payload['telegram_link'] = null;
        }

        unset($payload['password_mode'], $payload['password'], $payload['course_ids'], $payload['course_links']);

        $payload['role'] = 'student';
        $payload['is_admin'] = false;
        $payload['is_staff'] = false;
        $payload['is_superuser'] = false;
        $payload['is_active'] = (bool) ($payload['is_active'] ?? true);
        $payload['username'] = $this->generateUniqueUsername($payload['username'] ?? null, $payload['email'], $payload['name']);
        $payload['password'] = $plainPassword;

        $student = DB::transaction(function () use ($payload, $courseIds, $courseLinks) {
            $student = User::create($payload);
            $this->syncCourses($student, $courseIds, $courseLinks);

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
        $courseLinks = $this->normalizeCourseLinks($payload['course_links'] ?? []);
        $incomingPassword = $payload['password'] ?? null;

        // Normalize the optional links
        if (empty($payload['drive_link'])) {
            $payload['drive_link'] = null;
        }
        if (empty($payload['telegram_link'])) {
            $payload['telegram_link'] = null;
        }

        unset($payload['password_action'], $payload['password'], $payload['course_ids'], $payload['course_links']);

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

        DB::transaction(function () use ($student, $payload, $courseIds, $courseLinks) {
            $student->update($payload);
            $this->syncCourses($student, $courseIds, $courseLinks);
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

    private function syncCourses(User $student, array $courseIds, array $courseLinks = []): void
    {
        $courseIds = collect($courseIds)
            ->filter(fn ($id) => filled($id))
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        if ($courseIds->isEmpty()) {
            $student->courseEnrollments()->delete();

            return;
        }

        $student->courseEnrollments()
            ->whereNotIn('course_id', $courseIds->all())
            ->delete();

        $courseIds->each(function (int $courseId) use ($student, $courseLinks): void {
            $links = $courseLinks[$courseId] ?? [];

            Enrollment::query()->updateOrCreate(
                [
                    'student_id' => $student->id,
                    'course_id' => $courseId,
                ],
                [
                    'enrolled_at' => now(),
                    'drive_link' => $this->normalizeOptionalLink($links['drive_link'] ?? null),
                    'telegram_link' => $this->normalizeOptionalLink($links['telegram_link'] ?? null),
                ],
            );
        });
    }

    private function normalizeCourseLinks(array $courseLinks): array
    {
        $normalized = [];

        foreach ($courseLinks as $courseId => $links) {
            $courseId = (int) $courseId;

            if ($courseId <= 0 || ! is_array($links)) {
                continue;
            }

            $normalized[$courseId] = [
                'drive_link' => $this->normalizeOptionalLink($links['drive_link'] ?? null),
                'telegram_link' => $this->normalizeOptionalLink($links['telegram_link'] ?? null),
            ];
        }

        return $normalized;
    }

    private function normalizeOptionalLink(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

}
