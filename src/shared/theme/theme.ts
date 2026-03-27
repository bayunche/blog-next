export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'sakurairo-theme';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
    return value === 'system' || value === 'light' || value === 'dark';
}

export function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
    if (preference === 'system') {
        return getSystemTheme();
    }

    return preference;
}

export function applyResolvedTheme(theme: ResolvedTheme) {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.classList.toggle('dark', theme === 'dark');
}

export function readStoredThemePreference(): ThemePreference {
    if (typeof window === 'undefined') {
        return 'system';
    }

    try {
        const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
        return isThemePreference(storedValue) ? storedValue : 'system';
    } catch {
        return 'system';
    }
}

export function persistThemePreference(preference: ThemePreference) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
        // Ignore storage failures and keep the active theme in memory.
    }
}

export function clearPersistedThemePreference() {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
        // Ignore storage failures and fall back to runtime-only behavior.
    }
}

export function getThemeBootstrapScript() {
    return `
(() => {
  const storageKey = '${THEME_STORAGE_KEY}';
  const mediaQuery = '${THEME_MEDIA_QUERY}';
  const isThemePreference = (value) => value === 'system' || value === 'light' || value === 'dark';

  let preference = 'system';

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (isThemePreference(storedValue)) {
      preference = storedValue;
    }
  } catch {}

  const resolvedTheme = preference === 'system'
    ? (window.matchMedia(mediaQuery).matches ? 'dark' : 'light')
    : preference;

  const root = document.documentElement;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
  root.classList.toggle('dark', resolvedTheme === 'dark');
})();
    `.trim();
}
