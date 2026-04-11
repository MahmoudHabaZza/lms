<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Course;
use App\Models\User;
use App\Services\StudentAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $status = (string) $request->string('status', 'all');

        $students = User::query()
            ->where('role', 'student')
            ->with(['assignedCourses:id,title'])
            ->withCount('assignedCourses')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->when($status === 'active', fn ($query) => $query->where('is_active', true))
            ->when($status === 'inactive', fn ($query) => $query->where('is_active', false))
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (User $student) => $this->studentPayload($student));

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'stats' => [
                'total' => User::query()->where('role', 'student')->count(),
                'active' => User::query()->where('role', 'student')->where('is_active', true)->count(),
                'inactive' => User::query()->where('role', 'student')->where('is_active', false)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/students/create', [
            'courses' => $this->courses(),
        ]);
    }

    public function store(StoreStudentRequest $request, StudentAccountService $studentAccountService): RedirectResponse
    {
        $studentAccountService->create($request->validated());

        return to_route('admin.students.index')->with('success', 'تم إنشاء حساب الطالب بنجاح.');
    }

    public function edit(User $student): Response
    {
        abort_unless($student->isStudent(), 404);

        $student->load('assignedCourses:id,title');

        return Inertia::render('admin/students/edit', [
            'student' => $this->studentPayload($student, true),
            'courses' => $this->courses(),
        ]);
    }

    public function update(UpdateStudentRequest $request, User $student, StudentAccountService $studentAccountService): RedirectResponse
    {
        abort_unless($student->isStudent(), 404);

        $result = $studentAccountService->update($student, $request->validated());

        return to_route('admin.students.edit', $student)->with(
            'success',
            $result['plain_password']
                ? 'تم تحديث بيانات الطالب وتغيير كلمة المرور بنجاح.'
                : 'تم تحديث بيانات الطالب بنجاح.',
        );
    }

    public function destroy(User $student): RedirectResponse
    {
        abort_unless($student->isStudent(), 404);

        $student->delete();

        return to_route('admin.students.index')->with('success', 'تم حذف حساب الطالب بنجاح.');
    }

    private function courses(): array
    {
        return Course::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get(['id', 'title'])
            ->toArray();
    }

    private function studentPayload(User $student, bool $withSelection = false): array
    {
        return [
            'id' => $student->id,
            'name' => $student->name,
            'email' => $student->email,
            'username' => $student->username,
            'phone_number' => $student->phone_number,
            'is_active' => (bool) $student->is_active,
            'created_at' => $student->created_at?->format('Y-m-d'),
            'assigned_courses_count' => $student->assigned_courses_count ?? $student->assignedCourses->count(),
            'assigned_courses' => $student->assignedCourses->map(fn ($course) => [
                'id' => $course->id,
                'title' => $course->title,
            ])->values(),
            'course_ids' => $withSelection
                ? $student->assignedCourses->pluck('id')->map(fn ($id) => (int) $id)->values()
                : null,
        ];
    }
}
