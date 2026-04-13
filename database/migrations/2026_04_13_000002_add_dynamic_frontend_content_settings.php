<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $settings = [
            ['key' => 'whatsapp_default_message', 'value' => 'مرحبًا أريد استشارة عن كورسات الأكاديمية', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_intro_subtitle', 'value' => 'أكاديمية برمجة للأطفال والناشئين', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_programming_title', 'value' => 'كورسات البرمجة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_programming_description', 'value' => 'جميع كورسات البرمجة متاحة الآن ضمن فئة موحدة من 5 إلى 17 سنة، مع عرض كل الكورسات في مكان واحد بدون تقسيمات فرعية.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'home_programming_audience_label', 'value' => 'من 5 إلى 17 سنة', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_course_reels_title', 'value' => 'شرح التراكات والكورسات', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_course_reels_subtitle', 'value' => 'شوف فيديو لكل كورس مع نبذة سريعة وتراك المسار.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_explore_title', 'value' => 'آراء الطلاب وأولياء الأمور', 'type' => 'string', 'group' => 'general'],
            ['key' => 'home_explore_subtitle', 'value' => 'قصص حقيقية من طلابنا. اضغط على أي بطاقة لمشاهدة الفيديو.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_description', 'value' => 'منصة تعليمية عصرية لتعليم البرمجة للأطفال والمبتدئين بأسلوب ممتع وتفاعلي، مع متابعة دقيقة لمسار التعلم.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'footer_newsletter_description', 'value' => 'حدّث بيانات التواصل والسوشيال من لوحة التحكم لتظهر هنا تلقائيًا.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'footer_copyright', 'value' => '© {year} {site_name}. جميع الحقوق محفوظة.', 'type' => 'string', 'group' => 'general'],
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
            'whatsapp_default_message',
            'home_intro_subtitle',
            'home_programming_title',
            'home_programming_description',
            'home_programming_audience_label',
            'home_course_reels_title',
            'home_course_reels_subtitle',
            'home_explore_title',
            'home_explore_subtitle',
            'footer_description',
            'footer_newsletter_description',
            'footer_copyright',
        ])->delete();
    }
};
