<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Services\Student\StudentCourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResourceController extends Controller
{
    public function __construct(
        private readonly StudentCourseService $courseService,
    ) {
    }

    public function download(Request $request, Resource $resource): StreamedResponse|RedirectResponse
    {
        $resource->loadMissing('course', 'lesson.course');
        $course = $resource->lesson?->course ?? $resource->course;

        $this->courseService->ensureEnrolledInCourse($request->user(), $course);

        if (blank($resource->file)) {
            abort(404);
        }

        if (str_starts_with($resource->file, 'http://') || str_starts_with($resource->file, 'https://')) {
            return redirect()->away($resource->file);
        }

        abort_unless(Storage::disk('public')->exists($resource->file), 404);

        return Storage::disk('public')->download($resource->file, basename($resource->file));
    }
}
