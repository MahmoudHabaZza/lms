<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/lessons/index', [
            'lessons' => Lesson::query()
                ->with('course')
                ->orderBy('order')
                ->orderBy('id')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Lesson $lesson) => $this->adminPayload($lesson)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/lessons/create', [
            'courses' => $this->courses(),
        ]);
    }

    public function store(StoreLessonRequest $request): RedirectResponse
    {
        Lesson::create($request->validated());

        return to_route('admin.lessons.index')->with('success', 'تمت إضافة الدرس بنجاح.');
    }

    public function edit(Lesson $lesson): Response
    {
        $lesson->load('course');

        return Inertia::render('admin/lessons/edit', [
            'lesson' => $this->adminPayload($lesson),
            'courses' => $this->courses(),
        ]);
    }

    public function update(UpdateLessonRequest $request, Lesson $lesson): RedirectResponse
    {
        $lesson->update($request->validated());

        return to_route('admin.lessons.index')->with('success', 'تم تحديث الدرس بنجاح.');
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        $lesson->delete();

        return to_route('admin.lessons.index')->with('success', 'تم حذف الدرس بنجاح.');
    }

    private function adminPayload(Lesson $lesson): array
    {
        return [
            'id' => $lesson->id,
            'course_id' => $lesson->course_id,
            'course_title' => $lesson->course?->title,
            'title' => $lesson->title,
            'description' => $lesson->description,
            'video_url' => $lesson->video_url,
            'duration_minutes' => $lesson->duration_minutes,
            'order' => $lesson->order,
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
