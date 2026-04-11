<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskSubmissionRequest;
use App\Http\Requests\UpdateTaskSubmissionRequest;
use App\Models\TaskSubmission;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TaskSubmissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/task-submissions/index', [
            'submissions' => TaskSubmission::with(['student', 'task'])
                ->orderBy('created_at', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (TaskSubmission $s) => $this->adminPayload($s)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/task-submissions/create', [
            'students' => $this->students(),
            'tasks' => $this->tasks(),
        ]);
    }

    public function store(StoreTaskSubmissionRequest $request): RedirectResponse
    {
        $payload = $request->safe()->except(['file']);
        if ($request->hasFile('file')) {
            $payload['submission_file'] = $request->file('file')->store('tasks/submissions', 'public');
        }
        $payload['submitted_at'] = $payload['submitted_at'] ?? now();
        if (($payload['status'] ?? null) === 'graded') {
            $payload['graded_at'] = now();
        }

        TaskSubmission::create($payload);

        return to_route('admin.task-submissions.index')->with('success', 'تمت إضافة تسليم المهمة بنجاح.');
    }

    public function edit(TaskSubmission $taskSubmission): Response
    {
        return Inertia::render('admin/task-submissions/edit', [
            'submission' => $this->adminPayload($taskSubmission),
            'students' => $this->students(),
            'tasks' => $this->tasks(),
        ]);
    }

    public function update(UpdateTaskSubmissionRequest $request, TaskSubmission $taskSubmission): RedirectResponse
    {
        $payload = $request->safe()->except(['file']);
        if ($request->hasFile('file')) {
            $this->deleteStoredFile($taskSubmission->submission_file);
            $payload['submission_file'] = $request->file('file')->store('tasks/submissions', 'public');
        } else {
            $payload['submission_file'] = $taskSubmission->submission_file;
        }
        if (($payload['status'] ?? $taskSubmission->status) === 'graded') {
            $payload['graded_at'] = $taskSubmission->graded_at ?? now();
        } else {
            $payload['graded_at'] = null;
        }

        $taskSubmission->update($payload);

        return to_route('admin.task-submissions.index')->with('success', 'تم تحديث تسليم المهمة بنجاح.');
    }

    public function destroy(TaskSubmission $taskSubmission): RedirectResponse
    {
        $this->deleteStoredFile($taskSubmission->submission_file);
        $taskSubmission->delete();

        return to_route('admin.task-submissions.index')->with('success', 'تم حذف تسليم المهمة بنجاح.');
    }

    private function deleteStoredFile(?string $value): void
    {
        if ($value === null || $value === '') {
            return;
        }
        if (str_starts_with($value, '/') || str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return;
        }
        Storage::disk('public')->delete($value);
    }

    private function adminPayload(TaskSubmission $submission): array
    {
        return [
            'id' => $submission->id,
            'student_id' => $submission->student_id,
            'task_id' => $submission->task_id,
            'student' => $submission->student ? ['id' => $submission->student->id, 'name' => $submission->student->name] : null,
            'task' => $submission->task ? ['id' => $submission->task->id, 'title' => $submission->task->title] : null,
            'submission_file' => $submission->submission_file,
            'submission_file_url' => $submission->submission_file ? Storage::disk('public')->url($submission->submission_file) : null,
            'feedback' => $submission->feedback,
            'score' => $submission->score,
            'status' => $submission->status,
            'submitted_at' => $submission->submitted_at,
            'created_at' => $submission->created_at,
        ];
    }

    private function students(): array
    {
        return User::query()->where('role', 'student')->orderBy('name')->get(['id', 'name'])->toArray();
    }

    private function tasks(): array
    {
        return Task::query()->orderBy('title')->get(['id', 'title'])->toArray();
    }
}
