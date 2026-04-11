<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\RecordStudentQuizSecurityEventRequest;
use App\Http\Requests\Student\SubmitStudentQuizAttemptRequest;
use App\Models\Exam;
use App\Models\StudentExamAttempt;
use App\Services\Student\StudentQuizService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function __construct(
        private readonly StudentQuizService $quizService,
    ) {
    }

    public function show(Request $request, Exam $exam): Response
    {
        return Inertia::render('Student/QuizInterface', [
            'quizPage' => $this->quizService->pagePayload($request->user(), $exam),
        ]);
    }

    public function submit(SubmitStudentQuizAttemptRequest $request, StudentExamAttempt $attempt): JsonResponse
    {
        $attempt = $this->quizService->submitAttempt(
            $request->user(),
            $attempt,
            $request->validated('answers', []),
            (bool) $request->boolean('auto_submitted'),
            $request->validated('reason')
        );

        return response()->json([
            'status' => $attempt->status,
            'score' => $attempt->score,
            'is_passed' => $attempt->is_passed,
            'redirect_url' => route('student.quizzes.show', $attempt->exam_id),
        ]);
    }

    public function securityEvent(RecordStudentQuizSecurityEventRequest $request, StudentExamAttempt $attempt): JsonResponse
    {
        return response()->json(
            $this->quizService->recordSecurityViolation(
                $request->user(),
                $attempt,
                $request->validated('event')
            )
        );
    }
}
