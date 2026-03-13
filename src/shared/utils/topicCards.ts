import type { Category } from '@/shared/api/category';
import { getCategoryMeta } from '@/shared/constants/categoryMeta';
import { getDisplayCategoryName } from '@/shared/utils/articleDisplay';

export interface TopicCardData {
    rawName: string;
    displayName: string;
    href: string;
    description: string;
    note: string;
    accentClass: string;
    count: number;
}

function normalizeName(name: string | null | undefined): string {
    return String(name || '').trim().replace(/\s+/g, ' ');
}

export function buildTopicCards(categories: Category[], limit?: number): TopicCardData[] {
    const merged = new Map<
        string,
        {
            rawName: string;
            displayName: string;
            count: number;
        }
    >();

    for (const category of categories || []) {
        const rawName = normalizeName(category?.name);
        if (!rawName) continue;

        const displayName = getDisplayCategoryName(rawName);
        const key = displayName.toLowerCase();
        const current = merged.get(key);

        if (current) {
            current.count += Number(category?.count || 0);
            continue;
        }

        merged.set(key, {
            rawName,
            displayName,
            count: Number(category?.count || 0),
        });
    }

    const sorted = Array.from(merged.values()).sort((left, right) => {
        if (right.count !== left.count) {
            return right.count - left.count;
        }

        return left.displayName.localeCompare(right.displayName, 'zh-Hans-CN');
    });

    const finalList = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

    return finalList.map((item) => {
        const meta = getCategoryMeta(item.rawName);
        return {
            rawName: item.rawName,
            displayName: item.displayName,
            href: `/categories/${encodeURIComponent(item.rawName)}`,
            description: meta.description,
            note: meta.note,
            accentClass: meta.accentClass,
            count: item.count,
        };
    });
}
