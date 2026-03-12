export interface TagMeta {
    description: string;
    relatedTags: string[];
}

const tagMetaMap: Record<string, TagMeta> = {
    java: {
        description: '与 Java 语言、生态和服务端实践相关的内容聚合。',
        relatedTags: ['Spring', 'JVM', '后端'],
    },
    go: {
        description: '围绕 Go 语言、并发与工程实践的标签集合。',
        relatedTags: ['Golang', '并发', '微服务'],
    },
    electron: {
        description: '桌面端开发、跨端体验和工程化落地的相关文章。',
        relatedTags: ['桌面端', '性能优化', '前端'],
    },
    前端: {
        description: '前端交互、组件设计、工程化与页面性能的集合页。',
        relatedTags: ['React', 'TypeScript', '性能优化'],
    },
    react: {
        description: 'React 相关实践、组件设计和页面体验优化的内容集合。',
        relatedTags: ['前端', 'TypeScript', 'Next.js'],
    },
    typescript: {
        description: 'TypeScript 在业务建模、工具链和组件开发中的经验整理。',
        relatedTags: ['React', '工程化', '前端'],
    },
    读书: {
        description: '放一些读书摘记、阅读时的触动，以及还没被完全想清楚的想法。',
        relatedTags: ['随笔', '生活', '思考'],
    },
    阅读: {
        description: '记录阅读中的句子、观点和它们与当下生活发生连接的瞬间。',
        relatedTags: ['读书', '随笔', '生活'],
    },
    生活: {
        description: '关于生活节奏、情绪变化和普通日常的关键词聚合。',
        relatedTags: ['日常', '随笔', '阅读'],
    },
    日常: {
        description: '一些没有宏大主题，却足够真实的小事与片段。',
        relatedTags: ['生活', '随笔', '读书'],
    },
    随笔: {
        description: '没有那么正式，但很诚实地记录下来的想法。',
        relatedTags: ['生活', '日常', '读书'],
    },
};

export function getTagMeta(tagName: string): TagMeta {
    const normalized = tagName.trim().toLowerCase();

    return categoryOrFallback(tagMetaMap[normalized], tagName);
}

function categoryOrFallback(meta: TagMeta | undefined, tagName: string): TagMeta {
    if (meta) {
        return meta;
    }

    return {
        description: `这里汇总了所有和「${tagName}」相关的文章，适合按关键词快速查找内容。`,
        relatedTags: [],
    };
}
