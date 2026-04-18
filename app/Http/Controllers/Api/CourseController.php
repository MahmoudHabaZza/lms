<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Concerns\SerializesTeachifyApiData;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    use SerializesTeachifyApiData;

    public function index(Request $request)
    {
        $courses = Course::query()
            ->with('category:id,name,slug')
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'title', 'short_description', 'thumbnail', 'drive_link', 'category_id']);

        return response()->json(
            $courses->map(fn (Course $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'short_description' => $course->short_description,
                'thumbnail' => $course->thumbnail,
                'thumbnail_url' => $this->absoluteUrl($course->thumbnail, $request),
                'drive_link' => $course->drive_link,
                'category' => $course->category ? $this->categoryData($course->category) : null,
            ])->values()
        );
    }

    public function show(Request $request, $id)
    {
        $course = Course::query()
            ->with([
                'category:id,name,slug',
                'lessons:id,course_id,title,description,video_source,video_url,video_path,duration_minutes,order',
                'resources:id,course_id,title,file,created_at',
            ])
            ->where('status', true)
            ->findOrFail($id);

        return response()->json([
            'id' => $course->id,
            'title' => $course->title,
            'description' => $course->description,
            'short_description' => $course->short_description,
            'thumbnail' => $course->thumbnail,
            'thumbnail_url' => $this->absoluteUrl($course->thumbnail, $request),
            'drive_link' => $course->drive_link,
            'category' => $course->category ? $this->categoryData($course->category) : null,
            'lessons' => $course->lessons
                ->sortBy('order')
                ->values()
                ->map(fn ($lesson) => $this->lessonData($lesson))
                ->all(),
            'resources' => $course->resources
                ->map(fn ($resource) => $this->resourceData($resource, $request))
                ->values()
                ->all(),
        ]);
    }
}
