<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\Student\StudentDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly StudentDashboardService $dashboardService,
    ) {
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Student/Dashboard', [
            'dashboard' => $this->dashboardService->build($request->user()),
        ]);
    }
}
