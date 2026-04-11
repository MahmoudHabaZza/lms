<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLessonProgressRequest;
use App\Http\Requests\UpdateLessonProgressRequest;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class LessonProgressController extends Controller
{
    public function index(): Response
    {
        $items = LessonProgress::with('student', 'lesson')
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(fn (LessonProgress $item) => $this->adminPayload($item));

        return Inertia::render('admin/lesson-progress/index', ['progress' => $items]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/lesson-progress/create', [
            'students' => $this->students(),
            'lessons' => $this->lessons(),
        ]);
    }

    public function store(StoreLessonProgressRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $payload['progress_percent'] = (int) $payload['progress'];
        unset($payload['progress']);
        $payload['time_spent_minutes'] = 0;
        $payload['is_completed'] = $payload['progress_percent'] >= 100;
        $payload['completed_at'] = $payload['is_completed'] ? now() : null;

        LessonProgress::create($payload);

        return redirect()->route('admin.lesson-progress.index')->with('success', 'تمت إضافة تقدم الدرس بنجاح.');
    }

    public function edit(LessonProgress $lessonProgress): Response
    {
        return Inertia::render('admin/lesson-progress/edit', [
            'progressItem' => $this->adminPayload($lessonProgress),
            'students' => $this->students(),
            'lessons' => $this->lessons(),
        ]);
    }

    public function update(UpdateLessonProgressRequest $request, LessonProgress $lessonProgress): RedirectResponse
    {
        $payload = $request->validated();
        $payload['progress_percent'] = (int) $payload['progress'];
        unset($payload['progress']);
        $payload['is_completed'] = $payload['progress_percent'] >= 100;
        $payload['completed_at'] = $payload['is_completed'] ? ($lessonProgress->completed_at ?? now()) : null;

        $lessonProgress->update($payload);

        return redirect()->route('admin.lesson-progress.index')->with('success', 'تم تحديث تقدم الدرس بنجاح.');
    }

    public function destroy(LessonProgress $lessonProgress): RedirectResponse
    {
        $lessonProgress->delete();

        return redirect()->route('admin.lesson-progress.index')->with('success', 'تم حذف تقدم الدرس بنجاح.');
    }

    private function adminPayload(LessonProgress $progress): array
    {
        return [
            'id' => $progress->id,
            'student_id' => $progress->student_id,
            'lesson_id' => $progress->lesson_id,
            'student' => $progress->student ? ['id' => $progress->student->id, 'name' => $progress->student->name] : null,
            'lesson' => $progress->lesson ? ['id' => $progress->lesson->id, 'title' => $progress->lesson->title] : null,
            'progress' => $progress->progress_percent,
            'is_completed' => $progress->is_completed,
            'completed_at' => $progress->completed_at,
        ];
    }

    private function students(): array
    {
        return User::query()->where('role', 'student')->orderBy('name')->get(['id', 'name'])->toArray();
    }

    private function lessons(): array
    {
        return Lesson::query()->orderBy('title')->get(['id', 'title'])->toArray();
    }
}
