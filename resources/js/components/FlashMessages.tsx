import { usePage } from '@inertiajs/react';
import React, { useEffect, useState, useCallback } from 'react';

export default function FlashMessages() {
    const { flash } = usePage().props as any;
    const [visible, setVisible] = useState(true);

    // Reset visibility when flash messages change
    useEffect(() => {
        setVisible(true);

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, [flash?.success, flash?.error]);

    const handleClose = useCallback(() => setVisible(false), []);

    if (!flash || !visible) return null;

    const isError = !!flash.error;
    const message = flash.success || flash.error;
    const bgColor = isError ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100';
    const textColor = isError ? 'text-red-800' : 'text-green-800';
    const hoverColor = isError ? 'hover:text-red-800' : 'hover:text-green-600';
    const closeColor = isError ? 'text-red-600' : 'text-green-600';

    return (
        <div className="mb-4">
            <div className={`relative rounded-md border ${bgColor} p-3 ${textColor}`}>
                <button
                    aria-label="Close"
                    onClick={handleClose}
                    className={`absolute top-1 right-1 ${closeColor} ${hoverColor}`}
                >
                    ×
                </button>
                {message}
            </div>
        </div>
    );
}
