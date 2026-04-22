import { useForm, usePage } from '@inertiajs/react';
import { Check, Mail, Palette, Save, Settings, Share2, Upload } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import AdminLayout from '../layouts/admin-layout';

type Setting = {
    id: number;
    key: string;
    value: string;
    type: string;
    group: string;
};

type Props = {
    settings: Record<string, Setting[]>;
};

const groupIcons: Record<string, any> = {
    general: Settings,
    colors: Palette,
    social: Share2,
    mail: Mail,
};

const groupLabels: Record<string, string> = {
    general: 'إعدادات عامة',
    colors: 'الألوان',
    social: 'السوشيال ميديا',
    mail: 'إعدادات البريد',
};

const fieldLabels: Record<string, string> = {
    site_name: 'اسم الموقع',
    font_family: 'خط الموقع',
    site_logo: 'شعار الموقع',
    whatsapp_default_message: 'رسالة واتساب الافتراضية',
    home_intro_subtitle: 'العنوان الفرعي في الهوم',
    home_programming_title: 'عنوان سكشن الكورسات',
    home_programming_description: 'وصف سكشن الكورسات',
    home_programming_audience_label: 'شارة الفئة العمرية في سكشن الكورسات',
    home_course_reels_title: 'عنوان سكشن شرح التراكات',
    home_course_reels_subtitle: 'وصف سكشن شرح التراكات',
    home_explore_title: 'عنوان سكشن آراء الطلاب',
    home_explore_subtitle: 'وصف سكشن آراء الطلاب',
    footer_description: 'وصف الفوتر الرئيسي',
    footer_newsletter_description: 'وصف صندوق التواصل في الفوتر',
    footer_copyright: 'نص حقوق النشر',
    navbar_login_label: 'نص زر تسجيل الدخول في الهيدر',
    navbar_book_now_label: 'نص زر احجز الآن في الهيدر',
    navbar_menu_home_label: 'نص القائمة: الرئيسية',
    navbar_menu_join_label: 'نص القائمة: انضم لنا',
    navbar_menu_favorites_label: 'نص القائمة: المفضلة',
    navbar_menu_contact_label: 'نص القائمة: تواصل معنا',
    navbar_menu_privacy_label: 'نص القائمة: سياسة الخصوصية',
    navbar_search_placeholder: 'Placeholder حقل البحث في الهيدر',
    navbar_search_button_label: 'نص زر البحث في الهيدر',
    footer_quick_links_title: 'عنوان روابط سريعة في الفوتر',
    footer_help_links_title: 'عنوان المساعدة في الفوتر',
    footer_stay_connected_title: 'عنوان ابق على تواصل في الفوتر',
    footer_link_home_label: 'نص رابط الرئيسية في الفوتر',
    footer_link_privacy_label: 'نص رابط سياسة الخصوصية في الفوتر',
    footer_link_bookings_label: 'نص رابط احجز الآن في الفوتر',
    footer_link_join_us_label: 'نص رابط انضم لنا في الفوتر',
    footer_link_contact_label: 'نص رابط تواصل معنا في الفوتر',
    footer_help_student_login_label: 'نص رابط دخول الطالب في الفوتر',
    footer_help_admin_login_label: 'نص رابط دخول الإدارة في الفوتر',
    footer_help_support_label: 'نص رابط الدعم الفني في الفوتر',
    home_journey_title: 'عنوان سكشن رحلة الأكاديمية',
    home_journey_subtitle: 'وصف سكشن رحلة الأكاديمية',
    home_top_students_title: 'عنوان سكشن الطلاب المتفوقين',
    home_top_students_subtitle: 'وصف سكشن الطلاب المتفوقين',
    home_top_students_empty_text: 'رسالة عدم وجود طلاب متفوقين',
    home_feedback_gallery_title: 'عنوان سكشن آراء بالصور',
    home_feedback_gallery_subtitle: 'وصف سكشن آراء بالصور',
    home_feedback_gallery_empty_text: 'رسالة عدم وجود آراء بالصور',
    home_faq_title: 'عنوان سكشن FAQ',
    home_faq_subtitle: 'وصف سكشن FAQ',
    home_faq_empty_text: 'رسالة عدم وجود FAQ',
    home_faq_video_unavailable_text: 'رسالة عدم توفر فيديو FAQ',
    home_hero_fallback_title: 'عنوان البانر الافتراضي',
    home_hero_fallback_subtitle: 'العنوان الفرعي للبانر الافتراضي',
    home_hero_fallback_description: 'وصف البانر الافتراضي',
    home_hero_cta_label: 'نص زر CTA في البانر',
    course_card_default_audience_label: 'شارة الجمهور الافتراضية لكارت الكورس',
    course_card_no_image_text: 'رسالة عدم وجود صورة للكورس',
    course_card_show_details_label: 'نص عرض التفاصيل في كارت الكورس',
    course_details_cta_label: 'نص زر CTA بصفحة تفاصيل الكورس',
    course_details_about_title: 'عنوان قسم عن الكورس',
    course_details_learn_title: 'عنوان قسم ماذا سيتعلم',
    course_details_audience_title: 'عنوان قسم الجمهور المستهدف',
    course_details_content_title: 'عنوان قسم محتوى الكورس',
    course_details_banner_title: 'عنوان بانر الحجز في تفاصيل الكورس',
    course_details_banner_description: 'وصف بانر الحجز في تفاصيل الكورس',
    course_details_related_title: 'عنوان الكورسات المشابهة',
    favorites_title: 'عنوان صفحة المفضلة',
    favorites_subtitle: 'وصف صفحة المفضلة',
    favorites_empty_text: 'رسالة عدم وجود عناصر بالمفضلة',
    contact_page_badge: 'شارة أعلى صفحة تواصل معنا',
    contact_page_title: 'عنوان صفحة تواصل معنا',
    contact_page_subtitle: 'وصف صفحة تواصل معنا',
    contact_form_title: 'عنوان نموذج التواصل',
    join_us_badge: 'شارة أعلى صفحة انضم لنا',
    join_us_title: 'عنوان صفحة انضم لنا',
    join_us_subtitle: 'وصف صفحة انضم لنا',
    join_us_form_title: 'عنوان نموذج الانضمام',
    bookings_page_title: 'عنوان صفحة الحجز',
    bookings_page_subtitle: 'وصف صفحة الحجز',
    bookings_submit_button_label: 'نص زر إرسال الحجز',
    booking_success_title: 'عنوان صفحة نجاح الحجز',
    booking_success_description: 'وصف صفحة نجاح الحجز',
    booking_success_home_button: 'نص زر العودة من صفحة نجاح الحجز',
    privacy_policy_badge: 'شارة صفحة سياسة الخصوصية',
    privacy_policy_title: 'عنوان صفحة سياسة الخصوصية',
    privacy_policy_subtitle: 'وصف صفحة سياسة الخصوصية',
    privacy_policy_content: 'محتوى صفحة سياسة الخصوصية',
    address: 'العنوان',
    contact_email: 'البريد العام',
    contact_phone: 'رقم التواصل',
    admin_email: 'بريد الإدارة',
    primary_color: 'اللون الأساسي',
    facebook_url: 'رابط فيسبوك',
    instagram_url: 'رابط إنستجرام',
    linkedin_url: 'رابط لينكدإن',
    tiktok_url: 'رابط تيك توك',
    whatsapp_number: 'رقم واتساب',
    youtube_url: 'رابط يوتيوب',
    booking_notification_email: 'البريد المستلم لطلبات الحجز',
    contact_notification_email: 'البريد المستلم لرسائل التواصل',
    mail_mailer: 'نوع المرسل Mailer',
    mail_host: 'SMTP Host',
    mail_port: 'SMTP Port',
    mail_username: 'اسم المستخدم',
    mail_password: 'كلمة المرور / App Password',
    mail_encryption: 'التشفير',
    mail_from_address: 'From Address',
    mail_from_name: 'From Name',
};

