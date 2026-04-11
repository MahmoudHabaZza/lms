<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureStudentRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('student.login');
        }

        if (! $user->isStudent()) {
            return $user->is_admin
                ? redirect()->route('admin.dashboard')
                : abort(403);
        }

        if (! $user->is_active) {
            abort(403, 'هذا الحساب غير مفعل.');
        }

        return $next($request);
    }
}
