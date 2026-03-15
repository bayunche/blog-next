'use client';

import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { clsx } from 'clsx';

export const FloatingToolbar = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-40 sm:right-6 sm:bottom-6">
            <button
                onClick={scrollToTop}
                className={clsx(
                    'rounded-full p-3.5 shadow-lg transition-all motion-transition sm:p-4',
                    'bg-gradient-to-br from-blue-500 to-purple-500 text-white',
                    'hover:shadow-xl hover:scale-110',
                    showBackToTop
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                )}
                aria-label="Back to top"
            >
                <FaArrowUp size={18} className="sm:hidden" />
                <FaArrowUp size={20} className="hidden sm:block" />
            </button>
        </div>
    );
};
