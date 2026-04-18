<?php

namespace App\Services\Student;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Review;
use App\Models\Resource;
use App\Models\Task;
use App\Models\User;
use App\Models\WishlistItem;
use App\Support\DateValue;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StudentCourseService
{
    public function enrolledCourses(User $student): Collection
    {
        return Course::query()
            ->whereHas('enrollments', fn ($query) => $query->where('student_id', $student->id))
            ->with([
                'category:id,name',
                'instructor:id,name',
                'wishlistItems' => fn ($query) => $query->where('student_id', $student->id),
                'lessons' => fn ($query) => $query->with('resources')->orderBy('order')->orderBy('id'),
                'resources',
                'tasks' => fn ($query) => $query->orderBy('due_date')->orderBy('id'),
                'tasks.submissions' => fn ($query) => $query->where('student_id', $student->id),
                'exams' => fn ($query) => $query->orderBy('publish_date')->orderBy('id'),
                'exams.attempts' => fn ($query) => $query->where('student_id', $student->id)->latest('id'),
                'exams.questions:id,exam_id',
            ])
            ->orderByDesc(
                Enrollment::query()
                    ->select('enrolled_at')
                    ->whereColumn('course_id', 'courses.id')
                    ->where('student_id', $student->id)
                    ->limit(1)
            )
            ->get();
    }

    public function discoverableCourses(User $student): Collection
    {
        return Course::query()
            ->with([
                'category:id,name',
                'instructor:id,name',
                'enrollments' => fn ($query) => $query->where('student_id', $student->id),
                'wishlistItems' => fn ($query) => $query->where('student_id', $student->id),
            ])
            ->withCount(['lessons', 'resources', 'tasks', 'exams'])
            ->orderBy('title')
            ->get();
    }

    public function coursesDirectoryPayload(User $student): array
    {
        $enrolledCourses = $this->enrolledCourses($student);
        $catalogCourses = $this->discoverableCourses($student);
        $progressSnapshots = $this->courseProgressSnapshots($student, $enrolledCourses);
        $enrolledIds = $enrolledCourses->pluck('id')->map(fn ($id) => (int) $id)->all();

        $availableCourses = $catalogCourses
            ->reject(fn (Course $course) => in_array((int) $course->id, $enrolledIds, true))
            ->values();

        $favoriteCourses = $catalogCourses
            ->filter(fn (Course $course) => $this->isFavorited($course, $student))
            ->values();

        return [
            'stats' => [
                'enrolled_count' => $enrolledCourses->count(),
                'available_count' => $availableCourses->count(),
                'favorites_count' => $favoriteCourses->count(),
                'completed_lessons' => LessonProgress::query()
                    ->where('student_id', $student->id)
                    ->where('is_completed', true)
                    ->count(),
            ],
            'enrolled' => $this->courseSummaryCollection($student, $enrolledCourses, true, $progressSnapshots),
            'available' => $this->courseSummaryCollection($student, $availableCourses, false),
            'favorites' => $favoriteCourses
                ->map(fn (Course $course) => $this->courseSummaryPayload($student, $course))
                ->values()
                ->all(),
        ];
    }

    public function favoriteCoursesPayload(User $student): array
    {
        return $this->discoverableCourses($student)
            ->filter(fn (Course $course) => $this->isFavorited($course, $student))
            ->map(fn (Course $course) => $this->courseSummaryPayload($student, $course))
            ->values()
            ->all();
    }

    public function ensureEnrolledInCourse(User $student, Course $course): void
    {
        if (! $this->isEnrolled($course, $student)) {
            throw new AuthorizationException('ليس لديك صلاحية للوصول إلى هذا الكورس.');
        }
    }

    public function ensureCanAccessLesson(User $student, Lesson $lesson): void
    {
        $this->ensureEnrolledInCourse($student, $lesson->course);

        $lessonStatuses = collect($this->lessonPayloads($student, $lesson->course))->keyBy('id');

        if (($lessonStatuses[$lesson->id]['is_locked'] ?? true) === true) {
            throw new AuthorizationException('هذا الدرس ما زال مقفلاً حتى تُكمل الدروس السابقة.');
        }
    }

    public function coursesIndexPayload(User $student): array
    {
        $courses = $this->enrolledCourses($student);
        $progressSnapshots = $this->courseProgressSnapshots($student, $courses);

        return $this->courseSummaryCollection($student, $courses, true, $progressSnapshots);
    }

    public function courseCardPayload(User $student, Course $course): array
    {
        return $this->courseSummaryPayload($student, $course);
    }

    public function courseShowPayload(User $student, Course $course): array
    {
        $course->loadMissing([
            'category:id,name',
            'instructor:id,name',
            'wishlistItems' => fn ($query) => $query->where('student_id', $student->id),
            'lessons' => fn ($query) => $query->with('resources')->orderBy('order')->orderBy('id'),
            'resources',
            'tasks' => fn ($query) => $query->with([
                'submissions' => fn ($submissionQuery) => $submissionQuery
                    ->where('student_id', $student->id)
                    ->with('revisions'),
            ])->orderBy('due_date')->orderBy('id'),
            'exams' => fn ($query) => $query->with([
                'questions:id,exam_id',
                'attempts' => fn ($attemptQuery) => $attemptQuery->where('student_id', $student->id)->latest('id'),
            ])->orderBy('publish_date')->orderBy('id'),
        ]);

        $isEnrolled = $this->isEnrolled($course, $student);
        $reviews = Review::query()
            ->with('student:id,name,profile_picture')
            ->where('course_id', $course->id)
            ->latest('created_at')
            ->limit(6)
            ->get();
        $studentReview = Review::query()
            ->where('course_id', $course->id)
            ->where('student_id', $student->id)
            ->first();
        $reviewsStats = Review::query()
            ->where('course_id', $course->id)
            ->selectRaw('COUNT(*) as aggregate_count, AVG(rating) as aggregate_rating')
            ->first();
        $reviewsCount = (int) ($reviewsStats?->aggregate_count ?? 0);
        $averageRating = round((float) ($reviewsStats?->aggregate_rating ?? 0), 1);

        return [
            ...$this->courseSummaryPayload($student, $course, $isEnrolled),
            'access_state' => [
                'is_enrolled' => $isEnrolled,
                'is_favorited' => $this->isFavorited($course, $student),
                'locked_message' => $isEnrolled
                    ? null
                    : 'اشترك في الكورس أولاً حتى تتمكن من فتح الدروس والموارد والمهام والاختبارات.',
            ],
            'lessons' => $this->lessonPayloads($student, $course, $isEnrolled),
            'course_resources' => $isEnrolled
                ? $course->resources
                    ->whereNull('lesson_id')
                    ->map(fn (Resource $resource) => $this->resourcePayload($resource))
                    ->values()
                    ->all()
                : [],
            'tasks' => $isEnrolled
                ? $course->tasks
                    ->map(fn (Task $task) => $this->taskPayload($task, $student))
                    ->values()
                    ->all()
                : [],
            'quizzes' => $isEnrolled
                ? $course->exams
                    ->map(fn (Exam $exam) => $this->quizPayload($exam, $student))
                    ->values()
                    ->all()
                : [],
            'reviews' => [
                'count' => $reviewsCount,
                'average_rating' => $averageRating,
                'can_review' => $isEnrolled,
                'store_url' => route('student.courses.reviews.store', $course),
                'student_review' => $studentReview ? $this->reviewPayload($studentReview) : null,
                'items' => $reviews
                    ->map(fn (Review $review) => $this->reviewPayload($review))
                    ->values()
                    ->all(),
            ],
        ];
    }

    public function lessonShowPayload(User $student, Lesson $lesson): array
    {
        $lesson->loadMissing([
            'course.category:id,name',
            'course.instructor:id,name',
            'course.wishlistItems' => fn ($query) => $query->where('student_id', $student->id),
            'course.lessons' => fn ($query) => $query->with('resources')->orderBy('order')->orderBy('id'),
            'course.resources',
            'resources',
        ]);

        $this->ensureCanAccessLesson($student, $lesson);

        $lessons = collect($this->lessonPayloads($student, $lesson->course));
        $currentIndex = $lessons->search(fn (array $item) => $item['id'] === $lesson->id);
        $previousLesson = $currentIndex !== false ? $lessons->get($currentIndex - 1) : null;
        $nextLesson = $currentIndex !== false ? $lessons->get($currentIndex + 1) : null;

        return [
            'course' => $this->courseSummaryPayload($student, $lesson->course, true),
            'lesson' => $lessons->firstWhere('id', $lesson->id),
            'content' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'video_source' => $lesson->video_source ?: Lesson::VIDEO_SOURCE_DRIVE,
                'video_url' => $this->resolveLessonVideoUrl($lesson),
                'embed_url' => $this->resolveLessonEmbedUrl($lesson),
                'duration_minutes' => $lesson->duration_minutes,
                'order' => $lesson->order,
            ],
            'resources' => $lesson->resources
                ->map(fn (Resource $resource) => $this->resourcePayload($resource))
                ->values()
                ->all(),
            'course_resources' => $lesson->course->resources
                ->whereNull('lesson_id')
                ->map(fn (Resource $resource) => $this->resourcePayload($resource))
                ->values()
                ->all(),
            'previous_lesson' => $previousLesson,
            'next_lesson' => $nextLesson && ! $nextLesson['is_locked'] ? $nextLesson : null,
            'all_lessons' => $lessons->all(),
        ];
    }

    public function markLessonCompleted(User $student, Lesson $lesson, int $timeSpentMinutes = 0): LessonProgress
    {
        $this->ensureCanAccessLesson($student, $lesson);

        return LessonProgress::query()->updateOrCreate(
            [
                'student_id' => $student->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'progress_percent' => 100,
                'time_spent_minutes' => max(0, $timeSpentMinutes),
                'is_completed' => true,
                'completed_at' => now(),
            ]
        );
    }

    public function courseProgress(User $student, Course $course): array
    {
        $lessonIds = $course->relationLoaded('lessons')
            ? $course->lessons->pluck('id')
            : $course->lessons()->pluck('id');

        $totalLessons = $lessonIds->count();
        $completedLessons = $totalLessons === 0
            ? 0
            : LessonProgress::query()
                ->where('student_id', $student->id)
                ->whereIn('lesson_id', $lessonIds)
                ->where('is_completed', true)
                ->count();

        $percentage = $totalLessons === 0
            ? 0
            : (int) round(($completedLessons / $totalLessons) * 100);

        return [
            'completed_lessons' => $completedLessons,
            'total_lessons' => $totalLessons,
            'percentage' => $percentage,
        ];
    }

    public function resourcePayload(Resource $resource): array
    {
        return [
            'id' => $resource->id,
            'title' => $resource->title,
            'file_url' => $this->fileUrl($resource->file),
            'download_url' => route('student.resources.download', $resource),
            'lesson_id' => $resource->lesson_id,
        ];
    }

    public function taskPayload(Task $task, User $student): array
    {
        $task->loadMissing([
            'course:id,title',
            'submissions' => fn ($query) => $query->where('student_id', $student->id)->with('revisions'),
        ]);

        $submission = $task->submissions->first();

        return [
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'course' => $task->course ? ['id' => $task->course->id, 'title' => $task->course->title] : null,
            'priority' => $task->priority,
            'due_date' => DateValue::iso8601($task->due_date),
            'due_date_label' => DateValue::localized($task->due_date, 'd M Y - h:i A', config('app.timezone')),
            'allow_resubmission' => (bool) $task->allow_resubmission,
            'task_file_url' => $this->fileUrl($task->file),
            'submission' => $submission ? [
                'id' => $submission->id,
                'status' => $submission->status,
                'score' => $submission->score,
                'feedback' => $submission->feedback,
                'submitted_at' => DateValue::iso8601($submission->submitted_at),
                'submitted_at_label' => DateValue::localized($submission->submitted_at, 'd M Y - h:i A'),
                'file_url' => $this->fileUrl($submission->submission_file),
                'submission_text' => $submission->submission_text,
                'revisions' => $submission->revisions
                    ->sortByDesc('submitted_at')
                    ->map(fn ($revision) => [
                        'id' => $revision->id,
                        'submitted_at' => DateValue::iso8601($revision->submitted_at),
                        'submitted_at_label' => DateValue::localized($revision->submitted_at, 'd M Y - h:i A'),
                        'file_url' => $this->fileUrl($revision->submission_file),
                        'submission_text' => $revision->submission_text,
                    ])
                    ->values()
                    ->all(),
            ] : null,
        ];
    }

    public function quizPayload(Exam $exam, User $student): array
    {
        $exam->loadMissing([
            'course:id,title',
            'questions:id,exam_id',
            'attempts' => fn ($query) => $query->where('student_id', $student->id)->latest('id'),
        ]);

        $attempts = $exam->attempts;
        $latestAttempt = $attempts->first();
        $attemptsUsed = $attempts->count();
        $attemptsAllowed = max(1, (int) ($exam->max_attempts ?? 1));
        $publishDate = DateValue::asCarbon($exam->publish_date);
        $isPublished = $publishDate === null || $publishDate->lte(now());

        return [
            'id' => $exam->id,
            'title' => $exam->title,
            'description' => $exam->description,
            'course' => $exam->course ? ['id' => $exam->course->id, 'title' => $exam->course->title] : null,
            'time_limit' => $exam->time_limit,
            'total_marks' => $exam->total_marks,
            'publish_date' => DateValue::iso8601($exam->publish_date),
            'publish_date_label' => DateValue::localized($exam->publish_date, 'd M Y - h:i A'),
            'attempts_allowed' => $attemptsAllowed,
            'attempts_used' => $attemptsUsed,
            'attempts_remaining' => max($attemptsAllowed - $attemptsUsed, 0),
            'allowed_tab_switches' => (int) ($exam->allowed_tab_switches ?? 2),
            'pass_percentage' => (int) ($exam->pass_percentage ?? 60),
            'question_count' => $exam->questions->count(),
            'is_published' => $isPublished,
            'can_start' => $isPublished && ($latestAttempt?->status === null || $latestAttempt->status === \App\Models\StudentExamAttempt::STATUS_IN_PROGRESS || $attemptsUsed < $attemptsAllowed),
            'latest_attempt' => $latestAttempt ? [
                'id' => $latestAttempt->id,
                'status' => $latestAttempt->status,
                'status_label' => $this->quizAttemptStatusLabel($latestAttempt->status),
                'score' => $latestAttempt->score,
                'is_passed' => $latestAttempt->is_passed,
                'finished_at' => DateValue::iso8601($latestAttempt->finished_at),
                'finished_at_label' => DateValue::localized($latestAttempt->finished_at, 'd M Y - h:i A'),
                'termination_reason' => $latestAttempt->termination_reason,
                'termination_reason_label' => $this->quizTerminationReasonLabel($latestAttempt->termination_reason),
            ] : null,
            'show_url' => route('student.quizzes.show', $exam),
        ];
    }

    public function reviewPayload(Review $review): array
    {
        $review->loadMissing('student:id,name,profile_picture');

        return [
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'created_at' => DateValue::iso8601($review->created_at),
            'created_at_label' => DateValue::localized($review->created_at, 'd M Y'),
            'student' => [
                'id' => $review->student?->id,
                'name' => $review->student?->name,
                'profile_picture' => $this->fileUrl($review->student?->profile_picture),
            ],
        ];
    }

    private function quizAttemptStatusLabel(?string $status): string
    {
        return match ($status) {
            'submitted' => 'تم التسليم',
            'auto_submitted' => 'تم التسليم تلقائيًا',
            'terminated' => 'تم إنهاء المحاولة',
            'in_progress' => 'قيد التنفيذ',
            default => 'غير معروف',
        };
    }

    private function quizTerminationReasonLabel(?string $reason): ?string
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

    public function lessonPayloads(User $student, Course $course, bool $hasAccess = true): array
    {
        if ($course->relationLoaded('lessons')) {
            $course->lessons->loadMissing('resources');
        } else {
            $course->load([
                'lessons' => fn ($query) => $query->with('resources')->orderBy('order')->orderBy('id'),
            ]);
        }

        if (! $hasAccess) {
            return $course->lessons->map(fn (Lesson $lesson) => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'duration_minutes' => $lesson->duration_minutes,
                'order' => $lesson->order,
                'video_url' => null,
                'video_source' => $lesson->video_source ?: Lesson::VIDEO_SOURCE_DRIVE,
                'progress_percent' => 0,
                'is_completed' => false,
                'is_locked' => true,
                'completed_at' => null,
                'show_url' => null,
                'resources' => [],
            ])->values()->all();
        }

        $progressEntries = LessonProgress::query()
            ->where('student_id', $student->id)
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        $completedBefore = true;

        return $course->lessons->map(function (Lesson $lesson) use ($progressEntries, &$completedBefore) {
            $progress = $progressEntries->get($lesson->id);
            $isCompleted = (bool) ($progress?->is_completed ?? false);
            $isLocked = ! $completedBefore;

            $payload = [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'duration_minutes' => $lesson->duration_minutes,
                'order' => $lesson->order,
                'video_source' => $lesson->video_source ?: Lesson::VIDEO_SOURCE_DRIVE,
                'video_url' => $this->resolveLessonVideoUrl($lesson),
                'embed_url' => $this->resolveLessonEmbedUrl($lesson),
                'progress_percent' => (int) ($progress?->progress_percent ?? 0),
                'is_completed' => $isCompleted,
                'is_locked' => $isLocked,
                'completed_at' => DateValue::iso8601($progress?->completed_at),
                'show_url' => $isLocked ? null : route('student.lessons.show', $lesson),
                'resources' => $lesson->resources
                    ->map(fn (Resource $resource) => $this->resourcePayload($resource))
                    ->values()
                    ->all(),
            ];

            $completedBefore = $completedBefore && $isCompleted;

            return $payload;
        })->values()->all();
    }

    public function fileUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }

    private function resolveLessonVideoUrl(Lesson $lesson): ?string
    {
        $source = $lesson->video_source ?: Lesson::VIDEO_SOURCE_DRIVE;

        if ($source === Lesson::VIDEO_SOURCE_UPLOAD) {
            return $this->fileUrl($lesson->video_path);
        }

        return $lesson->video_url;
    }

    private function resolveLessonEmbedUrl(Lesson $lesson): ?string
    {
        $source = $lesson->video_source ?: Lesson::VIDEO_SOURCE_DRIVE;
        $url = $lesson->video_url;

        if (! $url) {
            return null;
        }

        return match ($source) {
            Lesson::VIDEO_SOURCE_YOUTUBE => $this->normalizeYoutubeEmbedUrl($url),
            Lesson::VIDEO_SOURCE_DRIVE => $this->normalizeDriveEmbedUrl($url),
            default => null,
        };
    }

    private function normalizeYoutubeEmbedUrl(string $url): string
    {
        if (Str::contains($url, 'youtube.com/embed/')) {
            return $url;
        }

        $parsed = parse_url($url);
        if (! is_array($parsed)) {
            return $url;
        }

        $host = $parsed['host'] ?? '';
        $path = $parsed['path'] ?? '';
        parse_str($parsed['query'] ?? '', $query);

        if (Str::contains($host, 'youtu.be') && $path !== '') {
            return 'https://www.youtube.com/embed/'.ltrim($path, '/');
        }

        if (Str::contains($host, 'youtube.com') && isset($query['v']) && $query['v'] !== '') {
            return 'https://www.youtube.com/embed/'.$query['v'];
        }

        return $url;
    }

    private function normalizeDriveEmbedUrl(string $url): string
    {
        if (Str::contains($url, '/preview')) {
            return $url;
        }

        if (preg_match('/\/file\/d\/([^\/]+)/', $url, $matches) === 1) {
            return 'https://drive.google.com/file/d/'.$matches[1].'/preview';
        }

        return $url;
    }

    private function courseSummaryPayload(User $student, Course $course, ?bool $isEnrolled = null, ?array $progressSnapshot = null): array
    {
        $isEnrolled ??= $this->isEnrolled($course, $student);
        $progress = $isEnrolled
            ? ($progressSnapshot['progress'] ?? $this->courseProgress($student, $course))
            : [
                'completed_lessons' => 0,
                'total_lessons' => $this->courseLessonsCount($course),
                'percentage' => 0,
            ];

        $nextLesson = $isEnrolled
            ? ($progressSnapshot['next_lesson_id'] ?? collect($this->lessonPayloads($student, $course))
                ->first(fn (array $lesson) => ! $lesson['is_completed'] && ! $lesson['is_locked'])['id'] ?? null)
            : null;

        return [
            'id' => $course->id,
            'title' => $course->title,
            'description' => $course->description,
            'thumbnail_url' => $this->fileUrl($course->thumbnail),
            'price' => $course->price,
            'category' => $course->category?->name,
            'instructor' => $course->instructor?->name,
            'total_duration_minutes' => $course->total_duration_minutes ?: ($course->relationLoaded('lessons') ? $course->lessons->sum('duration_minutes') : (int) $course->lessons()->sum('duration_minutes')),
            'lessons_count' => $this->courseLessonsCount($course),
            'resources_count' => $this->courseResourcesCount($course),
            'tasks_count' => $this->courseTasksCount($course),
            'quizzes_count' => $this->courseQuizzesCount($course),
            'progress' => $progress,
            'next_lesson_id' => $nextLesson,
            'is_enrolled' => $isEnrolled,
            'is_favorited' => $this->isFavorited($course, $student),
            'show_url' => route('student.courses.show', $course),
            'enroll_url' => $isEnrolled ? null : route('student.courses.enroll', $course),
            'favorite_url' => route('student.courses.favorite', $course),
        ];
    }

    /**
     * @param  iterable<Course>  $courses
     * @return array<int, array<string, mixed>>
     */
    private function courseSummaryCollection(User $student, iterable $courses, bool $isEnrolled, ?SupportCollection $progressSnapshots = null): array
    {
        return collect($courses)
            ->map(fn (Course $course) => $this->courseSummaryPayload(
                $student,
                $course,
                $isEnrolled,
                $progressSnapshots?->get($course->id)
            ))
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, Course>  $courses
     */
    private function courseProgressSnapshots(User $student, Collection $courses): SupportCollection
    {
        if ($courses->isEmpty()) {
            return collect();
        }

        $lessonIds = $courses
            ->flatMap(fn (Course $course) => $course->lessons->pluck('id'))
            ->filter()
            ->values();

        if ($lessonIds->isEmpty()) {
            return $courses->mapWithKeys(fn (Course $course) => [
                $course->id => [
                    'progress' => [
                        'completed_lessons' => 0,
                        'total_lessons' => 0,
                        'percentage' => 0,
                    ],
                    'next_lesson_id' => null,
                ],
            ]);
        }

        $progressEntries = LessonProgress::query()
            ->where('student_id', $student->id)
            ->whereIn('lesson_id', $lessonIds)
            ->get(['lesson_id', 'progress_percent', 'is_completed', 'completed_at'])
            ->keyBy('lesson_id');

        return $courses->mapWithKeys(function (Course $course) use ($progressEntries) {
            $completedBefore = true;
            $completedLessons = 0;
            $nextLessonId = null;
            $lessons = $course->lessons->sortBy([['order', 'asc'], ['id', 'asc']])->values();

            foreach ($lessons as $lesson) {
                $progress = $progressEntries->get($lesson->id);
                $isCompleted = (bool) ($progress?->is_completed ?? false);
                $isLocked = ! $completedBefore;

                if ($isCompleted) {
                    $completedLessons++;
                }

                if ($nextLessonId === null && ! $isCompleted && ! $isLocked) {
                    $nextLessonId = $lesson->id;
                }

                $completedBefore = $completedBefore && $isCompleted;
            }

            $totalLessons = $lessons->count();

            return [
                $course->id => [
                    'progress' => [
                        'completed_lessons' => $completedLessons,
                        'total_lessons' => $totalLessons,
                        'percentage' => $totalLessons > 0 ? (int) round(($completedLessons / $totalLessons) * 100) : 0,
                    ],
                    'next_lesson_id' => $nextLessonId,
                ],
            ];
        });
    }

    private function isEnrolled(Course $course, User $student): bool
    {
        if ($course->relationLoaded('enrollments')) {
            return $course->enrollments->contains(fn ($enrollment) => (int) $enrollment->student_id === (int) $student->id);
        }

        return Enrollment::query()
            ->where('student_id', $student->id)
            ->where('course_id', $course->id)
            ->exists();
    }

    private function isFavorited(Course $course, User $student): bool
    {
        if ($course->relationLoaded('wishlistItems')) {
            return $course->wishlistItems->contains(fn ($item) => (int) $item->student_id === (int) $student->id);
        }

        return WishlistItem::query()
            ->where('student_id', $student->id)
            ->where('course_id', $course->id)
            ->exists();
    }

    private function courseLessonsCount(Course $course): int
    {
        return (int) ($course->lessons_count ?? ($course->relationLoaded('lessons') ? $course->lessons->count() : $course->lessons()->count()));
    }

    private function courseResourcesCount(Course $course): int
    {
        return (int) ($course->resources_count ?? ($course->relationLoaded('resources') ? $course->resources->count() : $course->resources()->count()));
    }

    private function courseTasksCount(Course $course): int
    {
        return (int) ($course->tasks_count ?? ($course->relationLoaded('tasks') ? $course->tasks->count() : $course->tasks()->count()));
    }

    private function courseQuizzesCount(Course $course): int
    {
        return (int) ($course->exams_count ?? ($course->relationLoaded('exams') ? $course->exams->count() : $course->exams()->count()));
    }
}
