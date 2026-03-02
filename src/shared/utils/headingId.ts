export function normalizeHeadingText(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .replace(/[`*_~[\]()>#+.!?,:;'"\\/]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export function createHeadingIdResolver() {
    const seen = new Map<string, number>();

    return (rawText: string) => {
        const base = normalizeHeadingText(rawText) || 'section';
        const current = seen.get(base) || 0;
        seen.set(base, current + 1);
        return current === 0 ? base : `${base}-${current}`;
    };
}
