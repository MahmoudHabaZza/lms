<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseReelRequest;
use App\Http\Requests\UpdateCourseReelRequest;
use App\Models\Course;
use App\Models\CourseReel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CourseReelController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/course-reels/index', [
            'reels' => CourseReel::query()
                ->with('course')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->paginate(12)
                ->withQueryString()
                ->through(fn (CourseReel $reel): array => $this->adminPayload($reel)),
            'stats' => [
                'total' => CourseReel::query()->count(),
                'active' => CourseReel::query()->where('status', true)->count(),
                'linked_courses' => CourseReel::query()->whereNotNull('course_id')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/course-reels/create', [
            'courses' => Course::query()->where('status', true)->orderBy('sort_order')->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(StoreCourseReelRequest $request): RedirectResponse
    {
        $payload = $request->safe()->except(['cover_image_file', 'video_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);
        $payload['video_source'] = CourseReel::VIDEO_SOURCE_UPLOAD;

        if ($request->hasFile('cover_image_file')) {
            $payload['cover_image'] = $request->file('cover_image_file')->store('course/reels/covers', 'public');
        }

        if ($request->hasFile('video_file')) {
            $payload['video_path'] = $request->file('video_file')->store('course/reels/videos', 'public');
        }

        $payload['video_url'] = null;

        CourseReel::create($payload);

        return to_route('admin.course-reels.index')->with('success', 'تمت إضافة ريل الكورس بنجاح.');
    }

    public function edit(CourseReel $courseReel): Response
    {
        return Inertia::render('admin/course-reels/edit', [
            'reel' => $this->adminPayload($courseReel),
            'courses' => Course::query()->where('status', true)->orderBy('sort_order')->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function update(UpdateCourseReelRequest $request, CourseReel $courseReel): RedirectResponse
    {
        $payload = $request->safe()->except(['cover_image_file', 'video_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);
        $payload['video_source'] = CourseReel::VIDEO_SOURCE_UPLOAD;

        if ($request->hasFile('cover_image_file')) {
            $this->deleteStoredFile($courseReel->cover_image);
            $payload['cover_image'] = $request->file('cover_image_file')->store('course/reels/covers', 'public');
        }

        if ($request->hasFile('video_file')) {
            $this->deleteStoredFile($courseReel->video_path);
            $payload['video_path'] = $request->file('video_file')->store('course/reels/videos', 'public');
        }

        if (! $request->hasFile('video_file')) {
            $payload['video_url'] = $payload['video_url'] ?? $courseReel->video_url;
        } else {
            $payload['video_url'] = null;
        }

        $courseReel->update($payload);

        return to_route('admin.course-reels.index')->with('success', 'تم تحديث ريل الكورس بنجاح.');
    }

    public function destroy(CourseReel $courseReel): RedirectResponse
    {
        $this->deleteStoredFile($courseReel->cover_image);
        $this->deleteStoredFile($courseReel->video_path);

        $courseReel->delete();

        return to_route('admin.course-reels.index')->with('success', 'تم حذف ريل الكورس بنجاح.');
    }

    private function adminPayload(CourseReel $reel): array
    {
        return [
            'id' => $reel->id,
            'course_id' => $reel->course_id,
            'course_title' => $reel->course?->title ?? null,
            'title' => $reel->title,
            'cover_image' => $reel->cover_image,
            'cover_image_url' => $this->resolveMediaUrl($reel->cover_image),
            'video_path' => $reel->video_path,
            'video_path_url' => $this->resolveMediaUrl($reel->video_path),
            'video_url' => $reel->video_url,
            'description' => $reel->description,
            'status' => $reel->status,
            'sort_order' => $reel->sort_order,
        ];
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
