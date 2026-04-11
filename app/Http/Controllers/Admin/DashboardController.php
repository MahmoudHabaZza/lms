<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademySection;
use App\Models\BannerSlide;
use App\Models\Course;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard/index', [
            'stats' => [
                'totalSlides' => BannerSlide::query()->count(),
                'activeSlides' => BannerSlide::query()->where('status', true)->count(),
                'totalAcademySections' => AcademySection::query()->count(),
                'activeAcademySections' => AcademySection::query()->where('status', true)->count(),
                'totalCourses' => Course::query()->count(),
                'activeCourses' => Course::query()->where('status', true)->count(),
                'admins' => User::query()->where('is_admin', true)->count(),
                'users' => User::query()->count(),
            ],
            'quickLinks' => [
                ['title' => 'إدارة شرائح الواجهة', 'href' => '/admin/banner-slides'],
                ['title' => 'إدارة أقسام الأكاديمية', 'href' => '/admin/academy-sections'],
                ['title' => 'إدارة الكورسات', 'href' => '/admin/courses'],
                ['title' => 'عرض الموقع', 'href' => '/'],
            ],
        ]);
    }
}
