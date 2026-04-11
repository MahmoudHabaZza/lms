<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EnsureHasPermission
{
    /**
     * Handle an incoming request.
     * Usage: ->middleware('has_permission:manage-lessons')
     */
    public function handle(Request $request, Closure $next, string $permission)
    {
        $user = $request->user();
        if (! $user) {
            abort(403);
        }

        // Admin and superuser accounts should not be blocked by granular panel permissions.
        if (($user->is_admin ?? false) || ($user->is_superuser ?? false)) {
            return $next($request);
        }

        if (Gate::allows('permission', $permission)) {
            return $next($request);
        }

        abort(403);
    }
}
