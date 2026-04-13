<?php

namespace App\Support;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Support\Facades\Storage;

class EndUserCoursePresenter
{
    /**
     * @return array<string, mixed>
     */
    public function summary(Course $course, ?User $viewer = null): array
    {
        $course->loadMissing([
            'instructor:id,name,profile_picture,avatar',
            'category:id,name',
        ]);

        $isStudentViewer = $viewer && $viewer->isStudent();
        $isFavorited = $isStudentViewer
            ? $this->isFavoritedBy($course, $viewer)
            : false;

        return [
            'id' => $course->id,
            'title' => $course->title,
            'thumbnail' => $this->resolveMediaUrl($course->thumbnail),
            'short_description' => $course->short_description,
            'learning_outcome' => $course->learning_outcome,
            'duration_months' => (int) ($course->duration_months ?? 0),
            'sessions_count' => (int) ($course->sessions_count ?? 0),
            'sessions_per_week' => (int) ($course->sessions_per_week ?? 0),
            'badge' => $course->badge,
            'accent_color' => $course->accent_color ?: '#f97316',
            'show_url' => route('courses.show', $course),
            'booking_url' => route('bookings.index', ['course' => $course->id]),
            'is_favorited' => $isFavorited,
            'favorite_url' => $isStudentViewer ? route('student.courses.favorite', $course) : null,
        ];
    }

    /**
     * @param  iterable<Course>  $relatedCourses
     * @return array<string, mixed>
     */
    public function details(Course $course, iterable $relatedCourses = [], ?User $viewer = null): array
    {
        $course->loadMissing([
            'instructor:id,name,profile_picture,avatar',
            'category:id,name',
            'lessons' => fn ($query) => $query->orderBy('order')->orderBy('id'),
            'reviews:id,course_id,rating',
        ]);

        $ratingCount = $course->reviews->count();
        $ratingAverage = round((float) ($course->reviews->avg('rating') ?? 0), 1);
        $curriculumLessons = $course->lessons
            ->map(fn (Lesson $lesson): array => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'duration_minutes' => (int) ($lesson->duration_minutes ?? 0),
                'order' => (int) ($lesson->order ?? 0),
            ])
            ->values()
            ->all();

        return [
            ...$this->summary($course, $viewer),
            'description' => $course->description,
            'description_points' => $this->descriptionPoints($course),
            'category' => $course->category?->name,
            'instructor' => [
                'name' => $course->instructor?->name,
                'image' => $this->resolveMediaUrl($course->instructor?->profile_picture ?: $course->instructor?->avatar),
                'bio' => null,
            ],
            'level' => $this->inferLevel($course),
            'duration_label' => $this->durationLabel($course),
            'lessons_count' => $course->lessons->count(),
            'rating' => [
                'average' => $ratingAverage,
                'count' => $ratingCount,
            ],
            'pricing' => [
                'amount' => $course->price !== null ? (float) $course->price : null,
                'is_free' => (float) ($course->price ?? 0) <= 0,
                'label' => (float) ($course->price ?? 0) <= 0
                    ? 'مجاني'
                    : number_format((float) $course->price, 2).' ج.م',
            ],
            'what_you_will_learn' => $this->learningPoints($course),
            'requirements' => [],
            'target_audience' => array_values(array_filter([
                Course::unifiedAudienceLabel(),
                $course->category ? 'المهتمون بمسار '.$course->category->name : null,
            ])),
            'curriculum_sections' => [
                [
                    'id' => 'curriculum-'.$course->id,
                    'title' => 'محتوى الدورة',
                    'summary' => sprintf('%d درسًا مرتبة خطوة بخطوة', $course->lessons->count()),
                    'lessons' => $curriculumLessons,
                ],
            ],
            'cta' => [
                'label' => 'احجز الآن',
                'url' => route('bookings.index', ['course' => $course->id]),
            ],
            'related_courses' => collect($relatedCourses)
                ->map(fn (Course $relatedCourse): array => $this->summary($relatedCourse, $viewer))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<int, string>
     */
    private function learningPoints(Course $course): array
    {
        $source = trim((string) ($course->learning_outcome ?: ''));

        if ($source !== '') {
            $items = preg_split('/(?:\r\n|\r|\n|•|\\||،|;)+/u', $source) ?: [];

            $normalized = collect($items)
                ->map(fn ($item) => trim((string) $item, " \t\n\r\0\x0B-–—•"))
                ->filter()
                ->unique()
                ->values()
                ->all();

            if ($normalized !== []) {
                return $normalized;
            }
        }

        return $course->lessons
            ->take(6)
            ->pluck('title')
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return array<int, string>
     */
    private function descriptionPoints(Course $course): array
    {
        $source = trim((string) ($course->description ?: $course->short_description ?: ''));

        if ($source === '') {
            return [];
        }

        $items = preg_split('/(?:\r\n|\r|\n|•|-|\\.|،|؛|;|\\|)+/u', $source) ?: [];

        $normalized = collect($items)
            ->map(fn ($item) => trim((string) $item))
            ->filter(fn (string $item) => mb_strlen($item) >= 6)
            ->unique()
            ->take(6)
            ->values()
            ->all();

        if ($normalized !== []) {
            return $normalized;
        }

        return [trim($source)];
    }

    private function inferLevel(Course $course): ?string
    {
        $candidates = [
            $course->badge,
            $course->title,
            $course->short_description,
        ];

        foreach ($candidates as $candidate) {
            $value = mb_strtolower((string) $candidate);

            if (str_contains($value, 'beginner') || str_contains($value, 'مبتد')) {
                return 'Beginner';
            }

            if (str_contains($value, 'intermediate') || str_contains($value, 'متوسط')) {
                return 'Intermediate';
            }

            if (str_contains($value, 'advanced') || str_contains($value, 'متقدم')) {
                return 'Advanced';
            }
        }

        return null;
    }

    private function durationLabel(Course $course): string
    {
        $minutes = (int) ($course->total_duration_minutes ?: $course->lessons()->sum('duration_minutes'));

        if ($minutes > 0) {
            $hours = intdiv($minutes, 60);
            $remainingMinutes = $minutes % 60;

            if ($hours > 0 && $remainingMinutes > 0) {
                return sprintf('%d ساعة و%d دقيقة', $hours, $remainingMinutes);
            }

            if ($hours > 0) {
                return sprintf('%d ساعة', $hours);
            }

            return sprintf('%d دقيقة', $remainingMinutes);
        }

        if ((int) ($course->duration_months ?? 0) > 0) {
            return sprintf('%d شهر', (int) $course->duration_months);
        }

        return 'المدة تحدد لاحقًا';
    }

    private function resolveMediaUrl(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
            return $value;
        }

        return Storage::disk('public')->url($value);
    }

    private function isFavoritedBy(Course $course, User $viewer): bool
    {
        if ($course->relationLoaded('wishlistItems')) {
            return $course->wishlistItems
                ->contains(fn ($item) => (int) $item->student_id === (int) $viewer->id);
        }

        return WishlistItem::query()
            ->where('student_id', $viewer->id)
            ->where('course_id', $course->id)
            ->exists();
    }
}
