<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        $courses = Course::with(['instructor', 'category'])
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Course $course) => [
                'id' => $course->id,
                'thumbnail' => $course->thumbnail,
                'title' => $course->title,
                'short_description' => $course->short_description,
                'price' => $course->price,
                'total_duration_minutes' => $course->total_duration_minutes,
                'duration_months' => $course->duration_months,
                'sessions_count' => $course->sessions_count,
                'sessions_per_week' => $course->sessions_per_week,
                'badge' => $course->badge,
                'accent_color' => $course->accent_color,
                'status' => (bool) $course->status,
                'sort_order' => $course->sort_order,
                'instructor' => $course->instructor ? [
                    'id' => $course->instructor->id,
                    'name' => $course->instructor->name,
                ] : null,
                'category' => $course->category ? [
                    'id' => $course->category->id,
                    'name' => $course->category->name,
                ] : null,
            ]);

        return Inertia::render('admin/courses/index', [
            'courses' => $courses,
            'stats' => [
                'total' => Course::query()->count(),
                'active' => Course::query()->where('status', true)->count(),
                'average_sessions' => (int) round((float) (Course::query()->avg('sessions_count') ?? 0)),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/courses/create', [
            'instructors' => $this->instructors(),
            'categories' => $this->categories(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $this->validateCourse($request);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['accent_color'] = $payload['accent_color'] ?? '#f97316';
        $payload['age_group'] = Course::AGE_GROUP_5_TO_17;

        Course::create($payload);

        return to_route('admin.courses.index')->with('success', 'تمت إضافة الكورس بنجاح.');
    }

    public function edit(Course $course): Response
    {
        return Inertia::render('admin/courses/edit', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'short_description' => $course->short_description,
                'learning_outcome' => $course->learning_outcome,
                'thumbnail' => $course->thumbnail,
                'price' => $course->price,
                'total_duration_minutes' => $course->total_duration_minutes,
                'duration_months' => $course->duration_months,
                'sessions_count' => $course->sessions_count,
                'sessions_per_week' => $course->sessions_per_week,
                'badge' => $course->badge,
                'accent_color' => $course->accent_color,
                'status' => (bool) $course->status,
                'sort_order' => $course->sort_order,
                'instructor_id' => $course->instructor_id,
                'category_id' => $course->category_id,
            ],
            'instructors' => $this->instructors(),
            'categories' => $this->categories(),
        ]);
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $payload = $this->validateCourse($request);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['accent_color'] = $payload['accent_color'] ?? '#f97316';
        $payload['age_group'] = Course::AGE_GROUP_5_TO_17;

        $course->update($payload);

        return to_route('admin.courses.index')->with('success', 'تم تحديث الكورس بنجاح.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();

        return to_route('admin.courses.index')->with('success', 'تم حذف الكورس بنجاح.');
    }

    private function validateCourse(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['required', 'string'],
            'learning_outcome' => ['nullable', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'total_duration_minutes' => ['nullable', 'integer', 'min:0'],
            'duration_months' => ['required', 'integer', 'min:1', 'max:60'],
            'sessions_count' => ['required', 'integer', 'min:1', 'max:300'],
            'sessions_per_week' => ['required', 'integer', 'min:1', 'max:7'],
            'badge' => ['nullable', 'string', 'max:60'],
            'accent_color' => ['nullable', 'regex:/^#(?:[A-Fa-f0-9]{3}){1,2}$/'],
            'status' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'instructor_id' => [
                'required',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role', 'instructor')),
            ],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);
    }

    private function instructors(): array
    {
        return User::query()
            ->where('role', 'instructor')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray();
    }

    private function categories(): array
    {
        return Category::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray();
    }
}
