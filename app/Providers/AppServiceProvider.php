<?php

namespace App\Providers;

use App\Models\Setting;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginViewResponse;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureMailSettings();

        app()->singleton(LoginViewResponse::class, function () {
            return new class implements LoginViewResponse
            {
                public function toResponse($request)
                {
                    return Inertia::render('auth/login', [
                        'canResetPassword' => false,
                        'canRegister' => false,
                        'status' => session('status'),
                    ])->toResponse($request);
                }
            };
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        // Prevent performance issues (N+1) by disabling lazy loading during development
        Model::preventLazyLoading(! app()->isProduction());

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function configureMailSettings(): void
    {
        // Avoid making database queries on CLI (unless running workers) or if it's not installed yet
        if (app()->runningInConsole() && !app()->runningUnitTests()) {
            return;
        }

        try {
            if (!app()->isProduction() && !Schema::hasTable('settings')) {
                return;
            }
        } catch (\Throwable $e) {
            return;
        }

        $settings = Setting::subset([
            'mail_mailer',
            'mail_host',
            'mail_port',
            'mail_username',
            'mail_password',
            'mail_encryption',
            'mail_from_address',
            'mail_from_name',
        ]);

        if ($settings->isEmpty()) {
            return;
        }

        $mailer = $settings->get('mail_mailer') ?: 'smtp';
        $encryption = $settings->get('mail_encryption');
        $encryption = $encryption === '' ? null : $encryption;

        Config::set('mail.default', $mailer);
        Config::set("mail.mailers.{$mailer}.host", $settings->get('mail_host'));
        Config::set("mail.mailers.{$mailer}.port", (int) ($settings->get('mail_port') ?: 587));
        Config::set("mail.mailers.{$mailer}.username", $settings->get('mail_username'));
        Config::set("mail.mailers.{$mailer}.password", $settings->get('mail_password'));
        Config::set("mail.mailers.{$mailer}.encryption", $encryption);
        Config::set('mail.from.address', $settings->get('mail_from_address'));
        Config::set('mail.from.name', $settings->get('mail_from_name'));
    }
}
