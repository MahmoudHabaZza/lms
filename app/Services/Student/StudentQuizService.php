<?php

namespace App\Services\Student;

use App\Models\Certificate;
use App\Models\Exam;
use App\Models\Question;
use App\Models\StudentAnswer;
use App\Models\StudentExamAttempt;
use App\Models\User;
use App\Services\Certificates\CertificateGeneratorService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StudentQuizService
{
    public function __construct(
        private readonly StudentCourseService $courseService,
        private readonly CertificateGeneratorService $certificateGeneratorService,
    ) {
    }

    public function pagePayload(User $student, Exam $exam): array
    {
        $exam->loadMissing([
            'course:id,title',
            'questions' => fn ($query) => $query->orderBy('id'),
            'attempts' => fn ($query) => $query->where('student_id', $student->id)->latest('id'),
        ]);

        $this->courseService->ensureEnrolledInCourse($student, $exam->course);

        $activeAttempt = $this->resolveAttempt($student, $exam);
        $history = StudentExamAttempt::query()
            ->where('student_id', $student->id)
            ->where('exam_id', $exam->id)
            ->where('status', '!=', StudentExamAttempt::STATUS_IN_PROGRESS)
            ->latest('id')
            ->get();

        $certificate = null;
        if ($history->firstWhere('is_passed', true)) {
            $certificate = Certificate::query()
                ->where('student_id', $student->id)
                ->where('exam_id', $exam->id)
                ->latest('id')
                ->first();
        }

        $attemptsAllowed = max(1, (int) ($exam->max_attempts ?? 1));
        $attemptsUsed = StudentExamAttempt::query()
            ->where('student_id', $student->id)
            ->where('exam_id', $exam->id)
            ->count();
        $isPublished = $exam->publish_date === null || $exam->publish_date->lte(now());
        $latestFinishedAttempt = $history->first();

        return [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'course' => $exam->course ? ['id' => $exam->course->id, 'title' => $exam->course->title] : null,
                'time_limit' => $exam->time_limit,
                'total_marks' => $exam->total_marks ?: $exam->questions->sum('mark'),
                'pass_percentage' => (int) ($exam->pass_percentage ?? 60),
                'allowed_tab_switches' => (int) ($exam->allowed_tab_switches ?? 2),
                'attempts_allowed' => $attemptsAllowed,
                'attempts_used' => min($attemptsUsed, $attemptsAllowed),
                'attempts_remaining' => max($attemptsAllowed - $attemptsUsed, 0),
                'publish_date' => $exam->publish_date?->toIso8601String(),
                'is_published' => $isPublished,
                'is_available' => $isPublished && $exam->questions->isNotEmpty(),
                'question_count' => $exam->questions->count(),
            ],
            'attempt' => $activeAttempt ? $this->attemptPayload($activeAttempt) : null,
            'latest_result' => $latestFinishedAttempt ? [
                'id' => $latestFinishedAttempt->id,
                'status' => $latestFinishedAttempt->status,
                'status_label' => $this->statusLabel($latestFinishedAttempt->status),
                'score' => $latestFinishedAttempt->score,
                'is_passed' => $latestFinishedAttempt->is_passed,
                'attempt_number' => $latestFinishedAttempt->attempt_number,
                'finished_at' => $latestFinishedAttempt->finished_at?->toIso8601String(),
                'finished_at_label' => $latestFinishedAttempt->finished_at?->translatedFormat('d M Y - h:i A'),
                'termination_reason' => $latestFinishedAttempt->termination_reason,
                'termination_reason_label' => $this->terminationReasonLabel($latestFinishedAttempt->termination_reason),
            ] : null,
            'history' => $history->map(fn (StudentExamAttempt $attempt) => [
                'id' => $attempt->id,
                'status' => $attempt->status,
                'status_label' => $this->statusLabel($attempt->status),
                'score' => $attempt->score,
                'is_passed' => $attempt->is_passed,
                'attempt_number' => $attempt->attempt_number,
                'time_taken_seconds' => $attempt->time_taken_seconds,
                'finished_at' => $attempt->finished_at?->toIso8601String(),
                'finished_at_label' => $attempt->finished_at?->translatedFormat('d M Y - h:i A'),
                'termination_reason' => $attempt->termination_reason,
                'termination_reason_label' => $this->terminationReasonLabel($attempt->termination_reason),
            ])->values()->all(),
            'certificate' => $certificate ? [
                'id' => $certificate->id,
                'download_url' => route('student.certificates.download', $certificate),
            ] : null,
        ];
    }

    public function recordSecurityViolation(User $student, StudentExamAttempt $attempt, string $event): array
    {
        $attempt->loadMissing('exam.course');
        $this->ensureAttemptOwnership($student, $attempt);

        if ($attempt->status !== StudentExamAttempt::STATUS_IN_PROGRESS) {
            return [
                'terminated' => false,
                'tab_switch_count' => $attempt->tab_switch_count,
                'status' => $attempt->status,
            ];
        }

        $attempt->increment('tab_switch_count');
        $attempt->refresh();

        $allowed = (int) ($attempt->exam->allowed_tab_switches ?? 2);
        if ($attempt->tab_switch_count > $allowed) {
            $attempt = $this->submitAttempt($student, $attempt, [], true, 'security_violation:'.$event);

            return [
                'terminated' => true,
                'tab_switch_count' => $attempt->tab_switch_count,
                'status' => $attempt->status,
            ];
        }

        return [
            'terminated' => false,
            'tab_switch_count' => $attempt->tab_switch_count,
            'status' => $attempt->status,
        ];
    }

    public function submitAttempt(
        User $student,
        StudentExamAttempt $attempt,
        array $answers,
        bool $autoSubmitted = false,
        ?string $reason = null,
    ): StudentExamAttempt {
        $attempt->loadMissing('exam.questions', 'exam.course');
        $this->ensureAttemptOwnership($student, $attempt);

        if ($attempt->status !== StudentExamAttempt::STATUS_IN_PROGRESS) {
            throw ValidationException::withMessages([
                'attempt' => 'تم إنهاء هذه المحاولة بالفعل.',
            ]);
        }

        $isExpired = $this->isExpired($attempt);
        $normalizedAnswers = collect($answers)
            ->mapWithKeys(fn (array $item) => [
                (int) $item['question_id'] => strtoupper((string) ($item['selected_option'] ?? '')),
            ]);

        $submittedAt = now();
        $timeTakenSeconds = max(0, $attempt->started_at?->diffInSeconds($submittedAt) ?? 0);
        if ($attempt->exam->time_limit) {
            $timeTakenSeconds = min($timeTakenSeconds, $attempt->exam->time_limit * 60);
        }

        $status = $autoSubmitted || $isExpired
            ? StudentExamAttempt::STATUS_AUTO_SUBMITTED
            : StudentExamAttempt::STATUS_SUBMITTED;

        if ($reason !== null && str_contains($reason, 'security_violation')) {
            $status = StudentExamAttempt::STATUS_TERMINATED;
        }

        DB::transaction(function () use ($attempt, $normalizedAnswers, $submittedAt, $timeTakenSeconds, $status, $reason) {
            $score = 0;
            $totalMarks = 0;

            foreach ($attempt->exam->questions as $question) {
                $selectedOption = $normalizedAnswers->get($question->id);
                $isCorrect = $selectedOption !== null
                    && $selectedOption !== ''
                    && strtoupper((string) $question->correct_option) === $selectedOption;

                $totalMarks += (int) $question->mark;
                if ($isCorrect) {
                    $score += (int) $question->mark;
                }

                StudentAnswer::query()->updateOrCreate(
                    [
                        'attempt_id' => $attempt->id,
                        'question_id' => $question->id,
                    ],
                    [
                        'selected_option' => in_array($selectedOption, ['A', 'B', 'C', 'D'], true) ? $selectedOption : null,
                        'is_correct' => $isCorrect,
                    ]
                );
            }

            $referenceTotal = $totalMarks ?: max(1, (int) $attempt->exam->total_marks);
            $passMark = (int) round($referenceTotal * ((int) ($attempt->exam->pass_percentage ?? 60) / 100));

            $attempt->update([
                'score' => $score,
                'finished_at' => $submittedAt,
                'time_taken_seconds' => $timeTakenSeconds,
                'is_passed' => $score >= $passMark,
                'status' => $status,
                'termination_reason' => $reason,
            ]);
        });

        $attempt = $attempt->fresh(['exam.course', 'answers.question']);

        if ($attempt->is_passed) {
            $this->certificateGeneratorService->issueForAttempt($attempt);
        }

        return $attempt;
    }

    private function resolveAttempt(User $student, Exam $exam): ?StudentExamAttempt
    {
        $activeAttempt = StudentExamAttempt::query()
            ->where('student_id', $student->id)
            ->where('exam_id', $exam->id)
            ->where('status', StudentExamAttempt::STATUS_IN_PROGRESS)
            ->latest('id')
            ->first();

        if ($activeAttempt && $this->isExpired($activeAttempt)) {
            $this->submitAttempt($student, $activeAttempt, [], true, 'time_limit_exceeded');
            $activeAttempt = null;
        }

        if ($activeAttempt) {
            return $activeAttempt->fresh(['exam.questions']);
        }

        $isPublished = $exam->publish_date === null || $exam->publish_date->lte(now());
        if (! $isPublished || $exam->questions->isEmpty()) {
            return null;
        }

        $attemptsCount = StudentExamAttempt::query()
            ->where('student_id', $student->id)
            ->where('exam_id', $exam->id)
            ->count();

        if ($attemptsCount >= max(1, (int) ($exam->max_attempts ?? 1))) {
            return null;
        }

        $orderedQuestions = $exam->randomize_questions
            ? $exam->questions->shuffle()
            : $exam->questions->sortBy('id')->values();

        $answerOrder = [];
        foreach ($orderedQuestions as $question) {
            $options = ['A', 'B', 'C', 'D'];
            $answerOrder[$question->id] = $exam->randomize_answers ? collect($options)->shuffle()->values()->all() : $options;
        }

        return StudentExamAttempt::query()->create([
            'student_id' => $student->id,
            'exam_id' => $exam->id,
            'started_at' => now(),
            'status' => StudentExamAttempt::STATUS_IN_PROGRESS,
            'attempt_number' => $attemptsCount + 1,
            'question_order' => $orderedQuestions->pluck('id')->values()->all(),
            'answer_order' => $answerOrder,
            'tab_switch_count' => 0,
        ])->fresh(['exam.questions']);
    }

    private function attemptPayload(StudentExamAttempt $attempt): array
    {
        $attempt->loadMissing('exam.questions');

        $orderedQuestions = $this->orderedQuestions($attempt);
        $deadlineAt = $attempt->exam->time_limit
            ? $attempt->started_at?->copy()->addMinutes($attempt->exam->time_limit)
            : null;
        $timeRemaining = $deadlineAt ? now()->diffInSeconds($deadlineAt, false) : null;

        return [
            'id' => $attempt->id,
            'status' => $attempt->status,
            'attempt_number' => $attempt->attempt_number,
            'started_at' => $attempt->started_at?->toIso8601String(),
            'deadline_at' => $deadlineAt?->toIso8601String(),
            'time_remaining_seconds' => $timeRemaining === null ? null : max($timeRemaining, 0),
            'tab_switch_count' => $attempt->tab_switch_count,
            'questions' => $orderedQuestions->map(fn (Question $question) => [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'mark' => $question->mark,
                'options' => collect($attempt->answer_order[$question->id] ?? ['A', 'B', 'C', 'D'])
                    ->map(fn (string $key) => [
                        'key' => $key,
                        'text' => $question->{'option_'.strtolower($key)},
                    ])
                    ->filter(fn (array $option) => filled($option['text']))
                    ->values()
                    ->all(),
            ])->values()->all(),
            'submit_url' => route('student.quiz-attempts.submit', $attempt),
            'security_event_url' => route('student.quiz-attempts.security-event', $attempt),
        ];
    }

    private function orderedQuestions(StudentExamAttempt $attempt): Collection
    {
        $questions = $attempt->exam->questions->keyBy('id');
        $order = collect($attempt->question_order ?: $questions->keys()->all());

        return $order
            ->map(fn ($id) => $questions->get((int) $id))
            ->filter()
            ->values();
    }

    private function isExpired(StudentExamAttempt $attempt): bool
    {
        if (! $attempt->exam->time_limit || ! $attempt->started_at) {
            return false;
        }

        return $attempt->started_at->copy()->addMinutes($attempt->exam->time_limit)->lte(now());
    }

    private function ensureAttemptOwnership(User $student, StudentExamAttempt $attempt): void
    {
        if ((int) $attempt->student_id !== (int) $student->id) {
            throw new AuthorizationException('لا يمكنك الوصول إلى هذه المحاولة.');
        }

        $this->courseService->ensureEnrolledInCourse($student, $attempt->exam->course);
    }

    private function statusLabel(?string $status): string
    {
        return match ($status) {
            StudentExamAttempt::STATUS_SUBMITTED => 'تم التسليم',
            StudentExamAttempt::STATUS_AUTO_SUBMITTED => 'تم التسليم تلقائيًا',
            StudentExamAttempt::STATUS_TERMINATED => 'تم إنهاء المحاولة',
            StudentExamAttempt::STATUS_IN_PROGRESS => 'قيد التنفيذ',
            default => 'غير معروف',
        };
    }

    private function terminationReasonLabel(?string $reason): ?string
    {
        return match ($reason) {
            null, '' => null,
            'time_limit_exceeded' => 'انتهى وقت الاختبار',
            'security_violation' => 'تم إنهاء المحاولة بسبب مخالفة أمنية',
            'security_violation:visibility_hidden' => 'تم إنهاء المحاولة بسبب مغادرة صفحة الاختبار',
            'security_violation:window_blur' => 'تم إنهاء المحاولة بسبب فقدان التركيز على نافذة الاختبار',
            'security_violation:devtools_detected' => 'تم إنهاء المحاولة بسبب محاولة فتح أدوات المطور',
            default => 'تم إنهاء المحاولة لسبب تقني',
        };
    }
}