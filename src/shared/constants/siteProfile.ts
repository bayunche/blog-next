export type SocialPlatform = 'github' | 'repo';

export interface SocialLink {
    platform: SocialPlatform;
    label: string;
    href: string;
}

export interface TopicConfig {
    name: string;
    href: string;
    description: string;
    matchNames: string[];
}

export interface WritingDimension {
    title: string;
    description: string;
    note: string;
}

export const siteProfile = {
    siteName: '落樱轻声',
    siteNameEn: 'Sakura Whispers',
    tagline: '记录开发、阅读和生活里的学习、体会与小日常',
    description: '这里会写技术，也会写读书心得、生活片段、阶段性困惑和那些不想被匆匆略过的普通时刻。',
    metadataDescription: '一个同时记录开发、阅读、生活与日常心绪的个人博客。',
    author: {
        name: '八云澈（Bayunche）',
        shortName: '八云澈',
        role: '开发者 / 写作者 / 普通生活记录者',
        location: '中国 · 深圳',
        avatar: '/images/avatar.jpg',
        bio: '喜欢把工作里的技术问题、读书时的触动、生活中的琐碎观察慢慢写下来。既想把复杂问题讲清楚，也想留住那些很快会被忘掉的日常。',
    },
    heroBadges: ['技术', '阅读', '生活', '日常'],
    capabilityTags: ['Java 后端', 'Go 工程化', '读书札记', '生活记录', '日常随笔'],
    writingDimensions: [
        {
            title: '技术笔记',
            description: '写工作中遇到的问题、解决路径、原理整理，也写那些真正踩过的坑。',
            note: '希望未来的自己或别人再遇到时，能少走一点弯路。',
        },
        {
            title: '读书心得',
            description: '不追求像书评那样完整，更像把读到的一句、一个观点和它触动我的地方记下来。',
            note: '读书对我来说，是跟另一个人安静地聊一会儿天。',
        },
        {
            title: '生活片段',
            description: '写下普通日子里偶尔闪过的念头：散步、天气、城市、心情，以及一些说不清的瞬间。',
            note: '这些内容不一定有结论，但很像真实生活本身。',
        },
        {
            title: '日常随笔',
            description: '允许自己不那么“有用”地写一点东西，把那些尚未成熟的想法先放在这里。',
            note: '有时候写下来，本身就是理解自己的过程。',
        },
    ] satisfies WritingDimension[],
    currentFocus: [
        {
            title: '把博客写得更像人',
            description: '不只谈技术结论，也谈感受、动机、阶段状态和写作时的真实处境。',
        },
        {
            title: '保留读书与生活入口',
            description: '让这个站点除了代码和问题单，也能放下阅读、生活和日常心绪。',
        },
        {
            title: '慢慢积累长期表达',
            description: '希望这里几年后回头看，能看见一个人而不是一堆冷冰冰的文章。',
        },
    ],
    currentMoments: [
        {
            title: '最近在读',
            description: '一些和写作、理解世界、理解自己有关的书，也读技术之外的东西。',
        },
        {
            title: '最近在想',
            description: '怎样把工作里的紧绷感，慢慢变成更稳一点的日常节奏。',
        },
        {
            title: '最近想写',
            description: '除了项目经验，也想多写点读书时被击中的句子和生活里的细小感受。',
        },
    ],
    homeCtas: [
        { label: '从这里开始看', href: '#featured', style: 'primary' as const },
        { label: '查看最新文章', href: '#latest', style: 'secondary' as const },
        { label: '认识作者', href: '/about', style: 'ghost' as const },
    ],
    socialLinks: [
        {
            platform: 'github' as const,
            label: 'GitHub',
            href: 'https://github.com/bayunche',
        },
        {
            platform: 'repo' as const,
            label: '博客仓库',
            href: 'https://github.com/bayunche/blog-next',
        },
    ],
    topics: [
        {
            name: 'Java',
            href: '/categories/Java',
            description: '以服务端开发、设计思路和实战拆解为主。',
            matchNames: ['java'],
        },
        {
            name: 'Go',
            href: '/categories/Go',
            description: '关注并发模型、工程实践和工具链整理。',
            matchNames: ['go', 'golang'],
        },
        {
            name: 'Electron',
            href: '/categories/Electron',
            description: '记录桌面应用开发中的架构、性能与踩坑。',
            matchNames: ['electron'],
        },
        {
            name: '前端',
            href: '/categories/%E5%89%8D%E7%AB%AF',
            description: '聚焦交互体验、组件设计与性能优化。',
            matchNames: ['前端', 'frontend', 'web前端'],
        },
        {
            name: '网络安全',
            href: '/categories/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8',
            description: '沉淀学习笔记和安全方向的观察。',
            matchNames: ['网络安全', '安全', 'security'],
        },
        {
            name: '生活',
            href: '/categories/%E7%94%9F%E6%B4%BB',
            description: '记录那些没有标准答案，但值得慢慢写下来的日子。',
            matchNames: ['生活', 'life'],
        },
        {
            name: '读书',
            href: '/tags/%E8%AF%BB%E4%B9%A6',
            description: '放一些阅读中的摘记、触动与并不完整的思考。',
            matchNames: ['读书', '阅读', 'book', 'books'],
        },
    ] satisfies TopicConfig[],
    friendExchange: {
        summary: '如果你也认真写博客，欢迎互换友链，一起把写作这件事坚持下去。',
        requirements: [
            '站点可稳定访问，加载速度正常。',
            '内容以原创或认真整理的转载为主。',
            '有清晰的关于页或作者介绍。',
            '无大面积广告、采集或低质量内容。',
        ],
        applicationTemplate: [
            '名称：你的博客名称',
            '链接：你的博客首页地址',
            '头像：头像图片链接',
            '描述：一句话介绍你的博客',
        ],
    },
};

export const siteLinks = {
    home: '/',
    posts: '/posts',
    about: '/about',
    archives: '/archives',
    friends: '/friends',
    topics: '/#topics',
};
