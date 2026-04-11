<?php

namespace App\Http\Controllers\EndUser;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Support\EndUserCoursePresenter;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        private readonly EndUserCoursePresenter $coursePresenter,
    ) {
    }

    public function show(Course $course): Response
    {
        abort_unless((bool) $course->status, 404);

        $relatedCourses = Course::query()
            ->with([
                'instructor:id,name,profile_picture,avatar',
                'category:id,name',
            ])
            ->where('status', true)
            ->whereKeyNot($course->id)
            ->when(
                $course->category_id,
                fn ($query) => $query->where('category_id', $course->category_id),
                fn ($query) => $query->orderBy('sort_order')->orderBy('id')
            )
            ->orderBy('sort_order')
            ->orderBy('id')
            ->limit(4)
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
            ]);

        return Inertia::render('EndUser/CourseDetails', [
            'course' => $this->coursePresenter->details($course, $relatedCourses),
        ]);
    }
}
