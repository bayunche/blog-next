export const MOTION = {
    durationMs: {
        micro: 100,
        fast: 180,
        normal: 300,
        slow: 500,
        enter: 800,
    },
    easing: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    },
    hero: {
        backgroundFadeRatio: 0.8,
        contentFadeRatio: 0.6,
        contentOffsetFactor: 0.4,
        contentScaleMin: 0.8,
        contentScaleDivisor: 3000,
        overlayMaxOpacity: 0.95,
        backgroundScaleRange: 0.05,
        backgroundBlurMaxPx: 2,
        backgroundOpacityDrop: 0.2,
        contrastBoostPercent: 50,
        brightnessBoostPercent: 20,
    },
} as const;

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function getScrollProgress(scrollY: number, viewportHeight: number, ratio: number): number {
    if (viewportHeight <= 0 || ratio <= 0) {
        return 0;
    }
    return clamp(scrollY / (viewportHeight * ratio), 0, 1);
}
