<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Concerns\AuthorizesTeachifyRoles;
use App\Http\Controllers\Api\Concerns\SerializesTeachifyApiData;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    use AuthorizesTeachifyRoles;
    use SerializesTeachifyApiData;

    public function enroll(Request $request, $id)
    {
        $user = $request->user();
        if ($response = $this->requireStudent($user)) {
            return $response;
        }

        $course = Course::query()->where('status', true)->findOrFail($id);

        $enrollment = Enrollment::query()->firstOrCreate(
            [
                'student_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'enrolled_at' => now(),
            ]
        );

        if (! $enrollment->wasRecentlyCreated) {
            return response()->json(['message' => 'Already enrolled'], 409);
        }

        return response()->json([
            'message' => 'Enrolled successfully',
            'enrollment' => $this->enrollmentData($enrollment->loadMissing('course')),
        ], 201);
    }

    public function myEnrollments(Request $request)
    {
        $user = $request->user();
        if ($response = $this->requireStudent($user)) {
            return $response;
        }

        $enrollments = Enrollment::query()
            ->with('course:id,title,thumbnail,short_description')
            ->where('student_id', $user->id)
            ->latest('enrolled_at')
            ->get();

        return response()->json(
            $enrollments->map(fn (Enrollment $enrollment) => [
                ...$this->enrollmentData($enrollment),
                'course_thumbnail_url' => $this->absoluteUrl($enrollment->course?->thumbnail, $request),
                'course_description' => $enrollment->course?->short_description,
            ])->values()
        );
    }
}
