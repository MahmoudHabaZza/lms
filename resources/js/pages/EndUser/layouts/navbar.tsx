import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, Search, UserRound, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface MenuItem {
    label: string;
    link: string;
    child?: MenuItem[];
}

const Navbar: React.FC = () => {
    const { url, settings, auth } = usePage<any>().props;
    const loginLabel = settings?.navbar_login_label?.trim() || 'تسجيل الدخول';
    const bookNowLabel = settings?.navbar_book_now_label?.trim() || 'احجز الآن';
    const searchPlaceholder =
        settings?.navbar_search_placeholder?.trim() || 'ابحث...';
    const searchButtonLabel =
        settings?.navbar_search_button_label?.trim() || 'بحث';
    const navHomeLabel =
        settings?.navbar_menu_home_label?.trim() || 'الصفحة الرئيسية';
    const navJoinLabel = settings?.navbar_menu_join_label?.trim() || 'انضم لنا';
    const navFavoritesLabel =
        settings?.navbar_menu_favorites_label?.trim() || 'المفضلة';
    const navContactLabel =
        settings?.navbar_menu_contact_label?.trim() || 'تواصل معنا';
    const navPrivacyLabel =
        settings?.navbar_menu_privacy_label?.trim() || 'سياسة الخصوصية';

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);

    const closeMenuTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const openUserMenu = () => {
        if (closeMenuTimer.current) {
            clearTimeout(closeMenuTimer.current);
            closeMenuTimer.current = null;
        }
        setUserMenuOpen(true);
    };

    const closeUserMenu = () => {
        if (closeMenuTimer.current) {
            clearTimeout(closeMenuTimer.current);
        }
        closeMenuTimer.current = setTimeout(() => {
            setUserMenuOpen(false);
            closeMenuTimer.current = null;
        }, 150);
    };

    const handleLogout = () => {
        const logoutRoute = auth?.user?.is_admin
            ? '/logout'
            : '/student/logout';
        router.post(logoutRoute);
    };
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const hasScrolled = window.scrollY > 10;
            setIsScrolled(hasScrolled);

            if (window.scrollY > 50 && mobileOpen) {
                setMobileOpen(false);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [mobileOpen]);

    useEffect(() => {
        document.body.style.overflow =
            isSearchOpen || mobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSearchOpen, mobileOpen]);

    const handleFavoritesNavigation = async (
        event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
        const user = auth?.user;
        if (user) {
            return;
        }

        event.preventDefault();
        const result = await Swal.fire({
            icon: 'warning',
            title: 'سجل دخولك أولًا',
            text: 'لازم تسجل الدخول كطالب علشان تفتح صفحة المفضلة.',
            confirmButtonText: 'تسجيل الدخول',
            showCancelButton: true,
            cancelButtonText: 'إلغاء',
        });

        if (result.isConfirmed) {
            window.location.href = '/student/login';
        }
    };

    const mainMenu: MenuItem[] = [
        { label: navPrivacyLabel, link: '/privacy-policy' },
        { label: navContactLabel, link: '/contact' },
        { label: navFavoritesLabel, link: '/favorites' },
        { label: navJoinLabel, link: '/join-us' },
        { label: navHomeLabel, link: '/' },
    ];

    return (
        <>
            <nav
                dir="ltr"
                className={`fixed z-[998] h-[90px] w-full transition-all duration-300 ${
                    isScrolled
                        ? 'border-b border-gray-200 bg-white/95 shadow-md backdrop-blur-sm'
                        : 'border-b border-transparent bg-white/95 shadow-sm backdrop-blur-sm'
                }`}
                style={{ top: 'var(--topbar-offset)' }}
            >
                <div className="container mx-auto h-full px-4">
                    <div className="flex h-full items-center justify-between gap-2 sm:gap-3">
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                className="menu_search inline-flex h-10 w-10 items-center justify-center rounded-full p-2 text-gray-900 transition-all duration-300 hover:scale-110 hover:text-color-primary sm:h-11 sm:w-11"
                                aria-label="Open search"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            <div className="hidden items-center gap-2 md:flex">
                                {auth?.user ? (
                                    <div
                                        className="relative"
                                        onMouseEnter={openUserMenu}
                                        onMouseLeave={closeUserMenu}
                                        onFocus={openUserMenu}
                                        onBlur={closeUserMenu}
                                    >
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-full bg-color-primary/10 px-4 py-2 font-semibold text-color-primary transition-all duration-300 hover:bg-color-primary hover:text-white focus-visible:ring-2 focus-visible:ring-color-primary focus-visible:outline-none"
                                        >
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-color-primary text-white">
                                                <UserRound className="h-4 w-4" />
                                            </span>
                                            <span className="max-w-[120px] truncate text-sm font-semibold">
                                                {auth.user.name}
                                            </span>
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        </button>

                                        {userMenuOpen && (
                                            <ul
                                                className="absolute top-full left-0 z-50 mt-2 w-44 rounded-2xl border border-gray-100 bg-white p-1 shadow-[0_15px_35px_rgba(15,23,42,0.25)] transition-all duration-200 ease-out"
                                                onMouseEnter={openUserMenu}
                                                onMouseLeave={closeUserMenu}
                                            >
                                                <li>
                                                    <a
                                                        href="/student/profile"
                                                        className="block rounded px-3 py-2 text-right text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() =>
                                                            setUserMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        ملفي الشخصي
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="/student/dashboard"
                                                        className="block rounded px-3 py-2 text-right text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() =>
                                                            setUserMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        لوحة التحكم
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="/student/courses"
                                                        className="block rounded px-3 py-2 text-right text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() =>
                                                            setUserMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        الدورات
                                                    </a>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="w-full rounded px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50"
                                                        onClick={() => {
                                                            setUserMenuOpen(
                                                                false,
                                                            );
                                                            handleLogout();
                                                        }}
                                                    >
                                                        تسجيل خروج
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <a
                                        href="/login"
                                        className="rounded-md border border-color-primary bg-white px-4 py-2 font-playpen-arabic text-color-primary transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-color-primary hover:text-white hover:shadow-xl"
                                    >
                                        {loginLabel}
                                    </a>
                                )}

                                <a
                                    href="/bookings"
                                    className="rounded-md border border-color-primary bg-color-primary px-4 py-2 font-playpen-arabic text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white hover:text-color-primary hover:shadow-xl"
                                >
                                    {bookNowLabel}
                                </a>
                            </div>
                        </div>

                        <div className="hidden flex-1 justify-center lg:flex">
                            <ul className="flex items-center space-x-6">
                                {mainMenu.map((menuItem) => (
                                    <li
                                        key={menuItem.link}
                                        className="group relative"
                                    >
                                        <a
                                            className={`relative font-playpen-arabic text-lg font-semibold text-gray-900 capitalize transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:text-color-primary hover:drop-shadow-lg ${
                                                url === menuItem.link
                                                    ? 'text-color-primary'
                                                    : ''
                                            }`}
                                            href={menuItem.link}
                                            onClick={
                                                menuItem.link === '/favorites'
                                                    ? handleFavoritesNavigation
                                                    : undefined
                                            }
                                        >
                                            {menuItem.label}
                                            {menuItem.child && (
                                                <i className="far fa-angle-down ml-1"></i>
                                            )}
                                            <span className="absolute -bottom-1 left-0 h-0.5 w-full scale-0 bg-color-primary opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"></span>
                                        </a>
                                        {menuItem.child && (
                                            <ul className="invisible absolute top-full left-0 z-10 w-64 rounded-md border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100">
                                                {menuItem.child.map((child) => (
                                                    <li key={child.link}>
                                                        <a
                                                            href={child.link}
                                                            className="block px-4 py-2 font-playpen-arabic text-gray-900 transition-colors duration-200 hover:bg-orange-50 hover:text-color-primary"
                                                        >
                                                            {child.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <a
                            className="logo-container group flex min-w-0 flex-1 items-center justify-center px-2 font-fredoka no-underline transition-all duration-300 lg:flex-none lg:px-0"
                            href="/"
                            title={settings?.site_name ?? 'Kid Coder Academy'}
                        >
                            {logoError ? (
                                <span className="max-w-[170px] truncate text-center text-lg font-bold text-color-primary sm:max-w-none sm:text-2xl">
                                    {settings?.site_name ?? 'Kid Coder Academy'}
                                </span>
                            ) : (
                                <img
                                    src={
                                        settings?.site_logo ??
                                        '/assets/EndUser/images/logo.png'
                                    }
                                    alt={
                                        settings?.site_name ??
                                        'Kid Coder Academy'
                                    }
                                    className="logo-animated h-12 max-w-[140px] w-auto transform object-contain group-hover:scale-110 sm:h-16 sm:max-w-[180px] lg:h-20 lg:max-w-none"
                                    onError={() => setLogoError(true)}
                                />
                            )}
                        </a>

                        <button
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-color-primary hover:text-color-primary sm:h-11 sm:w-11 lg:hidden"
                            type="button"
                            onClick={() => setMobileOpen((open) => !open)}
                            aria-label="Toggle mobile menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {mobileOpen && (
                <div
                    dir="ltr"
                    className="fixed inset-x-0 z-[997] border-t border-slate-200 bg-white shadow-lg lg:hidden"
                    style={{ top: 'calc(var(--topbar-offset) + 90px)' }}
                >
                    <div className="mx-auto max-h-[calc(100svh-var(--topbar-offset)-90px)] w-full max-w-7xl overflow-y-auto px-4 py-4">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">
                                القائمة
                            </span>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
                                aria-label="Close mobile menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <ul className="flex flex-col items-stretch space-y-2">
                            {mainMenu.map((menuItem) => (
                                <li key={menuItem.link} className="w-full">
                                    <a
                                        href={menuItem.link}
                                        onClick={(event) => {
                                            if (
                                                menuItem.link === '/favorites'
                                            ) {
                                                void handleFavoritesNavigation(
                                                    event,
                                                );
                                            }
                                            setMobileOpen(false);
                                        }}
                                        className={`block rounded-2xl px-4 py-3 text-right text-base font-semibold text-gray-900 capitalize transition-all duration-300 hover:bg-orange-50 hover:text-color-primary ${
                                            url === menuItem.link
                                                ? 'text-color-primary'
                                                : ''
                                        }`}
                                    >
                                        {menuItem.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {auth?.user ? (
                                <>
                                    <a
                                        href="/student/profile"
                                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-color-primary bg-white px-4 py-3 text-center font-playpen-arabic text-color-primary transition-all duration-300 hover:bg-color-primary hover:text-white hover:shadow-xl"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        ملفي الشخصي
                                    </a>
                                    <a
                                        href="/student/dashboard"
                                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-color-primary bg-white px-4 py-3 text-center font-playpen-arabic text-color-primary transition-all duration-300 hover:bg-color-primary hover:text-white hover:shadow-xl"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        لوحة التحكم
                                    </a>
                                    <a
                                        href="/student/courses"
                                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-color-primary bg-white px-4 py-3 text-center font-playpen-arabic text-color-primary transition-all duration-300 hover:bg-color-primary hover:text-white hover:shadow-xl"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        الدورات
                                    </a>
                                    <button
                                        type="button"
                                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-color-primary bg-color-primary px-4 py-3 text-center font-playpen-arabic text-white transition-all duration-300 hover:bg-white hover:text-color-primary hover:shadow-xl"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            handleLogout();
                                        }}
                                    >
                                        تسجيل خروج
                                    </button>
                                </>
                            ) : (
                                <a
                                    href="/login"
                                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-color-primary bg-white px-4 py-3 text-center font-playpen-arabic text-color-primary transition-all duration-300 hover:bg-color-primary hover:text-white hover:shadow-xl"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {loginLabel}
                                </a>
                            )}
                            <a
                                href="/bookings"
                                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-color-primary bg-color-primary px-4 py-3 text-center font-playpen-arabic text-white transition-all duration-300 hover:bg-white hover:text-color-primary hover:shadow-xl"
                                onClick={() => setMobileOpen(false)}
                            >
                                {bookNowLabel}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div
                className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 transition-all duration-300 ${
                    isSearchOpen ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                <form
                    action="/search"
                    method="GET"
                    className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
                >
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 transition-colors hover:text-gray-700"
                        aria-label="Close search"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        name="search"
                        className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-color-primary focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full rounded-md bg-color-primary py-2 text-white transition-colors hover:bg-color-primary/90"
                    >
                        {searchButtonLabel}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Navbar;
