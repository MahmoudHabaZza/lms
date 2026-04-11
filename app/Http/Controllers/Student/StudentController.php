<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard(Request $request)
    {
        return Inertia::render('Student/Dashboard');
    }

    public function profile(Request $request)
    {
        // Redirect to the edit page for a single canonical profile URL
        return redirect()->route('student.profile.edit');
    }

    public function courses(Request $request)
    {
        $user = $request->user();

        $courses = CourseEnrollment::with('course')
            ->where('user_id', $user->id)
            ->orderByDesc('enrolled_at')
            ->get()
            ->map(function (CourseEnrollment $enrollment): array {
                $course = $enrollment->course;

                $thumbnail = null;
                if (! empty($course?->thumbnail)) {
                    $thumbnail = str_starts_with($course->thumbnail, 'http')
                        ? $course->thumbnail
                        : Storage::disk('public')->url($course->thumbnail);
                }

                return [
                    'id' => $course?->id,
                    'title' => $course?->title,
                    'short_description' => $course?->short_description,
                    'drive_link' => $course?->drive_link,
                    'thumbnail' => $thumbnail,
                    'age_group' => $course?->age_group,
                    'badge' => $course?->badge,
                    'accent_color' => $course?->accent_color,
                    'enrolled_at' => $enrollment->enrolled_at?->format('Y-m-d'),
                ];
            })
            ->values();

        return Inertia::render('Student/Courses', [
            'courses' => $courses,
        ]);
    }
}
