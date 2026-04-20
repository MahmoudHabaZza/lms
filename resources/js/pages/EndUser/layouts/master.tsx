import { usePage } from '@inertiajs/react';
import { MessageCircleMore } from 'lucide-react';
import Footer from './footer';
import Navbar from './navbar';
import Scripts from './scripts';
import Topbar from './topbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { settings } = usePage<any>().props;
    const whatsappNumber = settings?.whatsapp_number
        ? String(settings.whatsapp_number).replace(/[^0-9]/g, '')
        : '';
    const whatsappMessage = encodeURIComponent(
        settings?.whatsapp_default_message ||
            'Ù…Ø±Ø­Ø¨Ù‹Ø§ Ø£Ø±ÙŠØ¯ Ø§Ø³ØªØ´Ø§Ø±Ø© Ø¹Ù† ÙƒÙˆØ±Ø³Ø§Øª Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ©',
    );

    return (
        <>
            <Topbar />
            <Navbar />
            <main className="pt-[calc(var(--topbar-offset,40px)+90px)] pb-0">
                {children}
            </main>
            <Footer />

            {whatsappNumber && (
                <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="fixed right-4 bottom-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_20px_40px_-18px_rgba(37,211,102,0.85)] transition hover:scale-105 sm:bottom-5 sm:h-16 sm:w-16"
                    aria-label="ØªÙˆØ§ØµÙ„ Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨"
                >
                    <MessageCircleMore
                        size={28}
                        strokeWidth={2.4}
                        className="sm:h-8 sm:w-8"
                    />
                </a>
            )}

            <Scripts />
        </>
    );
}
