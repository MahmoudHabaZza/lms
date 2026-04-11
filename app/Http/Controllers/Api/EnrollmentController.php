<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function enroll(Request $request, $id)
    {
        $user = $request->user();

        $course = Course::query()->findOrFail($id);

        $exists = Enrollment::query()
            ->where('student_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already enrolled'], 409);
        }

        Enrollment::query()->create([
            'student_id' => $user->id,
            'course_id' => $course->id,
            'enrolled_at' => now(),
        ]);

        return response()->json(['message' => 'Enrolled successfully']);
    }

    public function myEnrollments(Request $request)
    {
        $user = $request->user();

        $courses = Course::query()
            ->join('enrollments', 'courses.id', '=', 'enrollments.course_id')
            ->where('enrollments.student_id', $user->id)
            ->get(['courses.*', 'enrollments.enrolled_at']);

        return response()->json($courses);
    }
}
