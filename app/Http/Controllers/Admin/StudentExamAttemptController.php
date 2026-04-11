<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentExamAttemptRequest;
use App\Http\Requests\UpdateStudentExamAttemptRequest;
use App\Models\StudentExamAttempt;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class StudentExamAttemptController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/attempts/index', [
            'attempts' => StudentExamAttempt::with(['student', 'exam'])
                ->orderBy('created_at', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (StudentExamAttempt $a) => [
                    'id' => $a->id,
                    'student' => $a->student ? ['id' => $a->student->id, 'name' => $a->student->name] : null,
                    'exam' => $a->exam ? ['id' => $a->exam->id, 'title' => $a->exam->title] : null,
                    'score' => $a->score,
                    'started_at' => $this->formatDateTime($a->started_at),
                    'finished_at' => $this->formatDateTime($a->finished_at),
                    'is_passed' => $a->is_passed,
                    'created_at' => $this->formatDisplayDateTime($a->created_at),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/attempts/create', [
            'students' => $this->students(),
            'exams' => $this->exams(),
        ]);
    }

    public function store(StoreStudentExamAttemptRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        StudentExamAttempt::create($payload);

        return to_route('admin.attempts.index')->with('success', 'تمت إضافة محاولة الاختبار بنجاح.');
    }

    public function edit(StudentExamAttempt $attempt): Response
    {
        return Inertia::render('admin/attempts/edit', [
            'attempt' => [
                'id' => $attempt->id,
                'student_id' => $attempt->student_id,
                'exam_id' => $attempt->exam_id,
                'score' => $attempt->score,
                'started_at' => $this->formatDateTime($attempt->started_at),
                'finished_at' => $this->formatDateTime($attempt->finished_at),
                'is_passed' => $attempt->is_passed,
            ],
            'students' => $this->students(),
            'exams' => $this->exams(),
        ]);
    }

    public function update(UpdateStudentExamAttemptRequest $request, StudentExamAttempt $attempt): RedirectResponse
    {
        $payload = $request->validated();
        $attempt->update($payload);

        return to_route('admin.attempts.index')->with('success', 'تم تحديث محاولة الاختبار بنجاح.');
    }

    public function destroy(StudentExamAttempt $attempt): RedirectResponse
    {
        $attempt->delete();

        return to_route('admin.attempts.index')->with('success', 'تم حذف محاولة الاختبار بنجاح.');
    }

    private function students(): array
    {
        return User::query()->where('role', 'student')->orderBy('name')->get(['id', 'name'])->toArray();
    }

    private function exams(): array
    {
        return Exam::query()->orderBy('title')->get(['id', 'title'])->toArray();
    }

    private function formatDateTime(mixed $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value->format('Y-m-d\TH:i');
        }

        return Carbon::parse($value)->format('Y-m-d\TH:i');
    }

    private function formatDisplayDateTime(mixed $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value->format('Y-m-d H:i');
        }

        return Carbon::parse($value)->format('Y-m-d H:i');
    }
}
