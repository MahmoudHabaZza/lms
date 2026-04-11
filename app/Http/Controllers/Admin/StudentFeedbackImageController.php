<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentFeedbackImageRequest;
use App\Http\Requests\UpdateStudentFeedbackImageRequest;
use App\Models\StudentFeedbackImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentFeedbackImageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/student-feedback-images/index', [
            'feedbackImages' => StudentFeedbackImage::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->paginate(12)
                ->withQueryString()
                ->through(fn (StudentFeedbackImage $feedbackImage): array => $this->adminPayload($feedbackImage)),
            'stats' => [
                'total' => StudentFeedbackImage::query()->count(),
                'active' => StudentFeedbackImage::query()->where('status', true)->count(),
                'max_sort_order' => (int) (StudentFeedbackImage::query()->max('sort_order') ?? 0),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/student-feedback-images/create');
    }

    public function store(StoreStudentFeedbackImageRequest $request): RedirectResponse
    {
        $payload = $request->safe()->except(['image_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        if ($request->hasFile('image_file')) {
            $payload['image_path'] = $request->file('image_file')->store('feedback/images', 'public');
        }

        StudentFeedbackImage::create($payload);

        return to_route('admin.student-feedback-images.index')->with('success', 'تمت إضافة رأي الطالب بنجاح.');
    }

    public function edit(StudentFeedbackImage $studentFeedbackImage): Response
    {
        return Inertia::render('admin/student-feedback-images/edit', [
            'feedbackImage' => $this->adminPayload($studentFeedbackImage),
        ]);
    }

    public function update(
        UpdateStudentFeedbackImageRequest $request,
        StudentFeedbackImage $studentFeedbackImage
    ): RedirectResponse {
        $payload = $request->safe()->except(['image_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        if ($request->hasFile('image_file')) {
            $this->deleteStoredFile($studentFeedbackImage->image_path);
            $payload['image_path'] = $request->file('image_file')->store('feedback/images', 'public');
        }

        $studentFeedbackImage->update($payload);

        return to_route('admin.student-feedback-images.index')->with('success', 'تم تحديث رأي الطالب بنجاح.');
    }

    public function destroy(StudentFeedbackImage $studentFeedbackImage): RedirectResponse
    {
        $this->deleteStoredFile($studentFeedbackImage->image_path);
        $studentFeedbackImage->delete();

        return to_route('admin.student-feedback-images.index')->with('success', 'تم حذف رأي الطالب بنجاح.');
    }

    /**
     * @return array<string, mixed>
     */
    private function adminPayload(StudentFeedbackImage $feedbackImage): array
    {
        return [
            'id' => $feedbackImage->id,
            'student_name' => $feedbackImage->student_name,
            'caption' => $feedbackImage->caption,
            'image_path' => $feedbackImage->image_path,
            'image_url' => $this->resolveMediaUrl($feedbackImage->image_path),
            'status' => $feedbackImage->status,
            'sort_order' => $feedbackImage->sort_order,
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
