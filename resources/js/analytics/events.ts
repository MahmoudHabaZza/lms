import { ensureDataLayer, type AnalyticsPayload } from './gtm';

export interface PageViewPayload extends AnalyticsPayload {
    event: 'page_view';
    page_title: string;
    page_location: string;
    page_path: string;
    referrer: string;
}

export interface AnalyticsEventPayload extends AnalyticsPayload {
    event: string;
}

function pushToDataLayer(payload: AnalyticsPayload): void {
    ensureDataLayer();
    window.dataLayer.push(payload);
}

export function sendPageView(pageViewPayload: Partial<PageViewPayload> = {}): void {
    const location = window.location;
    const payload: PageViewPayload = {
        event: 'page_view',
        page_title: document.title || '',
        page_location: location.href,
        page_path: `${location.pathname}${location.search}${location.hash}`,
        referrer: document.referrer || '',
        ...pageViewPayload,
    };

    pushToDataLayer(payload);
}

export function sendEvent(eventName: string, payload: Record<string, unknown> = {}): void {
    pushToDataLayer({
        event: eventName,
        ...payload,
    });
}

export function identifyUser(userId: string, properties: Record<string, unknown> = {}): void {
    pushToDataLayer({
        event: 'user_identified',
        user_id: userId,
        ...properties,
    });
}

export function setUserProperties(properties: Record<string, unknown> = {}): void {
    pushToDataLayer({
        event: 'user_properties_set',
        user_properties: properties,
    });
}

export function resetUser(): void {
    pushToDataLayer({
        event: 'user_reset',
        user_id: null,
    });
}

export function trackButtonClick(label: string, payload: Record<string, unknown> = {}): void {
    sendEvent('button_click', {
        element_type: 'button',
        label,
        ...payload,
    });
}

export function trackFormSubmission(formName: string, payload: Record<string, unknown> = {}): void {
    sendEvent('form_submit', {
        form_name: formName,
        ...payload,
    });
}

export function trackLogin(method: string, payload: Record<string, unknown> = {}): void {
    sendEvent('login', {
        method,
        ...payload,
    });
}

export function trackLogout(method: string, payload: Record<string, unknown> = {}): void {
    sendEvent('logout', {
        method,
        ...payload,
    });
}

export function trackRegistration(method: string, payload: Record<string, unknown> = {}): void {
    sendEvent('registration', {
        method,
        ...payload,
    });
}

export function trackPurchase(value: number, currency = 'USD', payload: Record<string, unknown> = {}): void {
    sendEvent('purchase', {
        value,
        currency,
        ...payload,
    });
}

export function trackSearch(term: string, payload: Record<string, unknown> = {}): void {
    sendEvent('search', {
        search_term: term,
        ...payload,
    });
}

export function trackFilter(filterName: string, value: string, payload: Record<string, unknown> = {}): void {
    sendEvent('filter', {
        filter_name: filterName,
        filter_value: value,
        ...payload,
    });
}

export function trackVideoPlay(videoName: string, payload: Record<string, unknown> = {}): void {
    sendEvent('video_play', {
        video_name: videoName,
        ...payload,
    });
}

export function trackFileDownload(fileName: string, payload: Record<string, unknown> = {}): void {
    sendEvent('file_download', {
        file_name: fileName,
        ...payload,
    });
}

export function trackOutboundLink(url: string, payload: Record<string, unknown> = {}): void {
    sendEvent('outbound_link_click', {
        link_url: url,
        ...payload,
    });
}
