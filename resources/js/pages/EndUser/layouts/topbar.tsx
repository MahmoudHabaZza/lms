import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type TopbarSettings = {
    contact_email?: string | null;
    contact_phone?: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    linkedin_url?: string | null;
    whatsapp_number?: string | null;
    youtube_url?: string | null;
};

type TopbarProps = {
    settings?: TopbarSettings;
};

type SocialItem = {
    link: string;
    icon: string;
};

const resetTopbarOffset = () => {
    document.documentElement.style.setProperty('--topbar-offset', '40px');
};

function renderSocialItem(item: SocialItem, index: number) {
    return (
        <li key={item.icon} className={index === 0 ? '' : 'ml-6 border-l border-white/45 pl-6'}>
            <a
                href={item.link}
                className="group relative flex h-9 w-9 items-center justify-center rounded-full !text-white no-underline transition-all duration-500 hover:-translate-y-1 hover:scale-110"
            >
                <span className="absolute inset-0 rounded-full border border-white/20 bg-white/10 opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:bg-white"></span>
                <i className={`${item.icon} relative z-10 text-sm text-white transition-all duration-500 group-hover:rotate-[360deg] group-hover:text-color-primary`}></i>
            </a>
        </li>
    );
}

export default function Topbar() {
    const { settings } = usePage<TopbarProps>().props;
    const [hidden, setHidden] = useState(false);
    const scrollRef = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const currentY = window.scrollY;
            const isScrollingDown = currentY > scrollRef.current;

            if (currentY > 60 && isScrollingDown) {
                setHidden(true);
            } else if (!isScrollingDown || currentY <= 20) {
                setHidden(false);
            }

            scrollRef.current = currentY;
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--topbar-offset', hidden ? '0px' : '40px');

        return resetTopbarOffset;
    }, [hidden]);

    const email = settings?.contact_email?.trim() ?? '';
    const phone = settings?.contact_phone?.trim() ?? '';
    const whatsappNumber = (settings?.whatsapp_number ?? '').replace(/[^0-9]/g, '');

    const socialItems: SocialItem[] = [
        { link: settings?.facebook_url?.trim() ?? '', icon: 'fab fa-facebook-f' },
        { link: settings?.youtube_url?.trim() ?? '', icon: 'fab fa-youtube' },
        { link: settings?.instagram_url?.trim() ?? '', icon: 'fab fa-instagram' },
        { link: settings?.linkedin_url?.trim() ?? '', icon: 'fab fa-linkedin-in' },
        { link: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '', icon: 'fab fa-whatsapp' },
    ].filter((item) => item.link);

    return (
        <>
            <div className="overlay-container hidden">
                <div className="overlay">
                    <span className="loader"></span>
                </div>
            </div>

            <section
                dir="ltr"
                className={`fp__topbar fixed left-0 right-0 top-0 z-[999] flex h-[40px] w-full items-center bg-color-primary shadow-[0_10px_30px_color-mix(in_srgb,var(--site-primary-color)_18%,transparent)] transition-transform duration-500 ${
                    hidden ? '-translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="container mx-auto flex h-full items-center justify-between px-4">
                    <div className="flex items-center h-full">
                        <ul className="fp__topbar_info flex flex-wrap items-center gap-0">
                            {email && (
                                <li className="mr-8">
                                    <a
                                        href={`mailto:${email}`}
                                        className="group flex items-center gap-3 !text-white no-underline text-sm font-medium tracking-[0.01em] text-white transition-all duration-500"
                                    >
                                        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[360deg] group-hover:bg-white">
                                            <i className="fas fa-envelope text-sm text-white transition-colors duration-500 group-hover:text-color-primary"></i>
                                        </span>
                                        <span className="text-white transition-all duration-500 group-hover:tracking-[0.02em] group-hover:text-white">{email}</span>
                                    </a>
                                </li>
                            )}

                            {phone && (
                                <li>
                                    <a
                                        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                                        className="group flex items-center gap-3 !text-white no-underline text-sm font-medium tracking-[0.01em] text-white transition-all duration-500"
                                    >
                                        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[360deg] group-hover:bg-white">
                                            <i className="fab fa-whatsapp text-sm text-white transition-colors duration-500 group-hover:text-color-primary"></i>
                                        </span>
                                        <span className="text-white transition-all duration-500 group-hover:tracking-[0.02em] group-hover:text-white">{phone}</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="hidden items-center md:flex">
                        <ul className="flex items-center">
                            {socialItems.map(renderSocialItem)}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}

