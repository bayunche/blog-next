'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    THEME_MEDIA_QUERY,
    ThemePreference,
    applyResolvedTheme,
    clearPersistedThemePreference,
    persistThemePreference,
    readStoredThemePreference,
    resolveTheme,
} from '@/shared/theme/theme';

interface ThemeContextValue {
    preference: ThemePreference;
    resolvedTheme: 'light' | 'dark';
    setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [preference, setPreferenceState] = useState<ThemePreference>(() => readStoredThemePreference());
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => resolveTheme(readStoredThemePreference()));

    const setPreference = (nextPreference: ThemePreference) => {
        const nextResolvedTheme = resolveTheme(nextPreference);
        setPreferenceState(nextPreference);
        setResolvedTheme(nextResolvedTheme);
        applyResolvedTheme(nextResolvedTheme);

        if (nextPreference === 'system') {
            clearPersistedThemePreference();
            return;
        }

        persistThemePreference(nextPreference);
    };

    useEffect(() => {
        applyResolvedTheme(resolvedTheme);
    }, [resolvedTheme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);
        const handleChange = () => {
            if (preference === 'system') {
                const nextResolvedTheme = resolveTheme('system');
                setResolvedTheme(nextResolvedTheme);
                applyResolvedTheme(nextResolvedTheme);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [preference]);

    return (
        <ThemeContext.Provider
            value={{
                preference,
                resolvedTheme,
                setPreference,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }

    return context;
}
