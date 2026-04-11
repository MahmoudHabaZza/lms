<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTopStudentRequest;
use App\Http\Requests\UpdateTopStudentRequest;
use App\Models\TopStudent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TopStudentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/top-students/index', [
            'topStudents' => TopStudent::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->paginate(12)
                ->withQueryString()
                ->through(fn (TopStudent $topStudent): array => $this->adminPayload($topStudent)),
            'stats' => [
                'total' => TopStudent::query()->count(),
                'active' => TopStudent::query()->where('status', true)->count(),
                'max_sort_order' => (int) (TopStudent::query()->max('sort_order') ?? 0),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/top-students/create');
    }

    public function store(StoreTopStudentRequest $request): RedirectResponse
    {
        $payload = $request->safe()->except(['image_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        if ($request->hasFile('image_file')) {
            $payload['image_path'] = $request->file('image_file')->store('top-students', 'public');
        }

        TopStudent::create($payload);

        return to_route('admin.top-students.index')->with('success', 'تمت إضافة الطالب المتفوق بنجاح.');
    }

    public function edit(TopStudent $topStudent): Response
    {
        return Inertia::render('admin/top-students/edit', [
            'topStudent' => $this->adminPayload($topStudent),
        ]);
    }

    public function update(UpdateTopStudentRequest $request, TopStudent $topStudent): RedirectResponse
    {
        $payload = $request->safe()->except(['image_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        if ($request->hasFile('image_file')) {
            $this->deleteStoredFile($topStudent->image_path);
            $payload['image_path'] = $request->file('image_file')->store('top-students', 'public');
        }

        $topStudent->update($payload);

        return to_route('admin.top-students.index')->with('success', 'تم تحديث بيانات الطالب المتفوق بنجاح.');
    }

    public function destroy(TopStudent $topStudent): RedirectResponse
    {
        $this->deleteStoredFile($topStudent->image_path);
        $topStudent->delete();

        return to_route('admin.top-students.index')->with('success', 'تم حذف الطالب المتفوق بنجاح.');
    }

    /**
     * @return array<string, mixed>
     */
    private function adminPayload(TopStudent $topStudent): array
    {
        return [
            'id' => $topStudent->id,
            'student_name' => $topStudent->student_name,
            'achievement_title' => $topStudent->achievement_title,
            'image_path' => $topStudent->image_path,
            'image_url' => $this->resolveMediaUrl($topStudent->image_path),
            'status' => $topStudent->status,
            'sort_order' => $topStudent->sort_order,
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
