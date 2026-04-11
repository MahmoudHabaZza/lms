<?php

namespace App\Http\Controllers\EndUser;

use App\Http\Controllers\Controller;
use App\Models\AcademySection;
use App\Models\BannerSlide;
use App\Models\Course;
use App\Models\CourseReel;
use App\Models\Faq;
use App\Models\StudentFeedbackImage;
use App\Models\StudentReel;
use App\Models\TopStudent;
use App\Support\EndUserCoursePresenter;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly EndUserCoursePresenter $coursePresenter,
    ) {
    }

    public function index(): Response
    {
        $slides = BannerSlide::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'title', 'sub_title', 'description', 'button_link', 'background_image'])
            ->map(function (BannerSlide $slide): array {
                return [
                    'id' => $slide->id,
                    'title' => $slide->title,
                    'sub_title' => $slide->sub_title,
                    'description' => $slide->description,
                    'button_link' => $slide->button_link,
                    'background_image' => $this->resolveMediaUrl($slide->background_image),
                ];
            });
        $academySection = AcademySection::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->first(['id', 'title', 'description']);
        $courses = Course::query()
            ->with([
                'instructor:id,name,profile_picture,avatar',
                'category:id,name',
            ])
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get([
                'id',
                'title',
                'thumbnail',
                'short_description',
                'learning_outcome',
                'duration_months',
                'sessions_count',
                'sessions_per_week',
                'badge',
                'accent_color',
                'category_id',
                'instructor_id',
            ])
            ->map(fn (Course $course): array => $this->coursePresenter->summary($course));
        $studentReels = StudentReel::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get([
                'id',
                'student_name',
                'student_title',
                'student_age',
                'cover_image',
                'video_path',
                'quote',
            ])
            ->map(function (StudentReel $reel): array {
                return [
                    'id' => $reel->id,
                    'student_name' => $reel->student_name,
                    'student_title' => $reel->student_title,
                    'student_age' => $reel->student_age,
                    'cover_image' => $this->resolveMediaUrl($reel->cover_image),
                    'video_source' => StudentReel::VIDEO_SOURCE_UPLOAD,
                    'video_url' => $this->resolveMediaUrl($reel->video_path),
                    'quote' => $reel->quote,
                ];
            });
        $studentFeedbackImages = StudentFeedbackImage::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'student_name', 'caption', 'image_path'])
            ->map(function (StudentFeedbackImage $feedbackImage): array {
                return [
                    'id' => $feedbackImage->id,
                    'student_name' => $feedbackImage->student_name,
                    'caption' => $feedbackImage->caption,
                    'image' => $this->resolveMediaUrl($feedbackImage->image_path),
                ];
            });
        $topStudents = TopStudent::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'student_name', 'achievement_title', 'image_path'])
            ->map(function (TopStudent $topStudent): array {
                return [
                    'id' => $topStudent->id,
                    'student_name' => $topStudent->student_name,
                    'achievement' => $topStudent->achievement_title,
                    'image' => $this->resolveMediaUrl($topStudent->image_path),
                ];
            });
        $faqs = Faq::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get([
                'id',
                'question',
                'answer_type',
                'answer_text',
                'video_url',
                'video_path',
                'video_cover_image',
            ])
            ->map(function (Faq $faq): array {
                return [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer_type' => $faq->answer_type,
                    'answer_text' => $faq->answer_text,
                    'video_url' => $faq->video_path ? $this->resolveMediaUrl($faq->video_path) : $faq->video_url,
                    'video_cover_image' => $this->resolveMediaUrl($faq->video_cover_image),
                ];
            });

        $instructorImages = [
            'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1603415526960-f64ac4af26ef?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=200&q=80',
        ];

        $courseReels = CourseReel::query()
            ->with('course')
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (CourseReel $reel) use ($instructorImages): array {
                $courseItem = $reel->course;

                return [
                    'id' => $reel->id,
                    'course_title' => $courseItem?->title ?? ($reel->title ?? 'Course Reel'),
                    'course_badge' => $courseItem?->badge ?? null,
                    'course_description' => $courseItem?->short_description ?? ($reel->description ?? ''),
                    'course_thumbnail' => $courseItem?->thumbnail ?? $reel->cover_image,
                    'course_accent_color' => $courseItem?->accent_color ?? '#2f80ed',
                    'reel_cover_image' => $reel->cover_image ?? ($courseItem?->thumbnail ?? null),
                    'reel_instructor_image' => $reel->cover_image
                        ? $reel->cover_image
                        : $instructorImages[$reel->id % count($instructorImages)],
                    'reel_title' => $reel->title ?? $courseItem?->title,
                    'reel_track' => Course::unifiedAudienceLabel(),
                    'video_url' => $reel->video_path ? $this->resolveMediaUrl($reel->video_path) : $reel->video_url,
                ];
            })
            ->values();

        if ($courseReels->isEmpty()) {
            $courseReels = collect($courses)
                ->map(function (array $course, int $index) use ($studentReels, $instructorImages): array {
                    $studentReel = $studentReels[$index] ?? null;

                    return [
                        'id' => $course['id'],
                        'course_title' => $course['title'],
                        'course_badge' => $course['badge'],
                        'course_description' => $course['short_description'],
                        'course_thumbnail' => $course['thumbnail'],
                        'course_accent_color' => $course['accent_color'],
                        'reel_cover_image' => $course['thumbnail'] ?? ($studentReel['cover_image'] ?? null),
                        'reel_instructor_image' => $course['thumbnail'] ? $course['thumbnail'] : $instructorImages[$index % count($instructorImages)],
                        'reel_title' => $course['title'],
                        'reel_track' => Course::unifiedAudienceLabel(),
                        'video_url' => $studentReel['video_url'] ?? null,
                    ];
                })
                ->values();
        }

        return Inertia::render('EndUser/Home/index', [
            'bannerSlides' => $slides,
            'academySection' => $academySection,
            'courses' => $courses,
            'studentReels' => $studentReels,
            'courseReels' => $courseReels,
            'topStudents' => $topStudents,
            'studentFeedbackImages' => $studentFeedbackImages,
            'faqs' => $faqs,
        ]);
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
}
