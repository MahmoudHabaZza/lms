<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
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
        $payload = $request->safe()->except(['video_file']);

        if (($payload['video_source'] ?? null) === Lesson::VIDEO_SOURCE_UPLOAD && $request->hasFile('video_file')) {
            $payload['video_path'] = $request->file('video_file')->store('course/lessons/videos', 'public');
            $payload['video_url'] = null;
        } else {
            $payload['video_path'] = null;
        }

        Lesson::create($payload);

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
        $payload = $request->safe()->except(['video_file']);
        $selectedSource = $payload['video_source'] ?? Lesson::VIDEO_SOURCE_DRIVE;

        if ($selectedSource === Lesson::VIDEO_SOURCE_UPLOAD) {
            if ($request->hasFile('video_file')) {
                $this->deleteStoredFile($lesson->video_path);
                $payload['video_path'] = $request->file('video_file')->store('course/lessons/videos', 'public');
            } else {
                $payload['video_path'] = $lesson->video_path;
            }

            $payload['video_url'] = null;
        } else {
            $this->deleteStoredFile($lesson->video_path);
            $payload['video_path'] = null;
        }

        $lesson->update($payload);

        return to_route('admin.lessons.index')->with('success', 'تم تحديث الدرس بنجاح.');
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        $this->deleteStoredFile($lesson->video_path);
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
            'video_source' => $lesson->video_source ?: Lesson::VIDEO_SOURCE_DRIVE,
            'video_url' => $lesson->video_url,
            'video_path' => $lesson->video_path,
            'video_path_url' => $this->resolveMediaUrl($lesson->video_path),
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

    private function resolveMediaUrl(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
            return $value;
        }

        return Storage::disk('public')->url($value);
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
}
