<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/settings/Index', [
            'settings' => Setting::grouped(),
        ]);
    }

    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'settings' => 'required|array',
                'settings.*.key' => 'required|string',
                'settings.*.value' => 'nullable|string',
            ]);

            foreach ($validated['settings'] as $settingData) {
                $setting = Setting::query()->where('key', $settingData['key'])->first();

                if (! $setting) {
                    continue;
                }

                $this->validateSettingValue($settingData['key'], $settingData['value']);

                $setting->update([
                    'value' => $settingData['value'],
                ]);
            }

            Setting::clearCache();

            return redirect()->back()->with('success', 'تم تحديث الإعدادات بنجاح');
        } catch (\Throwable $exception) {
            return redirect()->back()->withErrors([
                'error' => 'حدث خطأ أثناء تحديث الإعدادات: '.$exception->getMessage(),
            ]);
        }
    }

    public function testEmail(Request $request)
    {
        $validated = $request->validate([
            'to_email' => 'required|email',
        ]);

        $this->applyMailSettings();

        try {
            Mail::raw('This is a test email from Kids Programming Academy.', function ($message) use ($validated) {
                $message->to($validated['to_email'])
                    ->subject('SMTP Test Email');
            });

            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully.',
            ]);
        } catch (\Throwable $exception) {
            Log::error('Test email failed', ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email. Check SMTP settings.',
            ], 500);
        }
    }

    protected function applyMailSettings(): void
    {
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

    protected function validateSettingValue(string $key, ?string $value): void
    {
        $value = $value ?? '';

        if (in_array($key, ['admin_email', 'booking_notification_email', 'contact_notification_email', 'mail_username', 'mail_from_address'], true) && $value !== '') {
            validator(['value' => $value], ['value' => ['email']])->validate();
        }

        if ($key === 'mail_port' && $value !== '') {
            validator(['value' => $value], ['value' => ['integer', 'min:1', 'max:65535']])->validate();
        }

        if ($key === 'mail_mailer' && $value !== '') {
            validator(['value' => $value], ['value' => ['in:smtp,log,array,failover,roundrobin,ses,mailgun,postmark,resend,sendmail']])->validate();
        }

        if ($key === 'mail_encryption' && $value !== '') {
            validator(['value' => $value], ['value' => ['in:tls,ssl']])->validate();
        }

        if ($key === 'font_family' && $value !== '') {
            validator(['value' => $value], ['value' => ['in:playpen_arabic,marhey,fredoka,instrument_sans']])->validate();
        }
    }

    public function uploadLogo(Request $request)
    {
        try {
            $request->validate([
                'site_logo' => 'required|image|mimes:jpeg,png,gif,webp|max:5120',
            ]);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            Log::warning('Logo upload validation failed', ['errors' => $exception->errors()]);

            return response()->json([
                'success' => false,
                'message' => 'الملف يجب أن يكون صورة صحيحة (JPG, PNG, GIF, WebP) وحجمها أقل من 5MB',
            ], 422);
        }

        try {
            $file = $request->file('site_logo');

            if (! $file->isValid()) {
                return response()->json(['success' => false, 'message' => 'الملف غير صحيح'], 422);
            }

            $filename = 'logo_'.time().'.'.$file->getClientOriginalExtension();
            $destination = public_path('assets/EndUser/images');

            if (! file_exists($destination)) {
                mkdir($destination, 0755, true);
            }

            $file->move($destination, $filename);

            $path = '/assets/EndUser/images/'.$filename;

            Setting::updateOrCreate(
                ['key' => 'site_logo'],
                ['value' => $path, 'type' => 'string', 'group' => 'general']
            );

            Setting::clearCache();

            Log::info('Logo uploaded successfully', ['path' => $path]);

            return response()->json([
                'success' => true,
                'path' => $path,
                'message' => 'تم رفع الشعار بنجاح',
            ]);
        } catch (\Throwable $exception) {
            Log::error('Logo upload error: '.$exception->getMessage(), ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفع الملف: '.$exception->getMessage(),
            ], 500);
        }
    }
}
