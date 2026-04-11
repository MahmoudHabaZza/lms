export const API_BASE = import.meta.env.VITE_APP_API_URL || '';

async function request(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem('api_token');

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/api/v1${path}`, {
        credentials: 'same-origin',
        ...options,
        headers,
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        const json = await res.json();
        if (!res.ok) throw json;
        return json;
    }

    if (!res.ok) throw new Error(res.statusText);
    return null;
}

export const api = {
    get: (path: string) => request(path, { method: 'GET' }),
    post: (path: string, body?: any) => request(path, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),
    put: (path: string, body?: any) => request(path, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),
    del: (path: string) => request(path, { method: 'DELETE' }),
};
