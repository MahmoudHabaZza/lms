<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Models\Course;
use App\Models\Exam;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/exams/index', [
            'exams' => Exam::query()
                ->with('course')
                ->orderBy('id', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Exam $e) => $this->adminPayload($e)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/exams/create', [
            'courses' => $this->courses(),
        ]);
    }

    public function store(StoreExamRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        Exam::create($payload);

        return to_route('admin.exams.index')->with('success', 'تمت إضافة الاختبار بنجاح.');
    }

    public function edit(Exam $exam): Response
    {
        return Inertia::render('admin/exams/edit', [
            'exam' => $this->adminPayload($exam),
            'courses' => $this->courses(),
        ]);
    }

    public function update(UpdateExamRequest $request, Exam $exam): RedirectResponse
    {
        $payload = $request->validated();
        $exam->update($payload);

        return to_route('admin.exams.index')->with('success', 'تم تحديث الاختبار بنجاح.');
    }

    public function destroy(Exam $exam): RedirectResponse
    {
        $exam->delete();

        return to_route('admin.exams.index')->with('success', 'تم حذف الاختبار بنجاح.');
    }

    private function adminPayload(Exam $e): array
    {
        return [
            'id' => $e->id,
            'title' => $e->title,
            'course_id' => $e->course_id,
            'course_title' => $e->course?->title,
            'description' => $e->description,
            'time_limit' => $e->time_limit,
            'total_marks' => $e->total_marks,
            'publish_date' => $this->formatDate($e->publish_date),
        ];
    }

    private function courses(): array
    {
        return Course::query()
            ->orderBy('title')
            ->get(['id', 'title'])
            ->toArray();
    }

    private function formatDate(mixed $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value->format('Y-m-d');
        }

        return Carbon::parse($value)->format('Y-m-d');
    }
}
