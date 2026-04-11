<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\WishlistItem;
use App\Services\Student\StudentCourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function __construct(
        private readonly StudentCourseService $courseService,
    ) {
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Student/Favorites', [
            'favorites' => $this->courseService->favoriteCoursesPayload($request->user()),
        ]);
    }

    public function toggle(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();

        $favorite = WishlistItem::query()
            ->where('student_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($favorite) {
            $favorite->delete();

            return back()->with('success', 'تمت إزالة الكورس من المفضلة.');
        }

        WishlistItem::query()->create([
            'student_id' => $user->id,
            'course_id' => $course->id,
        ]);

        return back()->with('success', 'تمت إضافة الكورس إلى المفضلة.');
    }
}