const fieldHints: Record<string, string> = {
    font_family: 'اختر الخط الأساسي الذي سيظهر في الموقع كله ولوحة الأدمن.',
    address: 'العنوان الذي سيظهر في الفوتر وصفحة تواصل معنا.',
    contact_email: 'البريد المعروض للزوار في التوب بار والفوتر وصفحة التواصل.',
    contact_phone: 'رقم التواصل المعروض للزوار ويمكن استخدامه للاتصال أو واتساب.',
    facebook_url: 'ضع الرابط الكامل لصفحة فيسبوك.',
    instagram_url: 'ضع الرابط الكامل لحساب إنستجرام.',
    linkedin_url: 'ضع الرابط الكامل لصفحة لينكدإن.',
    tiktok_url: 'ضع الرابط الكامل لحساب تيك توك.',
    whatsapp_number: 'اكتب رقم واتساب بصيغة دولية مثل 2010xxxxxxx.',
    whatsapp_default_message: 'الرسالة التي تُفتح تلقائيًا عند الضغط على زر واتساب. يمكنك استخدام نص تسويقي مناسب للعميل.',
    home_intro_subtitle: 'العنوان الفرعي الظاهر أسفل عنوان القسم التعريفي في الصفحة الرئيسية.',
    home_programming_title: 'عنوان سكشن عرض الكورسات في الهوم.',
    home_programming_description: 'وصف سكشن عرض الكورسات في الهوم.',
    home_programming_audience_label: 'النص داخل الشارة الصغيرة أعلى سكشن الكورسات (مثال: من 5 إلى 17 سنة).',
    home_course_reels_title: 'عنوان سكشن شرح التراكات والكورسات.',
    home_course_reels_subtitle: 'وصف سكشن شرح التراكات والكورسات.',
    home_explore_title: 'عنوان سكشن آراء الطلاب وأولياء الأمور.',
    home_explore_subtitle: 'وصف سكشن آراء الطلاب وأولياء الأمور.',
    footer_description: 'وصف تعريفي رئيسي يظهر بجانب الشعار في الفوتر.',
    footer_newsletter_description: 'النص التعريفي لصندوق التواصل داخل الفوتر.',
    footer_copyright: 'يمكنك استخدام {year} للسنة الحالية و {site_name} لاسم الموقع.',
    navbar_login_label: 'النص الظاهر على زر تسجيل الدخول في الهيدر.',
    navbar_book_now_label: 'النص الظاهر على زر الحجز الأساسي في الهيدر.',
    navbar_menu_home_label: 'النص الظاهر لعنصر "الرئيسية" في قائمة الهيدر.',
    navbar_menu_join_label: 'النص الظاهر لعنصر "انضم لنا" في قائمة الهيدر.',
    navbar_menu_favorites_label: 'النص الظاهر لعنصر "المفضلة" في قائمة الهيدر.',
    navbar_menu_contact_label: 'النص الظاهر لعنصر "تواصل معنا" في قائمة الهيدر.',
    navbar_menu_privacy_label: 'النص الظاهر لعنصر "سياسة الخصوصية" في قائمة الهيدر.',
    navbar_search_placeholder: 'النص داخل حقل البحث قبل الكتابة.',
    navbar_search_button_label: 'النص الظاهر على زر تنفيذ البحث.',
    footer_quick_links_title: 'عنوان عمود الروابط السريعة في الفوتر.',
    footer_help_links_title: 'عنوان عمود المساعدة في الفوتر.',
    footer_stay_connected_title: 'عنوان عمود المتابعة والتواصل في الفوتر.',
    footer_link_home_label: 'النص المعروض لرابط الرئيسية في الفوتر.',
    footer_link_privacy_label: 'النص المعروض لرابط سياسة الخصوصية في الفوتر.',
    footer_link_bookings_label: 'النص المعروض لرابط احجز الآن في الفوتر.',
    footer_link_join_us_label: 'النص المعروض لرابط انضم لنا في الفوتر.',
    footer_link_contact_label: 'النص المعروض لرابط تواصل معنا في الفوتر.',
    footer_help_student_login_label: 'النص المعروض لرابط دخول الطالب في قسم المساعدة.',
    footer_help_admin_login_label: 'النص المعروض لرابط دخول الإدارة في قسم المساعدة.',
    footer_help_support_label: 'النص المعروض لرابط الدعم الفني في قسم المساعدة.',
    home_journey_title: 'عنوان سكشن رحلة الأكاديمية في الصفحة الرئيسية.',
    home_journey_subtitle: 'الوصف المختصر تحت عنوان رحلة الأكاديمية.',
    home_top_students_title: 'عنوان سكشن صور الطلاب المتفوقين.',
    home_top_students_subtitle: 'الوصف المختصر لسكشن الطلاب المتفوقين.',
    home_top_students_empty_text: 'رسالة تظهر عند عدم وجود صور طلاب متفوقين.',
    home_feedback_gallery_title: 'عنوان سكشن آراء الطلاب وأولياء الأمور (صور).',
    home_feedback_gallery_subtitle: 'الوصف المختصر لسكشن الآراء بالصور.',
    home_feedback_gallery_empty_text: 'رسالة تظهر عند عدم وجود آراء مفعلة.',
    home_faq_title: 'عنوان سكشن الأسئلة الشائعة.',
    home_faq_subtitle: 'الوصف المختصر لسكشن FAQ.',
    home_faq_empty_text: 'رسالة تظهر عند عدم وجود أسئلة مفعلة.',
    home_faq_video_unavailable_text: 'رسالة تظهر إذا كان فيديو إجابة السؤال غير متاح.',
    home_hero_fallback_title: 'عنوان افتراضي للبانر إذا لا توجد سلايدات.',
    home_hero_fallback_subtitle: 'عنوان فرعي افتراضي للبانر.',
    home_hero_fallback_description: 'وصف افتراضي للبانر.',
    home_hero_cta_label: 'نص زر الحجز/الإجراء داخل البانر الرئيسي.',
    course_card_default_audience_label: 'النص الافتراضي لبادج الفئة العمرية في كارت الكورس.',
    course_card_no_image_text: 'نص بديل عند عدم وجود صورة للكورس.',
    course_card_show_details_label: 'نص زر/رابط عرض التفاصيل داخل كارت الكورس.',
    course_details_cta_label: 'نص زر CTA الأساسي في صفحة تفاصيل الكورس.',
    course_details_about_title: 'عنوان قسم "عن الكورس".',
    course_details_learn_title: 'عنوان قسم "ماذا سيتعلم".',
    course_details_audience_title: 'عنوان قسم الجمهور المستهدف.',
    course_details_content_title: 'عنوان قسم محتوى الكورس.',
    course_details_banner_title: 'عنوان بانر الحجز في آخر صفحة تفاصيل الكورس.',
    course_details_banner_description: 'وصف بانر الحجز في صفحة تفاصيل الكورس.',
    course_details_related_title: 'عنوان سكشن الكورسات المقترحة.',
    favorites_title: 'العنوان الرئيسي لصفحة المفضلة.',
    favorites_subtitle: 'الوصف المختصر لصفحة المفضلة.',
    favorites_empty_text: 'الرسالة المعروضة عند عدم وجود كورسات مفضلة.',
    contact_page_badge: 'نص الشارة الصغيرة أعلى صفحة التواصل.',
    contact_page_title: 'العنوان الرئيسي لصفحة التواصل.',
    contact_page_subtitle: 'النص التعريفي أسفل عنوان صفحة التواصل.',
    contact_form_title: 'عنوان نموذج إرسال الرسالة في صفحة التواصل.',
    join_us_badge: 'نص الشارة الصغيرة أعلى صفحة انضم لنا.',
    join_us_title: 'العنوان الرئيسي لصفحة انضم لنا.',
    join_us_subtitle: 'النص التعريفي أسفل عنوان صفحة انضم لنا.',
    join_us_form_title: 'عنوان نموذج تقديم طلب الانضمام.',
    bookings_page_title: 'العنوان الرئيسي في صفحة الحجز.',
    bookings_page_subtitle: 'الوصف التعريفي أسفل عنوان صفحة الحجز.',
    bookings_submit_button_label: 'النص الظاهر على زر إرسال طلب الحجز.',
    booking_success_title: 'العنوان الرئيسي لصفحة نجاح الحجز.',
    booking_success_description: 'الوصف التعريفي في صفحة نجاح الحجز.',
    booking_success_home_button: 'نص زر العودة للصفحة الرئيسية بعد الحجز.',
    privacy_policy_badge: 'الشارة أعلى عنوان سياسة الخصوصية.',
    privacy_policy_title: 'العنوان الرئيسي لصفحة سياسة الخصوصية.',
    privacy_policy_subtitle: 'الرسالة التوضيحية أسفل عنوان سياسة الخصوصية.',
    privacy_policy_content: 'محتوى سياسة الخصوصية الذي سيظهر للزوار (يمكنك إدخال أكواد HTML لتنسيق المحتوى).',
    youtube_url: 'ضع الرابط الكامل لقناة يوتيوب.',
    booking_notification_email: 'كل طلب حجز جديد سيتم إرساله إلى هذا البريد.',
    contact_notification_email: 'كل رسالة جديدة من صفحة تواصل معنا سيتم إرسالها إلى هذا البريد.',
    mail_mailer: 'غالباً استخدم smtp. ويمكنك استخدام log أثناء التجربة.',
    mail_host: 'مثال: smtp.gmail.com أو mail.yourdomain.com',
    mail_port: 'أمثلة شائعة: 587 لـ TLS أو 465 لـ SSL',
    mail_username: 'غالباً نفس البريد المرسل منه.',
    mail_password: 'في Gmail استخدم App Password وليس كلمة المرور العادية.',
    mail_encryption: 'اتركها tls أو ssl حسب مزود البريد.',
    mail_from_address: 'البريد الظاهر كمرسل للرسائل.',
    mail_from_name: 'الاسم الظاهر للمستلم.',
};

