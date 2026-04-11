<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Requests\UpdateEnrollmentRequest;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/enrollments/index', [
            'enrollments' => Enrollment::with(['student', 'course'])
                ->orderBy('enrolled_at', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Enrollment $e) => [
                    'id' => $e->id,
                    'student' => $e->student ? ['id' => $e->student->id, 'name' => $e->student->name] : null,
                    'course' => $e->course ? ['id' => $e->course->id, 'title' => $e->course->title] : null,
                    'enrolled_at' => $e->enrolled_at,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/enrollments/create', [
            'students' => $this->students(),
            'courses' => $this->courses(),
        ]);
    }

    public function store(StoreEnrollmentRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        if (empty($payload['enrolled_at'])) {
            $payload['enrolled_at'] = now();
        }

        Enrollment::create($payload);

        return to_route('admin.enrollments.index')->with('success', 'تمت إضافة طلب التسجيل بنجاح.');
    }

    public function edit(Enrollment $enrollment): Response
    {
        return Inertia::render('admin/enrollments/edit', [
            'enrollment' => [
                'id' => $enrollment->id,
                'student_id' => $enrollment->student_id,
                'course_id' => $enrollment->course_id,
                'enrolled_at' => $enrollment->enrolled_at?->format('Y-m-d\TH:i'),
            ],
            'students' => $this->students(),
            'courses' => $this->courses(),
        ]);
    }

    public function update(UpdateEnrollmentRequest $request, Enrollment $enrollment): RedirectResponse
    {
        $payload = $request->validated();
        $enrollment->update($payload);

        return to_route('admin.enrollments.index')->with('success', 'تم تحديث طلب التسجيل بنجاح.');
    }

    public function destroy(Enrollment $enrollment): RedirectResponse
    {
        $enrollment->delete();

        return to_route('admin.enrollments.index')->with('success', 'تم حذف طلب التسجيل بنجاح.');
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
        return Course::query()
            ->orderBy('title')
            ->get(['id', 'title'])
            ->toArray();
    }
}
