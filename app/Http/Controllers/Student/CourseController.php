<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\Student\StudentCourseService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        private readonly StudentCourseService $courseService,
    ) {
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Student/Courses', [
            'coursesPage' => $this->courseService->coursesDirectoryPayload($request->user()),
        ]);
    }

    public function show(Request $request, Course $course): Response
    {
        return Inertia::render('Student/CourseDetails', [
            'course' => $this->courseService->courseShowPayload($request->user(), $course),
        ]);
    }
}
