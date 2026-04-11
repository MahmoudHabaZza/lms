<?php

namespace App\Services\Student;

use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\TaskSubmissionRevision;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class TaskSubmissionService
{
    public function __construct(
        private readonly StudentCourseService $courseService,
    ) {
    }

    public function submit(User $student, Task $task, ?UploadedFile $file, ?string $submissionText): TaskSubmission
    {
        $task->loadMissing('course');
        $this->courseService->ensureEnrolledInCourse($student, $task->course);

        $submissionText = $this->normalizeSubmissionText($submissionText);
        if ($file === null && $submissionText === null) {
            throw ValidationException::withMessages([
                'submission_text' => 'يجب إضافة ملف أو كتابة نص التسليم على الأقل.',
            ]);
        }

        $existing = TaskSubmission::query()
            ->where('task_id', $task->id)
            ->where('student_id', $student->id)
            ->first();

        if ($existing && ! $task->allow_resubmission) {
            throw ValidationException::withMessages([
                'file' => 'إعادة التسليم غير مسموحة لهذه المهمة.',
            ]);
        }

        $storedPath = $file?->store('tasks/submissions/student-'.$student->id, 'public');

        return DB::transaction(function () use ($existing, $student, $task, $storedPath, $submissionText) {
            if ($existing) {
                $this->deleteLocalFile($existing->submission_file);

                $existing->update([
                    'submission_file' => $storedPath,
                    'submission_text' => $submissionText,
                    'submitted_at' => now(),
                    'status' => 'pending',
                    'score' => null,
                    'feedback' => null,
                    'graded_at' => null,
                ]);

                $submission = $existing->fresh();
            } else {
                $submission = TaskSubmission::query()->create([
                    'task_id' => $task->id,
                    'student_id' => $student->id,
                    'submission_file' => $storedPath,
                    'submission_text' => $submissionText,
                    'submitted_at' => now(),
                    'status' => 'pending',
                ]);
            }

            TaskSubmissionRevision::query()->create([
                'task_submission_id' => $submission->id,
                'submission_file' => $storedPath,
                'submission_text' => $submissionText,
                'submitted_at' => now(),
            ]);

            return $submission;
        });
    }

    private function normalizeSubmissionText(?string $submissionText): ?string
    {
        $normalized = trim((string) $submissionText);

        return $normalized === '' ? null : $normalized;
    }

    private function deleteLocalFile(?string $path): void
    {
        if (blank($path)) {
            return;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}