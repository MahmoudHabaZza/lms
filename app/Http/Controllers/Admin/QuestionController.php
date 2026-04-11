<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/questions/index', [
            'questions' => Question::with('exam')
                ->orderBy('id', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Question $q) => [
                    'id' => $q->id,
                    'exam' => $q->exam ? ['id' => $q->exam->id, 'title' => $q->exam->title] : null,
                    'question_text' => $q->question_text,
                    'option_a' => $q->option_a,
                    'option_b' => $q->option_b,
                    'option_c' => $q->option_c,
                    'option_d' => $q->option_d,
                    'correct_option' => $q->correct_option,
                    'mark' => $q->mark,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/questions/create', [
            'exams' => $this->exams(),
        ]);
    }

    public function store(StoreQuestionRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        Question::create($payload);

        return to_route('admin.questions.index')->with('success', 'تمت إضافة السؤال بنجاح.');
    }

    public function edit(Question $question): Response
    {
        return Inertia::render('admin/questions/edit', [
            'question' => [
                'id' => $question->id,
                'exam_id' => $question->exam_id,
                'question_text' => $question->question_text,
                'option_a' => $question->option_a,
                'option_b' => $question->option_b,
                'option_c' => $question->option_c,
                'option_d' => $question->option_d,
                'correct_option' => $question->correct_option,
                'mark' => $question->mark,
            ],
            'exams' => $this->exams(),
        ]);
    }

    public function update(UpdateQuestionRequest $request, Question $question): RedirectResponse
    {
        $payload = $request->validated();
        $question->update($payload);

        return to_route('admin.questions.index')->with('success', 'تم تحديث السؤال بنجاح.');
    }

    public function destroy(Question $question): RedirectResponse
    {
        $question->delete();

        return to_route('admin.questions.index')->with('success', 'تم حذف السؤال بنجاح.');
    }

    private function exams(): array
    {
        return Exam::query()
            ->orderBy('title')
            ->get(['id', 'title'])
            ->toArray();
    }
}
