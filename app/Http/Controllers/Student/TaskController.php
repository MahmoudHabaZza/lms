<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StoreStudentTaskSubmissionRequest;
use App\Models\Task;
use App\Services\Student\StudentCourseService;
use App\Services\Student\TaskSubmissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function __construct(
        private readonly StudentCourseService $courseService,
        private readonly TaskSubmissionService $taskSubmissionService,
    ) {
    }

    public function index(Request $request): Response
    {
        $student = $request->user();
        $courses = $this->courseService->enrolledCourses($student);
        $courseIds = $courses->pluck('id')->filter()->values();

        $tasks = Task::query()
            ->whereIn('course_id', $courseIds)
            ->with([
                'course:id,title',
                'submissions' => fn ($query) => $query->where('student_id', $student->id)->with('revisions'),
            ])
            ->orderBy('due_date')
            ->orderBy('id')
            ->get();

        return Inertia::render('Student/Tasks', [
            'tasksPage' => [
                'courses' => $courses
                    ->map(fn ($course) => [
                        'id' => $course->id,
                        'title' => $course->title,
                    ])
                    ->values()
                    ->all(),
                'tasks' => $tasks
                    ->map(fn (Task $task) => $this->courseService->taskPayload($task, $student))
                    ->all(),
            ],
        ]);
    }

    public function submit(StoreStudentTaskSubmissionRequest $request, Task $task): RedirectResponse
    {
        $this->taskSubmissionService->submit(
            $request->user(),
            $task,
            $request->file('file'),
            $request->string('submission_text')->toString(),
        );

        return back()->with('success', 'تم إرسال تسليم المهمة بنجاح.');
    }
}