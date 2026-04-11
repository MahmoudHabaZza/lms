<?php

namespace App\Services\Student;

use App\Models\Certificate;
use App\Models\Exam;
use App\Models\LessonProgress;
use App\Models\Notification;
use App\Models\StudentExamAttempt;
use App\Models\TaskSubmission;
use App\Models\User;

class StudentDashboardService
{
    public function __construct(
        private readonly StudentCourseService $courseService,
    ) {
    }

    public function build(User $student): array
    {
        $courses = collect($this->courseService->coursesIndexPayload($student));
        $courseIds = $courses->pluck('id')->filter()->values();

        $completedLessons = LessonProgress::query()
            ->where('student_id', $student->id)
            ->where('is_completed', true)
            ->count();

        $pendingTasks = \App\Models\Task::query()
            ->whereIn('course_id', $courseIds)
            ->whereDoesntHave('submissions', fn ($query) => $query
                ->where('student_id', $student->id)
                ->whereNotIn('status', ['rejected']))
            ->count();

        $upcomingQuizzes = Exam::query()
            ->whereIn('course_id', $courseIds)
            ->whereNotNull('publish_date')
            ->where('publish_date', '>', now())
            ->count();

        $recentActivity = collect()
            ->merge(
                LessonProgress::query()
                    ->with('lesson.course')
                    ->where('student_id', $student->id)
                    ->where('is_completed', true)
                    ->latest('completed_at')
                    ->limit(4)
                    ->get()
                    ->map(fn (LessonProgress $progress) => [
                        'id' => 'lesson-'.$progress->id,
                        'type' => 'lesson_completed',
                        'title' => 'أكملت درسًا جديدًا',
                        'description' => $progress->lesson?->title,
                        'meta' => $progress->lesson?->course?->title,
                        'happened_at' => $progress->completed_at?->toIso8601String(),
                    ])
            )
            ->merge(
                TaskSubmission::query()
                    ->with('task.course')
                    ->where('student_id', $student->id)
                    ->latest('submitted_at')
                    ->limit(3)
                    ->get()
                    ->map(fn (TaskSubmission $submission) => [
                        'id' => 'task-'.$submission->id,
                        'type' => 'task_submission',
                        'title' => 'تم تسليم مهمة',
                        'description' => $submission->task?->title,
                        'meta' => $submission->task?->course?->title,
                        'happened_at' => $submission->submitted_at?->toIso8601String(),
                    ])
            )
            ->merge(
                StudentExamAttempt::query()
                    ->with('exam.course')
                    ->where('student_id', $student->id)
                    ->whereNotNull('finished_at')
                    ->latest('finished_at')
                    ->limit(3)
                    ->get()
                    ->map(fn (StudentExamAttempt $attempt) => [
                        'id' => 'attempt-'.$attempt->id,
                        'type' => 'quiz_attempt',
                        'title' => $attempt->is_passed ? 'نجحت في اختبار' : 'أنهيت اختبارًا',
                        'description' => $attempt->exam?->title,
                        'meta' => $attempt->exam?->course?->title,
                        'happened_at' => $attempt->finished_at?->toIso8601String(),
                    ])
            )
            ->merge(
                Certificate::query()
                    ->with('exam.course')
                    ->where('student_id', $student->id)
                    ->latest('issued_at')
                    ->limit(2)
                    ->get()
                    ->map(fn (Certificate $certificate) => [
                        'id' => 'certificate-'.$certificate->id,
                        'type' => 'certificate',
                        'title' => 'حصلت على شهادة',
                        'description' => $certificate->exam?->title,
                        'meta' => $certificate->exam?->course?->title,
                        'happened_at' => $certificate->issued_at?->toIso8601String(),
                    ])
            )
            ->sortByDesc('happened_at')
            ->take(8)
            ->values()
            ->all();

        $upcomingQuizItems = Exam::query()
            ->with('course:id,title')
            ->whereIn('course_id', $courseIds)
            ->whereNotNull('publish_date')
            ->where('publish_date', '>', now())
            ->orderBy('publish_date')
            ->limit(4)
            ->get()
            ->map(fn (Exam $exam) => [
                'id' => $exam->id,
                'title' => $exam->title,
                'course' => $exam->course?->title,
                'publish_date' => $exam->publish_date?->toIso8601String(),
                'publish_date_label' => $exam->publish_date?->translatedFormat('d M Y - h:i A'),
                'show_url' => route('student.quizzes.show', $exam),
            ])
            ->values()
            ->all();

        $notifications = Notification::query()
            ->where('user_id', $student->id)
            ->latest('created_at')
            ->limit(4)
            ->get()
            ->map(fn (Notification $notification) => [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'is_read' => $notification->is_read,
                'created_at_label' => $notification->created_at?->translatedFormat('d M Y - h:i A'),
                'mark_read_url' => route('student.notifications.read', $notification),
            ])
            ->values()
            ->all();

        return [
            'courses' => $courses->all(),
            'stats' => [
                'completed_lessons' => $completedLessons,
                'pending_tasks' => $pendingTasks,
                'upcoming_quizzes' => $upcomingQuizzes,
                'certificates' => Certificate::query()->where('student_id', $student->id)->count(),
            ],
            'recent_activity' => $recentActivity,
            'upcoming_quiz_items' => $upcomingQuizItems,
            'notifications' => [
                'items' => $notifications,
                'unread_count' => Notification::query()
                    ->where('user_id', $student->id)
                    ->where('is_read', false)
                    ->count(),
                'index_url' => route('student.notifications.index'),
            ],
        ];
    }
}