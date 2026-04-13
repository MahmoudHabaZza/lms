<?php

namespace App\Http\Controllers\EndUser;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Support\EndUserCoursePresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function __construct(
        private readonly EndUserCoursePresenter $coursePresenter,
    ) {
    }

    public function index(Request $request): Response
    {
        $viewer = $request->user();
        abort_unless($viewer && $viewer->isStudent(), 403);

        $courses = Course::query()
            ->with([
                'instructor:id,name,profile_picture,avatar',
                'category:id,name',
                'wishlistItems' => fn ($query) => $query->where('student_id', $viewer->id),
            ])
            ->where('status', true)
            ->whereHas('wishlistItems', fn ($query) => $query->where('student_id', $viewer->id))
            ->orderBy('sort_order')
            ->orderBy('id')
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
            ])
            ->map(fn (Course $course): array => $this->coursePresenter->summary($course, $viewer))
            ->values()
            ->all();

        return Inertia::render('EndUser/Favorites', [
            'favorites' => $courses,
        ]);
    }
}
