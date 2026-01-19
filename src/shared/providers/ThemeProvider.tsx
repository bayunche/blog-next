'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

// 预设主题色
export const themeColors = {
    sakura: { primary: '#ff6b9d', name: '樱花粉' },
    indigo: { primary: '#6366f1', name: '靛蓝' },
    emerald: { primary: '#10b981', name: '翠绿' },
    amber: { primary: '#f59e0b', name: '琥珀' },
    rose: { primary: '#f43f5e', name: '玫瑰红' },
    violet: { primary: '#8b5cf6', name: '紫罗兰' },
};

type ThemeColorKey = keyof typeof themeColors;

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    primaryColor: string;
    colorKey: ThemeColorKey;
    setPrimaryColor: (key: ThemeColorKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [colorKey, setColorKey] = useState<ThemeColorKey>('sakura');
    const [mounted, setMounted] = useState(false);

    // Load theme and color from localStorage on mount
    useEffect(() => {
        setMounted(true);

        // Load theme
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setThemeState(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState(prefersDark ? 'dark' : 'light');
        }

        // Load primary color
        const savedColor = localStorage.getItem('primaryColor') as ThemeColorKey | null;
        if (savedColor && themeColors[savedColor]) {
            setColorKey(savedColor);
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    // Apply primary color to CSS variables
    useEffect(() => {
        if (!mounted) return;

        const color = themeColors[colorKey].primary;
        document.documentElement.style.setProperty('--primary', color);
        document.documentElement.style.setProperty('--color-primary', color);
        localStorage.setItem('primaryColor', colorKey);
    }, [colorKey, mounted]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const setPrimaryColor = (key: ThemeColorKey) => {
        setColorKey(key);
    };

    const primaryColor = themeColors[colorKey].primary;

    return (
        <ThemeContext.Provider value={{
            theme,
            toggleTheme,
            setTheme,
            primaryColor,
            colorKey,
            setPrimaryColor
        }}>
            {children}
        </ThemeContext.Provider>
    );
}
