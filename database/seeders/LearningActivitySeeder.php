<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Task;
use App\Models\User;
use Database\Factories\EnrollmentFactory;
use Database\Factories\LessonProgressFactory;
use Database\Factories\TaskFactory;
use Database\Factories\TaskSubmissionFactory;
use Database\Factories\TaskSubmissionRevisionFactory;
use Database\Factories\WishlistItemFactory;
use Database\Seeders\Concerns\SeedsInChunks;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LearningActivitySeeder extends Seeder
{
    use SeedsInChunks;

    public function run(): void
    {
        $now = now();
        $courses = Course::query()->with('lessons')->orderBy('id')->get();
        $students = User::query()->where('role', 'student')->orderBy('id')->get(['id']);
        $families = ArabicSeedSupport::courseFamilies();
        $blueprints = collect(ArabicSeedSupport::courseBlueprints())->keyBy('title');

        $enrollments = [];
        $studentEnrollments = [];
        foreach ($students as $index => $student) {
            $count = 2 + ($index % 3);
            $selected = [];
            for ($i = 0; $i < $count; $i++) {
                $course = $courses[($index * 2 + $i * 5) % $courses->count()];
                $selected[$course->id] = $course->id;
            }
            foreach (array_values($selected) as $courseId) {
                $studentEnrollments[$student->id][] = $courseId;
                $enrollments[] = array_merge(EnrollmentFactory::new()->raw(), [
                    'student_id' => $student->id,
                    'course_id' => $courseId,
                    'enrolled_at' => $now->copy()->subDays(($student->id + $courseId) % 160),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('enrollments', $enrollments);

        $wishlistRows = [];
        foreach ($students as $index => $student) {
            $enrolledIds = $studentEnrollments[$student->id] ?? [];
            $wishlistCount = 1 + ($index % 2);
            $added = [];
            for ($i = 0; $i < $wishlistCount + 2; $i++) {
                $course = $courses[($index * 3 + $i * 4 + 1) % $courses->count()];
                if (in_array($course->id, $enrolledIds, true) || isset($added[$course->id])) {
                    continue;
                }
                $added[$course->id] = true;
                $wishlistRows[] = array_merge(WishlistItemFactory::new()->raw(), [
                    'student_id' => $student->id,
                    'course_id' => $course->id,
                    'created_at' => $now->copy()->subDays(($student->id + $course->id) % 90),
                ]);
                if (count($added) >= $wishlistCount) {
                    break;
                }
            }
        }
        $this->insertInChunks('wishlist_items', $wishlistRows);

        $taskRows = [];
        foreach ($courses as $courseIndex => $course) {
            $family = $families[$blueprints[$course->title]['family']];
            $taskTemplates = $family['task_templates'];
            $taskTemplates[] = ['title' => 'المشروع الختامي للكورس', 'priority' => 'high', 'allow_resubmission' => true];

            foreach ($taskTemplates as $taskIndex => $taskTemplate) {
                $taskRows[] = array_merge(TaskFactory::new()->raw(), [
                    'instructor_id' => $course->instructor_id,
                    'course_id' => $course->id,
                    'title' => $taskTemplate['title'].' - '.$course->title,
                    'description' => 'المهمة مرتبطة بمفاهيم الدروس الأخيرة في هذا الكورس. المطلوب من الطالب تنفيذ جزء عملي وتسليم ملف أو رابط يوضح الفكرة. راجع الدروس من 1 إلى '.min(6, $course->lessons->count()).' قبل التسليم.',
                    'file' => ArabicSeedSupport::resourceFile(Str::slug($course->title).'/task-'.($taskIndex + 1), 'zip'),
                    'priority' => $taskTemplate['priority'],
                    'due_date' => $now->copy()->addDays(5 + (($courseIndex + $taskIndex) % 10)),
                    'allow_resubmission' => $taskTemplate['allow_resubmission'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('tasks', $taskRows);

        $progressRows = [];
        foreach ($students as $studentIndex => $student) {
            foreach ($studentEnrollments[$student->id] ?? [] as $courseId) {
                $course = $courses->firstWhere('id', $courseId);
                foreach ($course->lessons as $lesson) {
                    $rawProgress = (($studentIndex + 1) * 11 + $lesson->order * 13 + $courseId) % 125;
                    $progress = $rawProgress >= 92 ? 100 : min(95, $rawProgress);
                    $completed = $progress === 100;
                    $progressRows[] = array_merge(LessonProgressFactory::new()->raw(), [
                        'student_id' => $student->id,
                        'lesson_id' => $lesson->id,
                        'progress_percent' => $progress,
                        'time_spent_minutes' => max(8, min(110, (int) round($lesson->duration_minutes * ($progress / 100 + 0.35)))),
                        'is_completed' => $completed,
                        'completed_at' => $completed ? $now->copy()->subDays(($student->id + $lesson->id) % 40) : null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            }
        }
        $this->insertInChunks('lesson_progress', $progressRows, 200);

        $tasks = Task::query()->orderBy('id')->get();
        $enrollmentsByCourse = collect($enrollments)->groupBy('course_id');
        $submissionRows = [];
        $revisionRows = [];

        foreach ($tasks as $taskIndex => $task) {
            $courseEnrollments = $enrollmentsByCourse[$task->course_id] ?? collect();
            foreach ($courseEnrollments->values() as $enrollmentIndex => $enrollment) {
                if ((($taskIndex + $enrollmentIndex) % 5) === 0) {
                    continue;
                }

                $status = match (($taskIndex + $enrollmentIndex) % 6) {
                    0, 1, 2 => 'graded',
                    3 => 'pending',
                    default => 'rejected',
                };
                $score = $status === 'graded' ? 58 + (($taskIndex + $enrollmentIndex) % 43) : null;
                $submittedAt = $now->copy()->subDays(($taskIndex + $enrollmentIndex) % 18 + 1);
                $submissionRows[] = array_merge(TaskSubmissionFactory::new()->raw(), [
                    'task_id' => $task->id,
                    'student_id' => $enrollment['student_id'],
                    'submission_file' => 'https://cdn.kid-coder.test/submissions/task-'.$task->id.'-student-'.$enrollment['student_id'].'.zip',
                    'submitted_at' => $submittedAt,
                    'score' => $score,
                    'feedback' => $status === 'graded'
                        ? 'التنفيذ منظم والفكرة واضحة. حاول تحسين تسمية الملفات أو شرح الخطوات داخل المشروع.'
                        : ($status === 'rejected'
                            ? 'الملف المرفوع ناقص أو لا يطابق المطلوب. راجع التعليمات وحاول مرة أخرى.'
                            : 'تم استلام التسليم وسيتم مراجعته قريباً.'),
                    'status' => $status,
                    'graded_at' => $status === 'graded' ? $submittedAt->copy()->addDays(2) : null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('task_submissions', $submissionRows, 150);

        $submissions = DB::table('task_submissions')->get();
        foreach ($submissions as $submissionIndex => $submission) {
            $task = $tasks->firstWhere('id', $submission->task_id);
            if (! $task->allow_resubmission || $submission->status === 'pending' || ($submissionIndex % 4 !== 0)) {
                continue;
            }

            $revisionRows[] = array_merge(TaskSubmissionRevisionFactory::new()->raw(), [
                'task_submission_id' => $submission->id,
                'submission_file' => 'https://cdn.kid-coder.test/submissions/revision-'.$submission->id.'.zip',
                'submitted_at' => now()->subDays($submissionIndex % 7),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
        $this->insertInChunks('task_submission_revisions', $revisionRows);
    }
}