export const LOCAL_BACKGROUND_IMAGE = '/images/background.jpg';

export const EXTERNAL_BACKGROUND_FALLBACKS = [
    'https://api.dujin.org/bing/1920.php',
    'https://picsum.photos/1920/1080',
];

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

