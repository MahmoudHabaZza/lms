<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->get(['id', 'title', 'short_description', 'thumbnail', 'drive_link']);

        return response()->json($courses);
    }

    public function show($id)
    {
        $course = Course::query()->findOrFail($id);

        return response()->json($course);
    }
}
