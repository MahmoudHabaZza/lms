<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $settings = Setting::values();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'phone_number' => $user->phone_number,
                    'profile_picture' => $user->profile_picture,
                    'created_at' => $user->created_at?->toIso8601String(),
                    'role' => $user->role,
                    'is_admin' => (bool) $user->is_admin,
                    'is_active' => (bool) $user->is_active,
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'settings' => $settings,
            'social_links' => $this->socialLinks($settings),
            'app' => [
                'locale' => app()->getLocale(),
                'direction' => 'rtl',
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'student_meta' => fn () => $user && $user->isStudent()
                ? [
                    'unread_notifications_count' => Notification::query()
                        ->where('user_id', $user->id)
                        ->where('is_read', false)
                        ->count(),
                ]
                : null,
        ];
    }

    /**
     * @param  array<string, string|null>  $settings
     * @return array<int, array{platform: string, url: string}>
     */
    private function socialLinks(array $settings): array
    {
        $whatsappNumber = preg_replace('/[^0-9]/', '', (string) ($settings['whatsapp_number'] ?? ''));

        return array_values(array_filter([
            [
                'platform' => 'facebook',
                'url' => (string) ($settings['facebook_url'] ?? ''),
            ],
            [
                'platform' => 'youtube',
                'url' => (string) ($settings['youtube_url'] ?? ''),
            ],
            [
                'platform' => 'instagram',
                'url' => (string) ($settings['instagram_url'] ?? ''),
            ],
            [
                'platform' => 'linkedin',
                'url' => (string) ($settings['linkedin_url'] ?? ''),
            ],
            [
                'platform' => 'whatsapp',
                'url' => $whatsappNumber !== '' ? "https://wa.me/{$whatsappNumber}" : '',
            ],
        ], fn (array $link): bool => $link['url'] !== ''));
    }
}
