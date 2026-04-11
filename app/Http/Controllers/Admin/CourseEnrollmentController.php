<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseEnrollment;
use App\Models\ProgrammingCourse;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CourseEnrollmentController extends Controller
{
    public function index(): Response
    {
        $enrollments = CourseEnrollment::with(['student', 'course'])
            ->orderByDesc('enrolled_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (CourseEnrollment $enrollment) => [
                'id' => $enrollment->id,
                'student' => $enrollment->student ? [
                    'id' => $enrollment->student->id,
                    'name' => $enrollment->student->name,
                ] : null,
                'course' => $enrollment->course ? [
                    'id' => $enrollment->course->id,
                    'title' => $enrollment->course->title,
                ] : null,
                'enrolled_at' => $enrollment->enrolled_at,
            ]);

        return Inertia::render('admin/course-enrollments/index', [
            'enrollments' => $enrollments,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/course-enrollments/create', [
            'students' => $this->students(),
            'courses' => $this->courses(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $this->validateEnrollment($request);
        if (empty($payload['enrolled_at'])) {
            $payload['enrolled_at'] = now();
        }
        CourseEnrollment::create($payload);

        return to_route('admin.course-enrollments.index')->with('success', 'تمت إضافة اشتراك الكورس بنجاح.');
    }

    public function edit(CourseEnrollment $courseEnrollment): Response
    {
        return Inertia::render('admin/course-enrollments/edit', [
            'enrollment' => [
                'id' => $courseEnrollment->id,
                'user_id' => $courseEnrollment->user_id,
                'programming_course_id' => $courseEnrollment->programming_course_id,
                'enrolled_at' => $courseEnrollment->enrolled_at?->format('Y-m-d\TH:i'),
            ],
            'students' => $this->students(),
            'courses' => $this->courses(),
        ]);
    }

    public function update(Request $request, CourseEnrollment $courseEnrollment): RedirectResponse
    {
        $payload = $this->validateEnrollment($request, $courseEnrollment->id);
        if (empty($payload['enrolled_at'])) {
            $payload['enrolled_at'] = $courseEnrollment->enrolled_at;
        }
        $courseEnrollment->update($payload);

        return to_route('admin.course-enrollments.index')->with('success', 'تم تحديث اشتراك الكورس بنجاح.');
    }

    public function destroy(CourseEnrollment $courseEnrollment): RedirectResponse
    {
        $courseEnrollment->delete();

        return to_route('admin.course-enrollments.index')->with('success', 'تم حذف اشتراك الكورس بنجاح.');
    }

    private function validateEnrollment(Request $request, ?int $ignoreId = null): array
    {
        $uniqueRule = Rule::unique('course_enrollments')
            ->where(fn ($query) => $query
                ->where('user_id', $request->input('user_id'))
                ->where('programming_course_id', $request->input('programming_course_id'))
            );

        if ($ignoreId) {
            $uniqueRule->ignore($ignoreId);
        }

        return $request->validate([
            'user_id' => ['required', 'exists:users,id', $uniqueRule],
            'programming_course_id' => ['required', 'exists:programming_courses,id'],
            'enrolled_at' => ['nullable', 'date'],
        ]);
    }

    private function students(): array
    {
        return User::query()
            ->where('role', 'student')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray();
    }

    private function courses(): array
    {
        return ProgrammingCourse::query()
            ->orderBy('title')
            ->get(['id', 'title'])
            ->toArray();
    }
}
