export const LOCAL_BACKGROUND_IMAGE = '/images/background.jpg';

export const EXTERNAL_BACKGROUND_FALLBACKS = [
    'https://api.dujin.org/bing/1920.php',
    'https://picsum.photos/1920/1080',
];

declare global {
    interface Window {
        __SAKURAIRO_PAGE_BG__?: string;
    }
}

const ALL_BACKGROUND_SOURCES = [LOCAL_BACKGROUND_IMAGE, ...EXTERNAL_BACKGROUND_FALLBACKS];

function withCacheBust(url: string): string {
    if (!/^https?:\/\//i.test(url)) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
}

/**
 * Pick one background source randomly.
 * Local image keeps stable URL, external sources add cache-busting query.
 */
export function getRandomBackgroundSource(): string {
    const index = Math.floor(Math.random() * ALL_BACKGROUND_SOURCES.length);
    const selected = ALL_BACKGROUND_SOURCES[index] || LOCAL_BACKGROUND_IMAGE;
    return withCacheBust(selected);
}

/**
 * Keep one random background for current page lifecycle,
 * so different components can share the same random image.
 */
export function getPageScopedBackgroundSource(): string {
    if (typeof window === 'undefined') return LOCAL_BACKGROUND_IMAGE;
    if (!window.__SAKURAIRO_PAGE_BG__) {
        window.__SAKURAIRO_PAGE_BG__ = getRandomBackgroundSource();
    }
    return window.__SAKURAIRO_PAGE_BG__;
}

/**
 * Build CSS background-image value.
 * Order: primary -> local fallback -> external fallbacks.
 * Example output: url("a"), url("b"), url("c")
 */
export function buildBackgroundImageValue(primary?: string | null): string {
    const urls = [primary, LOCAL_BACKGROUND_IMAGE, ...EXTERNAL_BACKGROUND_FALLBACKS]
        .filter((v): v is string => !!v)
        .filter((v, i, arr) => arr.indexOf(v) === i);

    return urls.map((url) => `url("${url}")`).join(', ');
}
