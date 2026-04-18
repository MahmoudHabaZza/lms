<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $this->ensureWebsiteContentSettings();

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

            $settings = Setting::query()
                ->whereIn('key', collect($validated['settings'])->pluck('key'))
                ->get()
                ->keyBy('key');

            foreach ($validated['settings'] as $settingData) {
                $setting = $settings->get($settingData['key']);

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

        if (in_array($key, ['admin_email', 'booking_notification_email', 'contact_notification_email', 'contact_email', 'mail_username', 'mail_from_address'], true) && $value !== '') {
            validator(['value' => $value], ['value' => ['email']])->validate();
        }

        if (in_array($key, ['facebook_url', 'instagram_url', 'linkedin_url', 'youtube_url'], true) && $value !== '') {
            validator(['value' => $value], ['value' => ['url']])->validate();
        }

        if ($key === 'whatsapp_number' && $value !== '') {
            validator(['value' => $value], ['value' => ['regex:/^[0-9+\s().-]{8,20}$/']])->validate();
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

        if ($key === 'primary_color' && $value !== '') {
            validator(['value' => $value], ['value' => ['regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/']])->validate();
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

            $existingLogo = Setting::get('site_logo');
            if (is_string($existingLogo) && str_starts_with($existingLogo, '/storage/')) {
                $existingRelativePath = ltrim(substr($existingLogo, strlen('/storage/')), '/');

                if ($existingRelativePath !== '') {
                    Storage::disk('public')->delete($existingRelativePath);
                }
            }

            $filename = 'logo_'.time().'.'.$file->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('logos', $file, $filename);
            $path = Storage::disk('public')->url('logos/'.$filename);

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

    /**
     * Create any missing website-content settings so they appear in admin settings.
     */
    protected function ensureWebsiteContentSettings(): void
    {
        $defaults = [
            'navbar_login_label' => ['value' => 'تسجيل الدخول', 'type' => 'string', 'group' => 'general'],
            'navbar_book_now_label' => ['value' => 'احجز الآن', 'type' => 'string', 'group' => 'general'],
            'navbar_menu_home_label' => ['value' => 'الصفحة الرئيسية', 'type' => 'string', 'group' => 'general'],
            'navbar_menu_join_label' => ['value' => 'انضم لنا', 'type' => 'string', 'group' => 'general'],
            'navbar_menu_favorites_label' => ['value' => 'المفضلة', 'type' => 'string', 'group' => 'general'],
            'navbar_menu_contact_label' => ['value' => 'تواصل معنا', 'type' => 'string', 'group' => 'general'],
            'navbar_menu_privacy_label' => ['value' => 'سياسة الخصوصية', 'type' => 'string', 'group' => 'general'],
            'navbar_search_placeholder' => ['value' => 'ابحث...', 'type' => 'string', 'group' => 'general'],
            'navbar_search_button_label' => ['value' => 'بحث', 'type' => 'string', 'group' => 'general'],
            'footer_quick_links_title' => ['value' => 'روابط سريعة', 'type' => 'string', 'group' => 'general'],
            'footer_help_links_title' => ['value' => 'المساعدة', 'type' => 'string', 'group' => 'general'],
            'footer_stay_connected_title' => ['value' => 'ابق على تواصل', 'type' => 'string', 'group' => 'general'],
            'footer_link_home_label' => ['value' => 'الرئيسية', 'type' => 'string', 'group' => 'general'],
            'footer_link_privacy_label' => ['value' => 'سياسة الخصوصية', 'type' => 'string', 'group' => 'general'],
            'footer_link_bookings_label' => ['value' => 'احجز الآن', 'type' => 'string', 'group' => 'general'],
            'footer_link_join_us_label' => ['value' => 'انضم لنا', 'type' => 'string', 'group' => 'general'],
            'footer_link_contact_label' => ['value' => 'تواصل معنا', 'type' => 'string', 'group' => 'general'],
            'footer_help_student_login_label' => ['value' => 'دخول الطالب', 'type' => 'string', 'group' => 'general'],
            'footer_help_admin_login_label' => ['value' => 'دخول الإدارة', 'type' => 'string', 'group' => 'general'],
            'footer_help_support_label' => ['value' => 'الدعم الفني', 'type' => 'string', 'group' => 'general'],
            'home_journey_title' => ['value' => 'رحلة في عالم كيد كودر', 'type' => 'string', 'group' => 'general'],
            'home_journey_subtitle' => ['value' => 'تجربة تعليمية عملية بتصميم متابعة ذكي وممتع', 'type' => 'string', 'group' => 'general'],
            'home_top_students_title' => ['value' => 'طلابنا المتفوقين', 'type' => 'string', 'group' => 'general'],
            'home_top_students_subtitle' => ['value' => 'لقطات حقيقية من طلابنا المتميزين أثناء استلام الشهادات والاحتفاء بإنجازاتهم داخل الأكاديمية.', 'type' => 'text', 'group' => 'general'],
            'home_top_students_empty_text' => ['value' => 'لا توجد صور طلاب متفوقين مفعلة حاليًا.', 'type' => 'string', 'group' => 'general'],
            'privacy_policy_badge' => ['value' => 'نحن نهتم بخصوصيتك', 'type' => 'string', 'group' => 'general'],
            'privacy_policy_title' => ['value' => 'سياسة الخصوصية', 'type' => 'string', 'group' => 'general'],
            'privacy_policy_subtitle' => ['value' => 'تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية عند استخدامك لمنصتنا.', 'type' => 'string', 'group' => 'general'],
            'privacy_policy_content' => ['value' => '', 'type' => 'text', 'group' => 'general'],
            'home_feedback_gallery_title' => ['value' => 'كلمات نفتخر بها', 'type' => 'string', 'group' => 'general'],
            'home_feedback_gallery_subtitle' => ['value' => 'لقطات حقيقية من آراء أولياء الأمور والطلاب عن تجربتهم داخل الأكاديمية.', 'type' => 'text', 'group' => 'general'],
            'home_feedback_gallery_empty_text' => ['value' => 'لا توجد صور آراء مفعلة حاليًا.', 'type' => 'string', 'group' => 'general'],
            'home_faq_title' => ['value' => 'الأسئلة الشائعة', 'type' => 'string', 'group' => 'general'],
            'home_faq_subtitle' => ['value' => 'كل إجابة بصياغة واضحة وسريعة تساعدك في اتخاذ القرار.', 'type' => 'string', 'group' => 'general'],
            'home_faq_empty_text' => ['value' => 'لا توجد أسئلة شائعة مفعلة حاليًا.', 'type' => 'string', 'group' => 'general'],
            'home_faq_video_unavailable_text' => ['value' => 'فيديو الإجابة غير متاح حاليًا.', 'type' => 'string', 'group' => 'general'],
            'home_hero_fallback_title' => ['value' => 'أضف أول سلايد من لوحة التحكم', 'type' => 'string', 'group' => 'general'],
            'home_hero_fallback_subtitle' => ['value' => 'ادخل على Admin > Banner Slides', 'type' => 'string', 'group' => 'general'],
            'home_hero_fallback_description' => ['value' => 'تقدر تتحكم في العنوان والوصف والرابط بسهولة من لوحة الإدارة.', 'type' => 'text', 'group' => 'general'],
            'home_hero_cta_label' => ['value' => 'احجز الآن', 'type' => 'string', 'group' => 'general'],
            'course_card_default_audience_label' => ['value' => 'من 5 إلى 17 سنة', 'type' => 'string', 'group' => 'general'],
            'course_card_no_image_text' => ['value' => 'لا توجد صورة', 'type' => 'string', 'group' => 'general'],
            'course_card_show_details_label' => ['value' => 'عرض التفاصيل', 'type' => 'string', 'group' => 'general'],
            'course_details_cta_label' => ['value' => 'احجز مقعدك الآن', 'type' => 'string', 'group' => 'general'],
            'course_details_about_title' => ['value' => '📖 عن الكورس', 'type' => 'string', 'group' => 'general'],
            'course_details_learn_title' => ['value' => '🎯 ماذا سيتعلم طفلك؟', 'type' => 'string', 'group' => 'general'],
            'course_details_audience_title' => ['value' => '👨‍👩‍👧‍👦 الكورس ده مناسب لمين؟', 'type' => 'string', 'group' => 'general'],
            'course_details_content_title' => ['value' => '📚 محتوى الكورس', 'type' => 'string', 'group' => 'general'],
            'course_details_banner_title' => ['value' => 'جاهز تبدأ رحلة التعلم؟', 'type' => 'string', 'group' => 'general'],
            'course_details_banner_description' => ['value' => 'سجّل ابنك اليوم وابدأ رحلة تعليم البرمجة بأسلوب ممتع وتفاعلي يساعده يكتسب مهارات المستقبل خطوة بخطوة.', 'type' => 'text', 'group' => 'general'],
            'course_details_related_title' => ['value' => '🌟 كورسات تانية ممكن تعجبك', 'type' => 'string', 'group' => 'general'],
            'favorites_title' => ['value' => 'كورساتي المفضلة', 'type' => 'string', 'group' => 'general'],
            'favorites_subtitle' => ['value' => 'كل الكورسات اللي ضفتها بالقلب هتظهر هنا علشان ترجع لها بسرعة.', 'type' => 'text', 'group' => 'general'],
            'favorites_empty_text' => ['value' => 'لا توجد كورسات في المفضلة حاليًا. اضغط على أيقونة القلب من صفحة الكورسات لإضافة ما يعجبك.', 'type' => 'text', 'group' => 'general'],
            'contact_page_badge' => ['value' => 'نحب نسمع منك', 'type' => 'string', 'group' => 'general'],
            'contact_page_title' => ['value' => 'تواصل معنا', 'type' => 'string', 'group' => 'general'],
            'contact_page_subtitle' => ['value' => 'عندك سؤال أو استفسار؟ ابعتلنا رسالة وهنرد عليك بأسرع وقت.', 'type' => 'text', 'group' => 'general'],
            'contact_form_title' => ['value' => 'ابعتلنا رسالتك', 'type' => 'string', 'group' => 'general'],
            'join_us_badge' => ['value' => 'فرصة للانضمام إلى فريقنا', 'type' => 'string', 'group' => 'general'],
            'join_us_title' => ['value' => 'انضم لنا وشارك الأطفال رحلة تعلم البرمجة', 'type' => 'text', 'group' => 'general'],
            'join_us_subtitle' => ['value' => 'إذا كنت تمتلك شغف التعليم وصناعة تجربة عربية ممتعة للأطفال، يمكنك إرسال طلبك الآن وسنراجع بياناتك بعناية.', 'type' => 'text', 'group' => 'general'],
            'join_us_form_title' => ['value' => 'أرسل طلب الانضمام', 'type' => 'string', 'group' => 'general'],
            'bookings_page_title' => ['value' => 'تعلم مع المرح', 'type' => 'string', 'group' => 'general'],
            'bookings_page_subtitle' => ['value' => 'ابدأ رحلة طفلك في البرمجة مع تجربة تعليمية ممتعة، آمنة، ومصممة بعناية للطفل العربي.', 'type' => 'text', 'group' => 'general'],
            'bookings_submit_button_label' => ['value' => 'إرسال طلب الحجز', 'type' => 'string', 'group' => 'general'],
            'booking_success_title' => ['value' => 'تم إرسال طلب الحجز بنجاح', 'type' => 'string', 'group' => 'general'],
            'booking_success_description' => ['value' => 'شكرًا لك! تم استلام طلبك وسيقوم فريقنا بالتواصل معك قريبًا لتأكيد البيانات.', 'type' => 'text', 'group' => 'general'],
            'booking_success_home_button' => ['value' => 'العودة للرئيسية', 'type' => 'string', 'group' => 'general'],
        ];

        $existingKeys = Setting::query()
            ->whereIn('key', array_keys($defaults))
            ->pluck('key')
            ->all();

        $missing = array_diff_key($defaults, array_flip($existingKeys));

        if ($missing === []) {
            return;
        }

        $timestamp = now();

        Setting::query()->insert(
            collect($missing)
                ->map(fn (array $setting, string $key) => [
                    'key' => $key,
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'group' => $setting['group'],
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ])
                ->values()
                ->all()
        );

        if (! empty($missing)) {
            Setting::clearCache();
        }
    }
}
