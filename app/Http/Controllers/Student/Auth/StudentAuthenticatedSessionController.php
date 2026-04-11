<?php

namespace App\Http\Controllers\Student\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter as RateLimiterFacade;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentAuthenticatedSessionController extends Controller
{
    private int $maxLoginAttempts = 5;

    private int $decayMinutes = 1;

    public function username(): string
    {
        return 'login';
    }

    public function create(): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => false,
            'canRegister' => false,
            'status' => session('status'),
            'title' => 'تسجيل دخول الطالب',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $key = $this->throttleKey($request);

        if (RateLimiterFacade::tooManyAttempts($key, $this->maxLoginAttempts)) {
            $seconds = RateLimiterFacade::availableIn($key);

            throw ValidationException::withMessages([
                'login' => __('auth.throttle', ['seconds' => $seconds]),
            ]);
        }

        $authenticated = false;

        foreach ($this->credentials((string) $request->input('login'), (string) $request->input('password')) as $credentials) {
            if (Auth::guard('web')->attempt($credentials, (bool) $request->boolean('remember'))) {
                $authenticated = true;
                break;
            }
        }

        if (! $authenticated) {
            RateLimiterFacade::hit($key, $this->decayMinutes * 60);

            throw ValidationException::withMessages([
                'login' => 'بيانات الدخول غير صحيحة أو الحساب غير مفعّل للطالب.',
            ]);
        }

        RateLimiterFacade::clear($key);
        $request->session()->regenerate();

        return redirect()->intended(route('student.dashboard'));
    }

    private function throttleKey(Request $request): string
    {
        return strtolower((string) $request->input('login')).'|'.$request->ip();
    }

    private function credentials(string $login, string $password): array
    {
        $base = [
            'password' => $password,
            'role' => 'student',
            'is_active' => true,
        ];

        $credentials = [
            array_merge($base, ['username' => $login]),
        ];

        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            array_unshift($credentials, array_merge($base, ['email' => $login]));
        }

        return $credentials;
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('student.login');
    }
}
