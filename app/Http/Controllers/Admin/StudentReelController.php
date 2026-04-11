<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentReelRequest;
use App\Http\Requests\UpdateStudentReelRequest;
use App\Models\StudentReel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentReelController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/student-reels/index', [
            'reels' => StudentReel::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->paginate(12)
                ->withQueryString()
                ->through(fn (StudentReel $reel): array => $this->adminPayload($reel)),
            'stats' => [
                'total' => StudentReel::query()->count(),
                'active' => StudentReel::query()->where('status', true)->count(),
                'max_sort_order' => (int) (StudentReel::query()->max('sort_order') ?? 0),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/student-reels/create');
    }

    public function store(StoreStudentReelRequest $request): RedirectResponse
    {
        $payload = $request->safe()->except(['cover_image_file', 'video_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);
        $payload['video_source'] = StudentReel::VIDEO_SOURCE_UPLOAD;

        if ($request->hasFile('cover_image_file')) {
            $payload['cover_image'] = $request->file('cover_image_file')->store('feedback/reels/covers', 'public');
        }

        if ($request->hasFile('video_file')) {
            $payload['video_path'] = $request->file('video_file')->store('feedback/reels/videos', 'public');
        }

        $payload['video_url'] = null;

        StudentReel::create($payload);

        return to_route('admin.student-reels.index')->with('success', 'تمت إضافة ريل الطالب بنجاح.');
    }

    public function edit(StudentReel $studentReel): Response
    {
        return Inertia::render('admin/student-reels/edit', [
            'reel' => $this->adminPayload($studentReel),
        ]);
    }

    public function update(UpdateStudentReelRequest $request, StudentReel $studentReel): RedirectResponse
    {
        $payload = $request->safe()->except(['cover_image_file', 'video_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);
        $payload['video_source'] = StudentReel::VIDEO_SOURCE_UPLOAD;

        if ($request->hasFile('cover_image_file')) {
            $this->deleteStoredFile($studentReel->cover_image);
            $payload['cover_image'] = $request->file('cover_image_file')->store('feedback/reels/covers', 'public');
        }

        if ($request->hasFile('video_file')) {
            $this->deleteStoredFile($studentReel->video_path);
            $payload['video_path'] = $request->file('video_file')->store('feedback/reels/videos', 'public');
        }

        $payload['video_url'] = null;

        $studentReel->update($payload);

        return to_route('admin.student-reels.index')->with('success', 'تم تحديث ريل الطالب بنجاح.');
    }

    public function destroy(StudentReel $studentReel): RedirectResponse
    {
        $this->deleteStoredFile($studentReel->cover_image);
        $this->deleteStoredFile($studentReel->video_path);

        $studentReel->delete();

        return to_route('admin.student-reels.index')->with('success', 'تم حذف ريل الطالب بنجاح.');
    }

    /**
     * @return array<string, mixed>
     */
    private function adminPayload(StudentReel $reel): array
    {
        return [
            'id' => $reel->id,
            'student_name' => $reel->student_name,
            'student_title' => $reel->student_title,
            'student_age' => $reel->student_age,
            'cover_image' => $reel->cover_image,
            'cover_image_url' => $this->resolveMediaUrl($reel->cover_image),
            'video_path' => $reel->video_path,
            'video_path_url' => $this->resolveMediaUrl($reel->video_path),
            'quote' => $reel->quote,
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
