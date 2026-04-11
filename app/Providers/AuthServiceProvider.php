<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Allow superusers to bypass checks
        Gate::before(function ($user, $ability) {
            if (isset($user->is_superuser) && $user->is_superuser) {
                return true;
            }
        });

        // Generic permission gate: check by permission slug
        Gate::define('permission', function ($user, $permission) {
            if (! $user) {
                return false;
            }

            return $user->hasPermission($permission) || ($user->is_admin ?? false);
        });
    }
}
