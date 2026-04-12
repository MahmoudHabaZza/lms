import { usePage } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';

type FooterSettings = {
    site_name?: string | null;
    address?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
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
    const logo = settings?.site_logo ?? '/assets/EndUser/images/logo.png';

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
                        <p className="footer-v4-desc">منصة تعليمية عصرية لتعليم البرمجة للأطفال والمبتدئين بأسلوب ممتع وتفاعلي، مع متابعة دقيقة لمسار التعلم.</p>

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
                    <h4 className="footer-v4-heading">روابط سريعة</h4>
                    <ul className="footer-v4-links">
                        <li><a href="/">الرئيسية</a></li>
                        <li><a href="/pages/privacy-policy">سياسة الخصوصية</a></li>
                        <li><a href="/bookings">احجز الآن</a></li>
                        <li><a href="/join-us">انضم لنا</a></li>
                        <li><a href="/contact">تواصل معنا</a></li>
                    </ul>
                </div>

                <div className="footer-v4-card">
                    <h4 className="footer-v4-heading">المساعدة</h4>
                    <ul className="footer-v4-links">
                        <li><a href="/student/login">دخول الطالب</a></li>
                        <li><a href="/admin/login">دخول الإدارة</a></li>
                        <li><a href="/contact">الدعم الفني</a></li>
                    </ul>
                </div>

                <div className="footer-v4-card footer-v4-newsletter">
                    <h4 className="footer-v4-heading">ابق على تواصل</h4>
                    <p className="mt-2 footer-v4-desc">حدّث بيانات التواصل والسوشيال من لوحة التحكم لتظهر هنا تلقائيًا.</p>
                </div>
            </div>

            <div className="footer-v4-bottom">
                <p>© 2026 {siteName}. جميع الحقوق محفوظة.</p>

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
