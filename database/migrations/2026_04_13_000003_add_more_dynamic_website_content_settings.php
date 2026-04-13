<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $settings = [
            ['key' => 'navbar_login_label', 'value' => 'تسجيل الدخول', 'type' => 'string', 'group' => 'general'],
            ['key' => 'navbar_book_now_label', 'value' => 'احجز الآن', 'type' => 'string', 'group' => 'general'],
            ['key' => 'navbar_menu_home_label', 'value' => 'الصفحة الرئيسية', 'type' => 'string', 'group' => 'general'],
            ['key' => 'navbar_menu_join_label', 'value' => 'انضم لنا', 'type' => 'string', 'group' => 'general'],
            ['key' => 'navbar_menu_favorites_label', 'value' => 'المفضلة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'navbar_menu_contact_label', 'value' => 'تواصل معنا', 'type' => 'string', 'group' => 'general'],
            ['key' => 'navbar_menu_privacy_label', 'value' => 'سياسة الخصوصية', 'type' => 'string', 'group' => 'general'],
            ['key' => 'navbar_search_placeholder', 'value' => 'ابحث...', 'type' => 'string', 'group' => 'general'],
            ['key' => 'navbar_search_button_label', 'value' => 'بحث', 'type' => 'string', 'group' => 'general'],

            ['key' => 'footer_quick_links_title', 'value' => 'روابط سريعة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_help_links_title', 'value' => 'المساعدة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_stay_connected_title', 'value' => 'ابق على تواصل', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_link_home_label', 'value' => 'الرئيسية', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_link_privacy_label', 'value' => 'سياسة الخصوصية', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_link_bookings_label', 'value' => 'احجز الآن', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_link_join_us_label', 'value' => 'انضم لنا', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_link_contact_label', 'value' => 'تواصل معنا', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_help_student_login_label', 'value' => 'دخول الطالب', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_help_admin_login_label', 'value' => 'دخول الإدارة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_help_support_label', 'value' => 'الدعم الفني', 'type' => 'string', 'group' => 'general'],

            ['key' => 'home_journey_title', 'value' => 'رحلة في عالم كيد كودر', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_journey_subtitle', 'value' => 'تجربة تعليمية عملية بتصميم متابعة ذكي وممتع', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_top_students_title', 'value' => 'طلابنا المتفوقين', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_top_students_subtitle', 'value' => 'لقطات حقيقية من طلابنا المتميزين أثناء استلام الشهادات والاحتفاء بإنجازاتهم داخل الأكاديمية.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'home_top_students_empty_text', 'value' => 'لا توجد صور طلاب متفوقين مفعلة حاليًا.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_feedback_gallery_title', 'value' => 'كلمات نفتخر بها', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_feedback_gallery_subtitle', 'value' => 'لقطات حقيقية من آراء أولياء الأمور والطلاب عن تجربتهم داخل الأكاديمية.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'home_feedback_gallery_empty_text', 'value' => 'لا توجد صور آراء مفعلة حاليًا.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_faq_title', 'value' => 'الأسئلة الشائعة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_faq_subtitle', 'value' => 'كل إجابة بصياغة واضحة وسريعة تساعدك في اتخاذ القرار.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_faq_empty_text', 'value' => 'لا توجد أسئلة شائعة مفعلة حاليًا.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_faq_video_unavailable_text', 'value' => 'فيديو الإجابة غير متاح حاليًا.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_hero_fallback_title', 'value' => 'أضف أول سلايد من لوحة التحكم', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_hero_fallback_subtitle', 'value' => 'ادخل على Admin > Banner Slides', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_hero_fallback_description', 'value' => 'تقدر تتحكم في العنوان والوصف والرابط بسهولة من لوحة الإدارة.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'home_hero_cta_label', 'value' => 'احجز الآن', 'type' => 'string', 'group' => 'general'],

            ['key' => 'course_card_default_audience_label', 'value' => 'من 5 إلى 17 سنة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'course_card_no_image_text', 'value' => 'لا توجد صورة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'course_card_show_details_label', 'value' => 'عرض التفاصيل', 'type' => 'string', 'group' => 'general'],

            ['key' => 'course_details_cta_label', 'value' => 'احجز مقعدك الآن', 'type' => 'string', 'group' => 'general'],
            ['key' => 'course_details_about_title', 'value' => '📖 عن الكورس', 'type' => 'string', 'group' => 'general'],
            ['key' => 'course_details_learn_title', 'value' => '🎯 ماذا سيتعلم طفلك؟', 'type' => 'string', 'group' => 'general'],
            ['key' => 'course_details_audience_title', 'value' => '👨‍👩‍👧‍👦 الكورس ده مناسب لمين؟', 'type' => 'string', 'group' => 'general'],
            ['key' => 'course_details_content_title', 'value' => '📚 محتوى الكورس', 'type' => 'string', 'group' => 'general'],
            ['key' => 'course_details_banner_title', 'value' => 'جاهز تبدأ رحلة التعلم؟', 'type' => 'string', 'group' => 'general'],
            ['key' => 'course_details_banner_description', 'value' => 'سجّل ابنك اليوم وابدأ رحلة تعليم البرمجة بأسلوب ممتع وتفاعلي يساعده يكتسب مهارات المستقبل خطوة بخطوة.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'course_details_related_title', 'value' => '🌟 كورسات تانية ممكن تعجبك', 'type' => 'string', 'group' => 'general'],

            ['key' => 'favorites_title', 'value' => 'كورساتي المفضلة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'favorites_subtitle', 'value' => 'كل الكورسات اللي ضفتها بالقلب هتظهر هنا علشان ترجع لها بسرعة.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'favorites_empty_text', 'value' => 'لا توجد كورسات في المفضلة حاليًا. اضغط على أيقونة القلب من صفحة الكورسات لإضافة ما يعجبك.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'contact_page_badge', 'value' => 'نحب نسمع منك', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_page_title', 'value' => 'تواصل معنا', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_page_subtitle', 'value' => 'عندك سؤال أو استفسار؟ ابعتلنا رسالة وهنرد عليك بأسرع وقت.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'contact_form_title', 'value' => 'ابعتلنا رسالتك', 'type' => 'string', 'group' => 'general'],
            ['key' => 'join_us_badge', 'value' => 'فرصة للانضمام إلى فريقنا', 'type' => 'string', 'group' => 'general'],
            ['key' => 'join_us_title', 'value' => 'انضم لنا وشارك الأطفال رحلة تعلم البرمجة', 'type' => 'text', 'group' => 'general'],
            ['key' => 'join_us_subtitle', 'value' => 'إذا كنت تمتلك شغف التعليم وصناعة تجربة عربية ممتعة للأطفال، يمكنك إرسال طلبك الآن وسنراجع بياناتك بعناية.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'join_us_form_title', 'value' => 'أرسل طلب الانضمام', 'type' => 'string', 'group' => 'general'],
            ['key' => 'bookings_page_title', 'value' => 'تعلم مع المرح', 'type' => 'string', 'group' => 'general'],
            ['key' => 'bookings_page_subtitle', 'value' => 'ابدأ رحلة طفلك في البرمجة مع تجربة تعليمية ممتعة، آمنة، ومصممة بعناية للطفل العربي.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'bookings_submit_button_label', 'value' => 'إرسال طلب الحجز', 'type' => 'string', 'group' => 'general'],
            ['key' => 'booking_success_title', 'value' => 'تم إرسال طلب الحجز بنجاح', 'type' => 'string', 'group' => 'general'],
            ['key' => 'booking_success_description', 'value' => 'شكرًا لك! تم استلام طلبك وسيقوم فريقنا بالتواصل معك قريبًا لتأكيد البيانات.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'booking_success_home_button', 'value' => 'العودة للرئيسية', 'type' => 'string', 'group' => 'general'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'group' => $setting['group'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'navbar_login_label',
            'navbar_book_now_label',
            'navbar_menu_home_label',
            'navbar_menu_join_label',
            'navbar_menu_favorites_label',
            'navbar_menu_contact_label',
            'navbar_menu_privacy_label',
            'navbar_search_placeholder',
            'navbar_search_button_label',
            'footer_quick_links_title',
            'footer_help_links_title',
            'footer_stay_connected_title',
            'footer_link_home_label',
            'footer_link_privacy_label',
            'footer_link_bookings_label',
            'footer_link_join_us_label',
            'footer_link_contact_label',
            'footer_help_student_login_label',
            'footer_help_admin_login_label',
            'footer_help_support_label',
            'home_journey_title',
            'home_journey_subtitle',
            'home_top_students_title',
            'home_top_students_subtitle',
            'home_top_students_empty_text',
            'home_feedback_gallery_title',
            'home_feedback_gallery_subtitle',
            'home_feedback_gallery_empty_text',
            'home_faq_title',
            'home_faq_subtitle',
            'home_faq_empty_text',
            'home_faq_video_unavailable_text',
            'home_hero_fallback_title',
            'home_hero_fallback_subtitle',
            'home_hero_fallback_description',
            'home_hero_cta_label',
            'course_card_default_audience_label',
            'course_card_no_image_text',
            'course_card_show_details_label',
            'course_details_cta_label',
            'course_details_about_title',
            'course_details_learn_title',
            'course_details_audience_title',
            'course_details_content_title',
            'course_details_banner_title',
            'course_details_banner_description',
            'course_details_related_title',
            'favorites_title',
            'favorites_subtitle',
            'favorites_empty_text',
            'contact_page_badge',
            'contact_page_title',
            'contact_page_subtitle',
            'contact_form_title',
            'join_us_badge',
            'join_us_title',
            'join_us_subtitle',
            'join_us_form_title',
            'bookings_page_title',
            'bookings_page_subtitle',
            'bookings_submit_button_label',
            'booking_success_title',
            'booking_success_description',
            'booking_success_home_button',
        ])->delete();
    }
};
