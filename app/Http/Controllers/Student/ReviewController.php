<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StoreStudentCourseReviewRequest;
use App\Models\Course;
use App\Models\Review;
use App\Services\Student\StudentCourseService;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function __construct(
        private readonly StudentCourseService $courseService,
    ) {
    }

    public function store(StoreStudentCourseReviewRequest $request, Course $course): RedirectResponse
    {
        $this->courseService->ensureEnrolledInCourse($request->user(), $course);

        Review::query()->updateOrCreate(
            [
                'course_id' => $course->id,
                'student_id' => $request->user()->id,
            ],
            $request->validated(),
        );

        return back()->with('success', 'تم حفظ تقييمك للكورس بنجاح.');
    }
}
