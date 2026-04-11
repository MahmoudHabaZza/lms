<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Course;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/tasks/index', [
            'tasks' => Task::query()
                ->with('course')
                ->orderBy('id', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Task $t) => $this->adminPayload($t)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tasks/create', [
            'courses' => $this->courses(),
        ]);
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $payload['instructor_id'] = $request->user()?->id;
        Task::create($payload);

        return to_route('admin.tasks.index')->with('success', 'تمت إضافة المهمة بنجاح.');
    }

    public function edit(Task $task): Response
    {
        return Inertia::render('admin/tasks/edit', [
            'task' => $this->adminPayload($task),
            'courses' => $this->courses(),
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $payload = $request->validated();
        $payload['instructor_id'] = $task->instructor_id ?: $request->user()?->id;
        $task->update($payload);

        return to_route('admin.tasks.index')->with('success', 'تم تحديث المهمة بنجاح.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return to_route('admin.tasks.index')->with('success', 'تم حذف المهمة بنجاح.');
    }

    private function adminPayload(Task $t): array
    {
        return [
            'id' => $t->id,
            'title' => $t->title,
            'description' => $t->description,
            'course_id' => $t->course_id,
            'course_title' => $t->course?->title,
            'due_date' => $t->due_date?->format('Y-m-d\TH:i'),
        ];
    }

    private function courses(): array
    {
        return Course::query()
            ->orderBy('title')
            ->get(['id', 'title'])
            ->toArray();
    }
}