const hiddenSettingKeys = new Set([
    'homepage_primary_color',
    'homepage_secondary_color',
]);

const settingSections: Array<{ id: string; title: string; match: (key: string) => boolean }> = [
    { id: 'navbar', title: 'الهيدر والتنقل', match: (key) => key.startsWith('navbar_') },
    { id: 'footer', title: 'الفوتر', match: (key) => key.startsWith('footer_') },
    { id: 'home', title: 'الصفحة الرئيسية', match: (key) => key.startsWith('home_') },
    { id: 'course_card', title: 'كروت الكورسات', match: (key) => key.startsWith('course_card_') },
    { id: 'course_details', title: 'صفحة تفاصيل الكورس', match: (key) => key.startsWith('course_details_') },
    { id: 'contact', title: 'صفحة تواصل معنا', match: (key) => key.startsWith('contact_') },
    { id: 'join_us', title: 'صفحة انضم لنا', match: (key) => key.startsWith('join_us_') },
    { id: 'bookings', title: 'صفحة الحجوزات', match: (key) => key.startsWith('bookings_') || key.startsWith('booking_success_') },
    { id: 'favorites', title: 'صفحة المفضلة', match: (key) => key.startsWith('favorites_') },
    { id: 'privacy', title: 'صفحة سياسة الخصوصية', match: (key) => key.startsWith('privacy_policy_') },
];

