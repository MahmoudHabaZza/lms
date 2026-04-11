<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class ProgrammingCourseController extends Controller
{
    public function index(): RedirectResponse
    {
        return to_route('admin.courses.index');
    }

    public function create(): RedirectResponse
    {
        return to_route('admin.courses.create');
    }

    public function edit(int $programmingCourse): RedirectResponse
    {
        return to_route('admin.courses.edit', $programmingCourse);
    }
}
