import { Link, usePage } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';

type FooterSettings = {
    site_name?: string | null;
    address?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    footer_description?: string | null;
    footer_newsletter_description?: string | null;
    footer_copyright?: string | null;
    footer_quick_links_title?: string | null;
    footer_help_links_title?: string | null;
    footer_stay_connected_title?: string | null;
    footer_link_home_label?: string | null;
    footer_link_privacy_label?: string | null;
    footer_link_bookings_label?: string | null;
    footer_link_join_us_label?: string | null;
    footer_link_contact_label?: string | null;
    footer_help_student_login_label?: string | null;
    footer_help_admin_login_label?: string | null;
    footer_help_support_label?: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    linkedin_url?: string | null;
    site_logo?: string | null;
    whatsapp_number?: string | null;
    youtube_url?: string | null;
};

type FooterProps = {
    settings?: FooterSettings;
};

export default function Footer() {
    const { settings } = usePage<FooterProps>().props;

    const siteName = settings?.site_name?.trim() || 'Kid Coder';
    const email = settings?.contact_email?.trim() ?? '';
    const phone = settings?.contact_phone?.trim() ?? '';
    const address = settings?.address?.trim() ?? '';
    const facebookUrl = settings?.facebook_url?.trim() ?? '';
    const linkedinUrl = settings?.linkedin_url?.trim() ?? '';
    const instagramUrl = settings?.instagram_url?.trim() ?? '';
    const youtubeUrl = settings?.youtube_url?.trim() ?? '';
    const whatsappNumber = (settings?.whatsapp_number ?? '').replace(/[^0-9]/g, '');
    const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '';
    const logo = '/site-logo';
    const footerDescription = settings?.footer_description?.trim() || 'منصة تعليمية عصرية لتعليم البرمجة للأطفال والمبتدئين بأسلوب ممتع وتفاعلي، مع متابعة دقيقة لمسار التعلم.';
    const footerNewsletterDescription = settings?.footer_newsletter_description?.trim() || 'حدّث بيانات التواصل والسوشيال من لوحة التحكم لتظهر هنا تلقائيًا.';
    const footerCopyrightTemplate = settings?.footer_copyright?.trim() || '© {year} {site_name}. جميع الحقوق محفوظة.';
    const footerCopyright = footerCopyrightTemplate
        .replaceAll('{year}', String(new Date().getFullYear()))
        .replaceAll('{site_name}', siteName);
    const footerQuickLinksTitle = settings?.footer_quick_links_title?.trim() || 'روابط سريعة';
    const footerHelpLinksTitle = settings?.footer_help_links_title?.trim() || 'المساعدة';
    const footerStayConnectedTitle = settings?.footer_stay_connected_title?.trim() || 'ابق على تواصل';
    const footerHomeLabel = settings?.footer_link_home_label?.trim() || 'الرئيسية';
    const footerPrivacyLabel = settings?.footer_link_privacy_label?.trim() || 'سياسة الخصوصية';
    const footerBookingsLabel = settings?.footer_link_bookings_label?.trim() || 'احجز الآن';
    const footerJoinUsLabel = settings?.footer_link_join_us_label?.trim() || 'انضم لنا';
    const footerContactLabel = settings?.footer_link_contact_label?.trim() || 'تواصل معنا';
    const footerStudentLoginLabel = settings?.footer_help_student_login_label?.trim() || 'دخول الطالب';
    const footerAdminLoginLabel = settings?.footer_help_admin_login_label?.trim() || 'دخول الإدارة';
    const footerSupportLabel = settings?.footer_help_support_label?.trim() || 'الدعم الفني';

    return (
        <footer className="footer-v4" dir="rtl" lang="ar">
            <div className="footer-v4-bg"></div>

            <div className="footer-v4-shell">
                <div className="footer-v4-card footer-v4-brand">
                    <div className="footer-v4-logo">
                        <img src={logo} alt={siteName} className="footer-v4-logo-img" />
                    </div>

                    <div>
                        <p className="footer-v4-tag">{siteName}</p>
                        <h3 className="footer-v4-title">{siteName}</h3>
                        <p className="footer-v4-desc">{footerDescription}</p>

                        <div className="footer-v4-contact">
                            {address && (
                                <div>
                                    <MapPin />
                                    <span>{address}</span>
                                </div>
                            )}
                            {phone && (
                                <div>
                                    <Phone />
                                    <a href={`tel:${phone}`}>{phone}</a>
                                </div>
                            )}
                            {email && (
                                <div>
                                    <Mail />
                                    <a href={`mailto:${email}`}>{email}</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="footer-v4-card">
                    <h4 className="footer-v4-heading">{footerQuickLinksTitle}</h4>
                    <ul className="footer-v4-links">
                        <li><Link href="/">{footerHomeLabel}</Link></li>
                        <li><Link href="/privacy-policy">{footerPrivacyLabel}</Link></li>
                        <li><Link href="/bookings">{footerBookingsLabel}</Link></li>
                        <li><Link href="/join-us">{footerJoinUsLabel}</Link></li>
                        <li><Link href="/contact">{footerContactLabel}</Link></li>
                    </ul>
                </div>

                <div className="footer-v4-card">
                    <h4 className="footer-v4-heading">{footerHelpLinksTitle}</h4>
                    <ul className="footer-v4-links">
                        <li><a href="/student/login">{footerStudentLoginLabel}</a></li>
                        <li><a href="/admin/login">{footerAdminLoginLabel}</a></li>
                        <li><a href="/contact">{footerSupportLabel}</a></li>
                    </ul>
                </div>

                <div className="footer-v4-card footer-v4-newsletter">
                    <h4 className="footer-v4-heading">{footerStayConnectedTitle}</h4>
                    <p className="mt-2 footer-v4-desc">{footerNewsletterDescription}</p>
                </div>
            </div>

            <div className="footer-v4-bottom">
                <p>{footerCopyright}</p>

                <div className="footer-v4-social">
                    {facebookUrl && (
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Facebook />
                        </a>
                    )}
                    {youtubeUrl && (
                        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <Youtube />
                        </a>
                    )}
                    {linkedinUrl && (
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin />
                        </a>
                    )}
                    {instagramUrl && (
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram />
                        </a>
                    )}
                    {whatsappUrl && (
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <i className="fab fa-whatsapp text-[18px]"></i>
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
}