const fontOptions = [
    { value: 'playpen_arabic', label: 'Playpen Sans Arabic' },
    { value: 'marhey', label: 'Marhey' },
    { value: 'fredoka', label: 'Fredoka' },
    { value: 'instrument_sans', label: 'Instrument Sans' },
];

function getInputType(setting: Setting) {
    if (setting.type === 'color') return 'color';
    if (setting.key.includes('password')) return 'password';
    if (setting.key.includes('email')) return 'email';
    if (setting.key.includes('port')) return 'number';
    if (setting.key.includes('url')) return 'url';

    return 'text';
}

export default function SettingsIndex({ settings }: Props) {
    const page = usePage();
    const url = page.url ?? '';
    const activeGroup = useMemo(() => {
        const params = new URLSearchParams(url.split('?')[1] ?? '');
        const group = params.get('group');
        return group && settings[group] ? group : null;
    }, [settings, url]);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [logoMessage, setLogoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [testEmail, setTestEmail] = useState('');
    const [testingEmail, setTestingEmail] = useState(false);
    const [testMessage, setTestMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const groupedSettings = useMemo(() => {
        if (activeGroup) {
            return { [activeGroup]: settings[activeGroup] };
        }

        return settings;
    }, [activeGroup, settings]);

    const { data, setData, post, processing, errors } = useForm({
        settings: Object.values(settings).flat().map((setting) => ({
            key: setting.key,
            value: setting.value ?? '',
        })),
    });
    const formErrors = errors as Record<string, string | undefined>;

    const updateValue = (key: string, value: string) => {
        setData('settings', data.settings.map((setting) => (
            setting.key === key ? { ...setting, value } : setting
        )));
    };

    const getValue = (key: string) => data.settings.find((setting) => setting.key === key)?.value ?? '';

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/admin/settings', {
            preserveScroll: true,
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    return (
        <AdminLayout title={activeGroup === 'mail' ? 'إعدادات البريد' : 'إعدادات الموقع'}>
            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900">
                        {activeGroup === 'mail' ? 'إدارة البريد والإشعارات' : 'إعدادات الموقع'}
                    </h1>
                    <p className="mt-2 text-slate-600">
                        {activeGroup === 'mail'
                            ? 'من هنا تحدد بريد استقبال طلبات الحجز وكل إعدادات SMTP بشكل ديناميكي من لوحة التحكم.'
                            : 'يمكنك تحديث إعدادات الموقع العامة والبريد والسوشيال بدون تعديل الكود.'}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">شعار الموقع</h3>
                            <p className="text-sm text-slate-500">ارفع شعار الموقع من هنا.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-start gap-3">
                                <img
                                    src={logoPreview || settings?.general?.find((setting) => setting.key === 'site_logo')?.value || '/assets/EndUser/images/logo.png'}
                                    alt="logo"
                                    className="h-16 w-auto rounded border border-slate-200 p-2"
                                />
                                {logoMessage && (
                                    <div className={`flex items-center gap-2 text-sm font-medium ${logoMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {logoMessage.type === 'success' && <Check size={16} />}
                                        {logoMessage.text}
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700">
                                <span className="inline-flex items-center gap-2">
                                    <Upload size={18} />
                                    اختر صورة
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingLogo}
                                    onChange={async (event) => {
                                        const file = event.target.files?.[0];
                                        if (!file) return;

                                        const reader = new FileReader();
                                        reader.onload = (loadEvent) => {
                                            setLogoPreview(loadEvent.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);

                                        setUploadingLogo(true);
                                        setLogoMessage(null);

                                        const formData = new FormData();
                                        formData.append('site_logo', file);

                                        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                                        try {
                                            const response = await fetch('/admin/settings/logo', {
                                                method: 'POST',
                                                headers: {
                                                    'X-CSRF-TOKEN': token || '',
                                                    Accept: 'application/json',
                                                },
                                                body: formData,
                                            });

                                            const result = await response.json();

                                            if (!response.ok) {
                                                setLogoMessage({ type: 'error', text: result.message || 'فشل رفع الشعار.' });
                                            } else {
                                                setLogoMessage({ type: 'success', text: result.message || 'تم رفع الشعار بنجاح.' });
                                                setLogoPreview(result.path);
                                            }
                                        } catch {
                                            setLogoMessage({ type: 'error', text: 'تعذر رفع الشعار حالياً.' });
                                        } finally {
                                            setUploadingLogo(false);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">اختبار البريد</h3>
                            <p className="text-sm text-slate-500">أرسل رسالة تجريبية للتأكد أن إعدادات SMTP صحيحة.</p>
                        </div>
                        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                            <input
                                type="email"
                                value={testEmail}
                                onChange={(event) => setTestEmail(event.target.value)}
                                placeholder="test@example.com"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm md:w-72"
                            />
                            <button
                                type="button"
                                disabled={testingEmail}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
                                onClick={async () => {
                                    if (!testEmail) {
                                        setTestMessage({ type: 'error', text: 'أدخل بريداً لاختبار الإرسال.' });
                                        return;
                                    }

                                    setTestingEmail(true);
                                    setTestMessage(null);

                                    try {
                                        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                                        const response = await fetch('/admin/settings/test-email', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'X-CSRF-TOKEN': token || '',
                                                Accept: 'application/json',
                                            },
                                            body: JSON.stringify({ to_email: testEmail }),
                                        });

                                        const result = await response.json();
                                        setTestMessage({
                                            type: response.ok ? 'success' : 'error',
                                            text: result.message || (response.ok ? 'تم إرسال الرسالة التجريبية.' : 'فشل إرسال الرسالة التجريبية.'),
                                        });
                                    } catch {
                                        setTestMessage({ type: 'error', text: 'تعذر تنفيذ اختبار البريد حالياً.' });
                                    } finally {
                                        setTestingEmail(false);
                                    }
                                }}
                            >
                                {testingEmail ? 'جاري الإرسال...' : 'إرسال Test Email'}
                            </button>
                        </div>
                    </div>

                    {testMessage && (
                        <div className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${testMessage.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                            {testMessage.text}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {Object.entries(groupedSettings).map(([group, groupSettings]) => {
                        const Icon = groupIcons[group] || Settings;

                        return (
                            <div key={group} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                                    <Icon className="text-slate-500" size={20} />
                                    <h2 className="text-lg font-semibold text-slate-800">{groupLabels[group] || group}</h2>
                                </div>
                                <div className="space-y-4 p-6">
                                    {(() => {
                                        const visibleSettings = groupSettings.filter((setting) => !hiddenSettingKeys.has(setting.key));
                                        const hasSectionedSettings = group === 'general';
                                        const sections = hasSectionedSettings
                                            ? settingSections
                                                .map((section) => ({
                                                    ...section,
                                                    settings: visibleSettings.filter((setting) => section.match(setting.key)),
                                                }))
                                                .filter((section) => section.settings.length > 0)
                                            : [];
                                        const uncategorized = hasSectionedSettings
                                            ? visibleSettings.filter((setting) => !settingSections.some((section) => section.match(setting.key)))
                                            : visibleSettings;
                                        const blocks = hasSectionedSettings
                                            ? [
                                                ...sections.map((section) => ({ title: section.title, settings: section.settings })),
                                                ...(uncategorized.length > 0 ? [{ title: 'إعدادات أخرى', settings: uncategorized }] : []),
                                            ]
                                            : [{ title: '', settings: uncategorized }];

                                        return blocks.map((block) => (
                                            <div
                                                key={block.title || group}
                                                className="rounded-2xl border border-slate-300/90 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 sm:p-5"
                                            >
                                                {block.title && (
                                                    <h3 className="mb-4 border-b border-slate-300/80 pb-2 text-sm font-extrabold text-slate-800">
                                                        {block.title}
                                                    </h3>
                                                )}
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    {block.settings.map((setting) => {
                                                        const inputType = getInputType(setting);
                                                        const errorKey = `settings.${data.settings.findIndex((item) => item.key === setting.key)}.value`;

                                                        return (
                                                            <div key={setting.key} className="space-y-2">
                                                                <label className="text-sm font-semibold text-slate-700">
                                                                    {fieldLabels[setting.key] || setting.key.replace(/_/g, ' ')}
                                                                </label>

                                                                {setting.key === 'font_family' ? (
                                                                    <select
                                                                        value={getValue(setting.key)}
                                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                                    >
                                                                        {fontOptions.map((option) => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                ) : inputType === 'color' ? (
                                                                    <div className="flex gap-3">
                                                                        <input
                                                                            type="color"
                                                                            value={getValue(setting.key)}
                                                                            onChange={(event) => updateValue(setting.key, event.target.value)}
                                                                            className="h-11 w-20 rounded-lg border border-slate-200 p-1"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={getValue(setting.key)}
                                                                            onChange={(event) => updateValue(setting.key, event.target.value)}
                                                                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                                        />
                                                                    </div>
                                                                ) : setting.key === 'mail_mailer' ? (
                                                                    <select
                                                                        value={getValue(setting.key)}
                                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                                    >
                                                                        <option value="smtp">smtp</option>
                                                                        <option value="log">log</option>
                                                                        <option value="sendmail">sendmail</option>
                                                                        <option value="array">array</option>
                                                                    </select>
                                                                ) : setting.key === 'mail_encryption' ? (
                                                                    <select
                                                                        value={getValue(setting.key)}
                                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                                    >
                                                                        <option value="">بدون تشفير</option>
                                                                        <option value="tls">tls</option>
                                                                        <option value="ssl">ssl</option>
                                                                    </select>
                                                                ) : setting.type === 'text' ? (
                                                                    <textarea
                                                                        rows={5}
                                                                        value={getValue(setting.key)}
                                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                                    />
                                                                ) : (
                                                                    <input
                                                                        type={inputType}
                                                                        value={getValue(setting.key)}
                                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                                    />
                                                                )}

                                                                {fieldHints[setting.key] && (
                                                                    <p className="text-xs leading-6 text-slate-500">{fieldHints[setting.key]}</p>
                                                                )}

                                                                {formErrors[errorKey] && (
                                                                    <p className="text-xs text-red-600">{formErrors[errorKey]}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
