import { getDisplayCategoryName } from '@/shared/utils/articleDisplay';

export interface CategoryMeta {
    description: string;
    accentClass: string;
    note: string;
}

const categoryMetaMap: Record<string, CategoryMeta> = {
    java: {
        description: '围绕 Java 服务端开发、设计思路和工程实践展开。',
        accentClass: 'from-amber-400/25 via-orange-400/10 to-transparent',
        note: '适合想系统补齐服务端基础与落地经验的读者。',
    },
    go: {
        description: '聚焦 Go 语言的并发模型、工程化实践和工具链。',
        accentClass: 'from-cyan-400/25 via-sky-400/10 to-transparent',
        note: '偏重高性能服务和轻量化工程经验。',
    },
    electron: {
        description: '记录 Electron 桌面端项目中的架构、交互和性能优化。',
        accentClass: 'from-violet-400/25 via-fuchsia-400/10 to-transparent',
        note: '适合正在做桌面端产品或跨端项目的读者。',
    },
    前端: {
        description: '关注前端交互体验、组件设计与页面性能优化。',
        accentClass: 'from-pink-400/25 via-rose-400/10 to-transparent',
        note: '既有基础经验，也会记录工程化和设计取舍。',
    },
    网络安全: {
        description: '沉淀安全方向的学习笔记、观察和阶段性总结。',
        accentClass: 'from-emerald-400/25 via-green-400/10 to-transparent',
        note: '偏向入门整理与问题意识建立。',
    },
    生活: {
        description: '记录阶段性的生活、兴趣和写作背后的心境变化。',
        accentClass: 'from-rose-300/25 via-pink-300/10 to-transparent',
        note: '让技术之外的自己，也能在这里留下痕迹。',
    },
    读书: {
        description: '把阅读中的触动、摘记和当下的理解慢慢记下来。',
        accentClass: 'from-indigo-300/25 via-sky-300/10 to-transparent',
        note: '这里更像读完书之后的一段延迟对话，而不是标准书评。',
    },
    日常: {
        description: '放一些没有明确类型，却很像真实生活本身的内容。',
        accentClass: 'from-amber-300/25 via-orange-300/10 to-transparent',
        note: '有时候只是想把一个瞬间留下来。',
    },
    随笔: {
        description: '放一些不必太正式，但值得记下来的想法和经验。',
        accentClass: 'from-purple-300/25 via-indigo-300/10 to-transparent',
        note: '适合快速浏览，也适合在碎片时间翻看。',
    },
    未分类: {
        description: '暂时还没有归入明确专题，但依然值得保留和阅读。',
        accentClass: 'from-slate-300/25 via-slate-200/10 to-transparent',
        note: '后续会继续整理分类，让内容结构更清晰。',
    },
};

const normalizeKey = (name: string) => name.trim().toLowerCase();

export function getCategoryMeta(categoryName: string): CategoryMeta {
    const displayName = getDisplayCategoryName(categoryName);
    const directMatch = categoryMetaMap[displayName] || categoryMetaMap[normalizeKey(displayName)];

    if (directMatch) {
        return directMatch;
    }

    return {
        description: `这里收录所有与「${displayName}」相关的文章，适合按专题连续阅读。`,
        accentClass: 'from-primary/20 via-pink-200/10 to-transparent',
        note: '如果你刚好对这个方向感兴趣，可以从最新文章开始看起。',
    };
}
