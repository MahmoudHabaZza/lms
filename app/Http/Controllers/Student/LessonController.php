<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\CompleteStudentLessonRequest;
use App\Models\Lesson;
use App\Services\Student\StudentCourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function __construct(
        private readonly StudentCourseService $courseService,
    ) {
    }

    public function show(Request $request, Lesson $lesson): Response
    {
        return Inertia::render('Student/LessonView', [
            'lessonPage' => $this->courseService->lessonShowPayload($request->user(), $lesson),
        ]);
    }

    public function complete(CompleteStudentLessonRequest $request, Lesson $lesson): RedirectResponse
    {
        $this->courseService->markLessonCompleted(
            $request->user(),
            $lesson,
            (int) $request->integer('time_spent_minutes')
        );

        return back()->with('success', 'تم تسجيل إكمال الدرس وتحديث التقدم بنجاح.');
    }
}
