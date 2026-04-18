<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function enroll(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user && $user->isStudent(), 403);
        abort_unless((bool) $course->status, 404);

        $alreadyEnrolled = Enrollment::query()
            ->where('student_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if ($alreadyEnrolled) {
            return back()->with('success', 'أنت مسجل بالفعل في هذا الكورس.');
        }

        Enrollment::query()->create([
            'student_id' => $user->id,
            'course_id' => $course->id,
            'enrolled_at' => now(),
        ]);

        return redirect()
            ->route('student.courses.show', $course)
            ->with('success', 'تم الاشتراك في الكورس بنجاح.');
    }
}
