<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Models\Certificate;
use App\Models\CertificateRequest;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Notification;
use App\Models\Question;
use App\Models\Resource;
use App\Models\StudentAnswer;
use App\Models\StudentExamAttempt;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait SerializesTeachifyApiData
{
    protected function paginated(LengthAwarePaginator $paginator, callable $transformer): array
    {
        return [
            'count' => $paginator->total(),
            'next' => $paginator->nextPageUrl(),
            'previous' => $paginator->previousPageUrl(),
            'results' => collect($paginator->items())->map($transformer)->values(),
        ];
    }

    protected function absoluteUrl(?string $path, ?Request $request = null): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, '/')) {
            return $request ? $request->getSchemeAndHttpHost().$path : $path;
        }

        $url = Storage::disk('public')->url($path);

        return $request ? $request->getSchemeAndHttpHost().$url : $url;
    }

    protected function userData(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'phone_number' => $user->phone_number,
            'avatar' => $user->avatar,
            'is_verified' => (bool) $user->is_verified,
            'instructor_verified' => (bool) $user->instructor_verified,
        ];
    }

    protected function categoryData(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
        ];
    }

    protected function lessonData(Lesson $lesson): array
    {
        $videoSource = $lesson->video_source ?: 'drive';
        $videoUrl = $videoSource === 'upload'
            ? $this->absoluteUrl($lesson->video_path)
            : $lesson->video_url;

        return [
            'id' => $lesson->id,
            'course' => $lesson->course_id,
            'title' => $lesson->title,
            'description' => $lesson->description,
            'video_source' => $videoSource,
            'video_url' => $videoUrl,
            'video_embed_url' => $this->lessonEmbedUrl($videoSource, $lesson->video_url),
            'duration_minutes' => (int) $lesson->duration_minutes,
            'order' => (int) $lesson->order,
        ];
    }

    private function lessonEmbedUrl(string $videoSource, ?string $videoUrl): ?string
    {
        if (! $videoUrl) {
            return null;
        }

        return match ($videoSource) {
            'youtube' => $this->normalizeYoutubeEmbedUrl($videoUrl),
            'drive' => $this->normalizeDriveEmbedUrl($videoUrl),
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

    protected function resourceData(Resource $resource, ?Request $request = null): array
    {
        return [
            'id' => $resource->id,
            'course' => $resource->course_id,
            'title' => $resource->title,
            'file' => $resource->file,
            'file_url' => $this->absoluteUrl($resource->file, $request),
            'created_at' => optional($resource->created_at)?->toISOString(),
        ];
    }

    protected function courseData(Course $course, ?Request $request = null): array
    {
        $user = $request?->user();

        return [
            'id' => $course->id,
            'instructor' => $course->instructor_id,
            'title' => $course->title,
            'description' => $course->description,
            'category' => $course->category_id,
            'category_details' => $course->category ? $this->categoryData($course->category) : null,
            'price' => (float) $course->price,
            'thumbnail' => $this->absoluteUrl($course->thumbnail, $request),
            'thumbnail_url' => $this->absoluteUrl($course->thumbnail, $request),
            'total_duration_minutes' => (int) $course->total_duration_minutes,
            'created_at' => optional($course->created_at)?->toISOString(),
            'lessons' => $course->lessons->sortBy('order')->values()->map(fn (Lesson $lesson) => $this->lessonData($lesson)),
            'resources' => $course->resources->map(fn (Resource $resource) => $this->resourceData($resource, $request))->values(),
            'is_enrolled' => $user ? $course->enrollments->contains('student_id', $user->id) : false,
            'status' => 'published',
        ];
    }

    protected function enrollmentData(Enrollment $enrollment): array
    {
        return [
            'id' => $enrollment->id,
            'student' => $enrollment->student_id,
            'student_email' => $enrollment->student?->email,
            'course' => $enrollment->course_id,
            'course_title' => $enrollment->course?->title,
            'enrolled_at' => optional($enrollment->enrolled_at)?->toISOString(),
        ];
    }

    protected function progressData(LessonProgress $progress): array
    {
        return [
            'id' => $progress->id,
            'lesson' => $progress->lesson_id,
            'lesson_title' => $progress->lesson?->title,
            'lesson_duration' => (int) ($progress->lesson?->duration_minutes ?? 0),
            'student' => $progress->student_id,
            'is_completed' => (bool) $progress->is_completed,
            'completed_at' => optional($progress->completed_at)?->toISOString(),
            'progress_percent' => (int) $progress->progress_percent,
            'time_spent_minutes' => (int) $progress->time_spent_minutes,
        ];
    }

    protected function wishlistData(WishlistItem $item, ?Request $request = null): array
    {
        return [
            'id' => $item->id,
            'student' => $item->student_id,
            'course' => $item->course_id,
            'course_title' => $item->course?->title,
            'course_thumbnail' => $this->absoluteUrl($item->course?->thumbnail, $request),
            'course_price' => (float) ($item->course?->price ?? 0),
            'created_at' => optional($item->created_at)?->toISOString(),
        ];
    }

    protected function taskData(Task $task, ?Request $request = null): array
    {
        return [
            'id' => $task->id,
            'instructor' => $task->instructor_id,
            'instructor_name' => $task->instructor?->email,
            'course' => $task->course_id,
            'course_title' => $task->course?->title,
            'title' => $task->title,
            'description' => $task->description,
            'file' => $task->file,
            'file_url' => $this->absoluteUrl($task->file, $request),
            'priority' => $task->priority,
            'due_date' => optional($task->due_date)?->toISOString(),
            'created_at' => optional($task->created_at)?->toISOString(),
            'updated_at' => optional($task->updated_at)?->toISOString(),
            'submission_count' => $task->submissions->count(),
        ];
    }

    protected function taskSubmissionData(TaskSubmission $submission, ?Request $request = null): array
    {
        return [
            'id' => $submission->id,
            'task' => $submission->task_id,
            'task_title' => $submission->task?->title,
            'student' => $submission->student_id,
            'student_name' => $submission->student?->email,
            'student_username' => $submission->student?->username,
            'submission_file' => $submission->submission_file,
            'submission_file_url' => $this->absoluteUrl($submission->submission_file, $request),
            'submitted_at' => optional($submission->submitted_at)?->toISOString(),
            'score' => $submission->score === null ? null : (float) $submission->score,
            'feedback' => $submission->feedback,
            'status' => $submission->status,
            'graded_at' => optional($submission->graded_at)?->toISOString(),
        ];
    }

    protected function questionData(Question $question, bool $includeCorrect = false): array
    {
        $payload = [
            'id' => $question->id,
            'exam' => $question->exam_id,
            'question_text' => $question->question_text,
            'option_a' => $question->option_a,
            'option_b' => $question->option_b,
            'option_c' => $question->option_c,
            'option_d' => $question->option_d,
            'mark' => (int) $question->mark,
        ];

        if ($includeCorrect) {
            $payload['correct_option'] = $question->correct_option;
        }

        return $payload;
    }

    protected function examData(Exam $exam, ?Request $request = null, bool $includeQuestionAnswers = false): array
    {
        return [
            'id' => $exam->id,
            'course' => $exam->course_id,
            'title' => $exam->title,
            'description' => $exam->description,
            'time_limit' => $exam->time_limit,
            'total_marks' => (int) $exam->total_marks,
            'publish_date' => optional($exam->publish_date)?->toISOString(),
            'questions' => $exam->questions->map(fn (Question $question) => $this->questionData($question, $includeQuestionAnswers))->values(),
            'instructor_id' => $exam->course?->instructor_id,
            'question_count' => $exam->questions->count(),
            'course_title' => $exam->course?->title ?? '',
            'duration_minutes' => $exam->time_limit,
            'due_date' => optional($exam->publish_date)?->format('Y-m-d'),
        ];
    }

    protected function answerData(StudentAnswer $answer): array
    {
        return [
            'id' => $answer->id,
            'attempt' => $answer->attempt_id,
            'question' => $answer->question_id,
            'selected_option' => $answer->selected_option,
            'is_correct' => (bool) $answer->is_correct,
        ];
    }

    protected function attemptData(StudentExamAttempt $attempt): array
    {
        $totalScore = (int) $attempt->exam?->questions->sum('mark');

        return [
            'id' => $attempt->id,
            'exam' => $attempt->exam_id,
            'exam_title' => $attempt->exam?->title,
            'course_title' => $attempt->exam?->course?->title,
            'student' => $attempt->student_id,
            'score' => $attempt->score === null ? null : (float) $attempt->score,
            'total_score' => $totalScore,
            'taken_at' => optional($attempt->finished_at ?? $attempt->started_at)?->format('Y-m-d'),
            'started_at' => optional($attempt->started_at)?->toISOString(),
            'finished_at' => optional($attempt->finished_at)?->toISOString(),
            'is_passed' => (bool) $attempt->is_passed,
            'answers' => $attempt->answers->map(fn (StudentAnswer $answer) => $this->answerData($answer))->values(),
        ];
    }

    protected function certificateData(Certificate $certificate, ?Request $request = null): array
    {
        return [
            'id' => $certificate->id,
            'attempt_id' => $certificate->attempt_id,
            'attempt' => $certificate->attempt_id,
            'student' => $certificate->student_id,
            'student_name' => $certificate->student?->username,
            'exam' => $certificate->exam_id,
            'exam_title' => $certificate->exam?->title,
            'certificate_code' => $certificate->certificate_code,
            'verification_code' => $certificate->verification_code,
            'issued_at' => optional($certificate->issued_at)?->toISOString(),
            'image' => $this->absoluteUrl($certificate->image, $request),
        ];
    }

    protected function notificationData(Notification $notification): array
    {
        return [
            'id' => $notification->id,
            'user' => $notification->user_id,
            'user_name' => $notification->user?->username,
            'title' => $notification->title,
            'message' => $notification->message,
            'type' => $notification->type,
            'is_read' => (bool) $notification->is_read,
            'created_at' => optional($notification->created_at)?->toISOString(),
        ];
    }

    protected function certificateRequestData(CertificateRequest $requestRecord): array
    {
        return [
            'id' => $requestRecord->id,
            'student' => $requestRecord->student_id,
            'student_name' => $requestRecord->student?->username,
            'instructor' => $requestRecord->instructor_id,
            'instructor_name' => $requestRecord->instructor?->username,
            'course_title' => $requestRecord->course_title,
            'status' => $requestRecord->status,
            'created_at' => optional($requestRecord->created_at)?->toISOString(),
            'updated_at' => optional($requestRecord->updated_at)?->toISOString(),
        ];
    }
}
