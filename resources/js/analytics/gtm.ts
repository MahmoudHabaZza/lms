declare global {
    interface Window {
        dataLayer: unknown[];
        gtag?: (...args: unknown[]) => void;
        __kidCoderAnalyticsInitialized?: boolean;
    }
}

export interface AnalyticsPayload extends Record<string, unknown> {
    event?: string;
}

export const ANALYTICS_CONTAINER_ID = import.meta.env.VITE_GTM_ID || 'GTM-MGZPCH98';

export function ensureDataLayer(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!Array.isArray(window.dataLayer)) {
        window.dataLayer = [];
    }
}

export function initializeAnalytics(): void {
    if (typeof window === 'undefined') {
        return;
    }

    ensureDataLayer();

    if (window.__kidCoderAnalyticsInitialized) {
        return;
    }

    const gtmId = ANALYTICS_CONTAINER_ID;

    if (!document.getElementById('gtm-script')) {
        const gtmScript = document.createElement('script');
        gtmScript.id = 'gtm-script';
        gtmScript.async = true;
        gtmScript.textContent = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
        `;
        document.head.appendChild(gtmScript);
    }

    if (!document.getElementById('gtm-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'gtm-noscript';
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.appendChild(noscript);
    }

    window.__kidCoderAnalyticsInitialized = true;
}
