<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class CourseEnrollmentRedirectController extends Controller
{
    public function index(): RedirectResponse
    {
        return to_route('admin.enrollments.index');
    }

    public function create(): RedirectResponse
    {
        return to_route('admin.enrollments.create');
    }

    public function edit(string|int $courseEnrollment): RedirectResponse
    {
        return to_route('admin.enrollments.edit', $courseEnrollment);
    }
}
