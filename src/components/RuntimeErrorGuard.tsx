'use client';

import { useEffect } from 'react';

const RECOVERY_FLAG_KEY = '__runtime_removechild_recovered__';

export const RuntimeErrorGuard = () => {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            const message = `${event.message || ''} ${(event.error as Error | undefined)?.message || ''}`.toLowerCase();
            const isRemoveChildCrash = message.includes('removechild') && message.includes('null');
            if (!isRemoveChildCrash) return;

            const currentPath = window.location.pathname || '/';
            const recoveredPath = sessionStorage.getItem(RECOVERY_FLAG_KEY);
            if (recoveredPath === currentPath) return;

            sessionStorage.setItem(RECOVERY_FLAG_KEY, currentPath);
            window.location.reload();
        };

        window.addEventListener('error', handleError);
        return () => {
            window.removeEventListener('error', handleError);
        };
    }, []);

    return null;
};
