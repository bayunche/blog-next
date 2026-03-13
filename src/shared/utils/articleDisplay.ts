import { stripMarkdown } from './stripMarkdown';

export type CategoryInput = { name?: string | null } | string | null | undefined;

export interface ArticleCategorySource {
    category?: CategoryInput;
    categories?: Array<{ name?: string | null } | null> | null;
}

function normalizeName(name: string | null | undefined): string {
    return String(name || '').trim().replace(/\s+/g, ' ');
}

function resolveCategoryName(category: CategoryInput): string {
    return typeof category === 'string' ? category : category?.name || '';
}

export function getPrimaryCategory(
    source: ArticleCategorySource | CategoryInput
): { name: string } | null {
    const articleSource = source as ArticleCategorySource;
    const directName = normalizeName(resolveCategoryName(articleSource?.category));

    if (directName) {
        return { name: directName };
    }

    const firstCategory = Array.isArray(articleSource?.categories)
        ? articleSource.categories.find((item) => normalizeName(item?.name))
        : null;

    if (firstCategory?.name) {
        return { name: normalizeName(firstCategory.name) };
    }

    const fallbackName = normalizeName(resolveCategoryName(source as CategoryInput));
    return fallbackName ? { name: fallbackName } : null;
}

export function getDisplayCategoryName(category: CategoryInput): string {
    const normalized = normalizeName(resolveCategoryName(category));

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
