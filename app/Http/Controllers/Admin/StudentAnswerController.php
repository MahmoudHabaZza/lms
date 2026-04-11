<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentAnswerRequest;
use App\Http\Requests\UpdateStudentAnswerRequest;
use App\Models\Question;
use App\Models\StudentAnswer;
use App\Models\StudentExamAttempt;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StudentAnswerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/student-answers/index', [
            'answers' => StudentAnswer::with(['attempt.student', 'question'])
                ->orderBy('created_at', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (StudentAnswer $a) => [
                    'id' => $a->id,
                    'attempt' => $a->attempt ? ['id' => $a->attempt->id] : null,
                    'student' => $a->attempt?->student ? ['id' => $a->attempt->student->id, 'name' => $a->attempt->student->name] : null,
                    'question' => $a->question ? ['id' => $a->question->id, 'question_text' => $a->question->question_text] : null,
                    'selected_option' => $a->selected_option,
                    'is_correct' => $a->is_correct,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/student-answers/create', [
            'attempts' => $this->attempts(),
            'questions' => $this->questions(),
        ]);
    }

    public function store(StoreStudentAnswerRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        StudentAnswer::create($payload);

        return to_route('admin.student-answers.index')->with('success', 'تمت إضافة إجابة الطالب بنجاح.');
    }

    public function edit(StudentAnswer $studentAnswer): Response
    {
        return Inertia::render('admin/student-answers/edit', [
            'answer' => [
                'id' => $studentAnswer->id,
                'attempt_id' => $studentAnswer->attempt_id,
                'question_id' => $studentAnswer->question_id,
                'selected_option' => $studentAnswer->selected_option,
                'is_correct' => $studentAnswer->is_correct,
            ],
            'attempts' => $this->attempts(),
            'questions' => $this->questions(),
        ]);
    }

    public function update(UpdateStudentAnswerRequest $request, StudentAnswer $studentAnswer): RedirectResponse
    {
        $payload = $request->validated();
        $studentAnswer->update($payload);

        return to_route('admin.student-answers.index')->with('success', 'تم تحديث إجابة الطالب بنجاح.');
    }

    public function destroy(StudentAnswer $studentAnswer): RedirectResponse
    {
        $studentAnswer->delete();

        return to_route('admin.student-answers.index')->with('success', 'تم حذف إجابة الطالب بنجاح.');
    }

    private function attempts(): array
    {
        return StudentExamAttempt::query()->with('student')->orderByDesc('id')->get()->map(fn (StudentExamAttempt $attempt) => [
            'id' => $attempt->id,
            'label' => 'محاولة #'.$attempt->id.' - '.($attempt->student?->name ?? 'طالب'),
        ])->toArray();
    }

    private function questions(): array
    {
        return Question::query()->orderByDesc('id')->get()->map(fn (Question $question) => [
            'id' => $question->id,
            'label' => 'سؤال #'.$question->id.' - '.str($question->question_text)->limit(50),
        ])->toArray();
    }
}
