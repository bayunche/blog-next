import { stripMarkdown } from './stripMarkdown';

type CategoryInput = { name?: string | null } | string | null | undefined;

export function getDisplayCategoryName(category: CategoryInput): string {
    const name = typeof category === 'string' ? category : category?.name;
    const normalized = String(name || '').trim();

    if (!normalized || normalized.toLowerCase() === 'uncategorized') {
        return '未分类';
    }

    return normalized;
}

export function isUncategorized(category: CategoryInput): boolean {
    return getDisplayCategoryName(category) === '未分类';
}

export function shouldShowCommentCount(count?: number | null): boolean {
    return Number(count || 0) > 0;
}

export function estimateReadingMinutes(content: string): number {
    const cleanText = stripMarkdown(content).replace(/\s+/g, '');
    const charsPerMinute = 520;
    return Math.max(1, Math.ceil(cleanText.length / charsPerMinute));
}
