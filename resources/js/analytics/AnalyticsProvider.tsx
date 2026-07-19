import { router } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { initializeAnalytics } from './gtm';
import { sendPageView } from './events';

function buildLocationKey() {
    const location = window.location;
    return `${location.pathname}${location.search}${location.hash}`;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
    const lastTrackedLocationRef = useRef<string | null>(null);

    useEffect(() => {
        initializeAnalytics();

        const handleNavigation = () => {
            const locationKey = buildLocationKey();
            if (lastTrackedLocationRef.current === locationKey) {
                return;
            }

            lastTrackedLocationRef.current = locationKey;

            window.requestAnimationFrame(() => {
                sendPageView();
            });
        };

        const removeSuccessListener = router.on('success', handleNavigation);
        window.addEventListener('popstate', handleNavigation);
        window.addEventListener('hashchange', handleNavigation);

        handleNavigation();

        return () => {
            removeSuccessListener();
            window.removeEventListener('popstate', handleNavigation);
            window.removeEventListener('hashchange', handleNavigation);
        };
    }, []);

    return <>{children}</>;
}
