<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Exam;
use Database\Factories\CertificateFactory;
use Database\Factories\CertificateRequestFactory;
use Database\Factories\ExamFactory;
use Database\Factories\NotificationFactory;
use Database\Factories\QuestionFactory;
use Database\Factories\StudentAnswerFactory;
use Database\Factories\StudentExamAttemptFactory;
use Database\Seeders\Concerns\SeedsInChunks;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AssessmentAndNotificationsSeeder extends Seeder
{
    use SeedsInChunks;

    public function run(): void
    {
        $now = now();
        $courses = Course::query()->orderBy('id')->get();
        $blueprints = collect(ArabicSeedSupport::courseBlueprints())->keyBy('title');
        $families = ArabicSeedSupport::courseFamilies();
        $examRows = [];
        $examPlans = [];

        foreach ($courses as $courseIndex => $course) {
            $family = $families[$blueprints[$course->title]['family']];
            $plans = [
                ['label' => 'اختبار منتصف المسار', 'question_count' => 4, 'minutes' => 20],
                ['label' => 'الاختبار النهائي', 'question_count' => 5, 'minutes' => 30],
            ];
            if ($courseIndex < 4) {
                $plans[] = ['label' => 'تحدي سريع', 'question_count' => 3, 'minutes' => 12];
            }

            foreach ($plans as $plan) {
                $title = $plan['label'].' - '.$course->title;
                $examPlans[$title] = ['course_id' => $course->id, 'family' => $family, 'question_count' => $plan['question_count'], 'label' => $plan['label']];
                $examRows[] = array_merge(ExamFactory::new()->raw(), [
                    'course_id' => $course->id,
                    'title' => $title,
                    'description' => 'اختبار يقيس فهم الطالب لمخرجات هذا الجزء من الكورس.',
                    'time_limit' => $plan['minutes'],
                    'total_marks' => collect($family['questions'])->take($plan['question_count'])->sum('mark'),
                    'publish_date' => $now->copy()->subDays(($course->id + $plan['question_count']) % 45),
                    'max_attempts' => $plan['label'] === 'الاختبار النهائي' ? 2 : 1,
                    'allowed_tab_switches' => $plan['label'] === 'تحدي سريع' ? 1 : 2,
                    'pass_percentage' => $plan['label'] === 'الاختبار النهائي' ? 65 : 60,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('exams', $examRows);

        $exams = Exam::query()->orderBy('id')->get();
        $questionRows = [];
        foreach ($exams as $exam) {
            $plan = $examPlans[$exam->title];
            foreach (collect($plan['family']['questions'])->take($plan['question_count']) as $question) {
                $questionRows[] = array_merge(QuestionFactory::new()->raw(), $question, [
                    'exam_id' => $exam->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('questions', $questionRows, 200);

        $questionsByExam = DB::table('questions')->orderBy('id')->get()->groupBy('exam_id');
        $enrollmentsByCourse = DB::table('enrollments')->get()->groupBy('course_id');
        $attemptRows = [];
        $answerPlans = [];

        foreach ($exams as $examIndex => $exam) {
            $students = collect($enrollmentsByCourse[$exam->course_id] ?? [])->take(6)->values();
            foreach ($students as $studentIndex => $enrollment) {
                $attemptNumber = ($exam->max_attempts > 1 && ($studentIndex + $examIndex) % 4 === 0) ? 2 : 1;
                $questionSet = $questionsByExam[$exam->id];
                $correctCount = 0;
                $answers = [];
                foreach ($questionSet as $question) {
                    $correct = (($enrollment->student_id + $question->id + $attemptNumber) % 100) < ($exam->title && str_contains($exam->title, 'الاختبار النهائي') ? 72 : 63);
                    $selected = $correct ? $question->correct_option : collect(['A', 'B', 'C', 'D'])->reject(fn (string $option) => $option === $question->correct_option)->values()->all()[($question->id + $studentIndex) % 3];
                    $answers[] = ['question_id' => $question->id, 'selected_option' => $selected, 'is_correct' => $correct];
                    if ($correct) {
                        $correctCount += $question->mark;
                    }
                }

                $status = ($studentIndex + $examIndex) % 9 === 0 ? 'auto_submitted' : 'submitted';
                if (($studentIndex + $examIndex) % 13 === 0) {
                    $status = 'terminated';
                }
                $isPassed = $status !== 'terminated' && $correctCount >= ($exam->total_marks * ($exam->pass_percentage / 100));
                $composite = $exam->id.'-'.$enrollment->student_id.'-'.$attemptNumber;
                $answerPlans[$composite] = $answers;

                $attemptRows[] = array_merge(StudentExamAttemptFactory::new()->raw(), [
                    'student_id' => $enrollment->student_id,
                    'exam_id' => $exam->id,
                    'score' => $status === 'terminated' ? 0 : $correctCount,
                    'started_at' => $now->copy()->subDays(($examIndex + $studentIndex) % 20)->subMinutes($exam->time_limit ?? 20),
                    'finished_at' => $now->copy()->subDays(($examIndex + $studentIndex) % 20),
                    'is_passed' => $isPassed,
                    'status' => $status,
                    'attempt_number' => $attemptNumber,
                    'time_taken_seconds' => min(($exam->time_limit ?? 20) * 60, 420 + (($examIndex + $studentIndex) % 7) * 120),
                    'tab_switch_count' => $status === 'terminated' ? $exam->allowed_tab_switches + 1 : (($examIndex + $studentIndex) % 2),
                    'termination_reason' => $status === 'terminated' ? 'tab_limit_exceeded' : null,
                    'question_order' => json_encode($questionSet->pluck('id')->values()->all(), JSON_UNESCAPED_UNICODE),
                    'answer_order' => json_encode($questionSet->mapWithKeys(fn ($question) => [$question->id => ['A', 'B', 'C', 'D']])->all(), JSON_UNESCAPED_UNICODE),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('student_exam_attempts', $attemptRows, 150);

        $attempts = DB::table('student_exam_attempts')->orderBy('id')->get();
        $answerRows = [];
        $certificateRows = [];
        $certificateRequestRows = [];

        foreach ($attempts as $attempt) {
            $composite = $attempt->exam_id.'-'.$attempt->student_id.'-'.$attempt->attempt_number;
            foreach ($answerPlans[$composite] as $answer) {
                $answerRows[] = array_merge(StudentAnswerFactory::new()->raw(), [
                    'attempt_id' => $attempt->id,
                    'question_id' => $answer['question_id'],
                    'selected_option' => $answer['selected_option'],
                    'is_correct' => $answer['is_correct'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $exam = $exams->firstWhere('id', $attempt->exam_id);
            if ($attempt->is_passed && str_contains($exam->title, 'الاختبار النهائي')) {
                $certificateRows[] = array_merge(CertificateFactory::new()->raw(), [
                    'attempt_id' => $attempt->id,
                    'student_id' => $attempt->student_id,
                    'exam_id' => $attempt->exam_id,
                    'certificate_code' => 'CERT-'.str_pad((string) $attempt->id, 6, '0', STR_PAD_LEFT),
                    'verification_code' => 'VER-'.Str::upper(Str::random(10)),
                    'issued_at' => $now->copy()->subDays($attempt->id % 20),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                if ($attempt->id % 3 === 0) {
                    $certificateRequestRows[] = array_merge(CertificateRequestFactory::new()->raw(), [
                        'student_id' => $attempt->student_id,
                        'instructor_id' => $courses->firstWhere('id', $exam->course_id)->instructor_id,
                        'course_title' => $courses->firstWhere('id', $exam->course_id)->title,
                        'status' => $attempt->id % 2 === 0 ? 'approved' : 'pending',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            }
        }
        $this->insertInChunks('student_answers', $answerRows, 250);
        $this->insertInChunks('certificates', $certificateRows);
        $this->insertInChunks('certificate_requests', $certificateRequestRows);

        $messages = ArabicSeedSupport::notificationMessages();
        $notificationRows = [];
        foreach (DB::table('users')->select('id', 'role')->orderBy('id')->get() as $userIndex => $user) {
            $notificationRows[] = array_merge(NotificationFactory::new()->raw(), [
                'user_id' => $user->id,
                'title' => 'تحديث تقدم التعلم',
                'message' => $messages['progress'],
                'type' => 'info',
                'is_read' => $userIndex % 3 === 0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            if ($user->role === 'student') {
                $notificationRows[] = array_merge(NotificationFactory::new()->raw(), [
                    'user_id' => $user->id,
                    'title' => 'تذكير بمهمة جديدة',
                    'message' => $messages['task_due'],
                    'type' => 'warning',
                    'is_read' => $userIndex % 4 === 0,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $notificationRows[] = array_merge(NotificationFactory::new()->raw(), [
                    'user_id' => $user->id,
                    'title' => 'حالة الاختبار',
                    'message' => $messages['exam_published'],
                    'type' => 'success',
                    'is_read' => false,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('notifications', $notificationRows, 200);
    }
}