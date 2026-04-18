<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DashboardRedirectController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        if ($request->user()?->is_admin) {
            return to_route('admin.dashboard');
        }

        return to_route('student.dashboard');
    }
}
