import { usePage } from '@inertiajs/react';
import Footer from './footer';
import Navbar from './navbar';
import Scripts from './scripts';
import Topbar from './topbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { settings } = usePage<any>().props;
    const whatsappNumber = settings?.whatsapp_number ? String(settings.whatsapp_number).replace(/[^0-9]/g, '') : '201234567890';
    const whatsappMessage = encodeURIComponent('مرحبًا أريد استشارة عن كورسات الأكاديمية');

    return (
        <>
            <Topbar />
            <Navbar />
            <main className="pt-[calc(var(--topbar-offset, 40px)+80px)] pb-0">{children}</main>
            <Footer />

            <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer noopener"
                className="fixed bottom-5 right-4 z-50 inline-flex h-24 w-24 items-center justify-center"
                aria-label="تواصل عبر واتساب"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="h-20 w-20"
                    style={{ objectFit: 'contain' }}
                />
            </a>

            <Scripts />
        </>
    );
}
