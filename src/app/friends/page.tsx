'use client';

import Image from 'next/image';
import Head from 'next/head';

// 友链数据类型
interface FriendLink {
    name: string;
    url: string;
    avatar: string;
    description: string;
}

// 示例友链数据（后续可从 API 获取）
const friendLinks: FriendLink[] = [
    {
        name: 'Fuukei',
        url: 'https://docs.fuukei.org',
        avatar: 'https://docs.fuukei.org/logo.png',
        description: 'Sakurairo 主题官方文档',
    },
    {
        name: '明日が来ると',
        url: 'https://kiseki.blog',
        avatar: 'https://kiseki.blog/avatar.jpg',
        description: '信じてること自体が希望なんだ',
    },
    {
        name: 'Mashiro',
        url: 'https://2heng.xin',
        avatar: 'https://2heng.xin/avatar.jpg',
        description: 'Sakura Theme 主题作者',
    },
];

// 随机颜色（用于头像备用背景）
const colors = [
    'bg-pink-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-green-500',
    'bg-orange-500',
];

export default function FriendsPage() {
    return (
        <div className="min-h-screen">
            {/* 页面头部 */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl font-bold font-serif mb-4">友情链接</h1>
                    <p className="text-lg text-text-muted">
                        在这里遇见更多有趣的人 ✨
                    </p>
                </div>
            </div>

            {/* 友链卡片网格 */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {friendLinks.map((friend, index) => (
                        <a
                            key={friend.name}
                            href={friend.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-6 bg-card-bg rounded-2xl border border-card-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {/* 头像 */}
                                <div className={`relative w-16 h-16 rounded-full overflow-hidden ${colors[index % colors.length]} flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
                                    {friend.avatar ? (
                                        <Image
                                            src={friend.avatar}
                                            alt={friend.name}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                    <span className="z-0">{friend.name.charAt(0)}</span>
                                </div>

                                {/* 名称 */}
                                <div>
                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                        {friend.name}
                                    </h3>
                                    <p className="text-sm text-text-muted truncate max-w-[180px]">
                                        {friend.url.replace(/^https?:\/\//, '')}
                                    </p>
                                </div>
                            </div>

                            {/* 描述 */}
                            <p className="text-sm text-text-muted line-clamp-2">
                                {friend.description}
                            </p>

                            {/* 悬停指示器 */}
                            <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>访问 →</span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* 申请友链提示 */}
                <div className="mt-16 text-center p-8 bg-card-bg/50 rounded-2xl border border-card-border">
                    <h2 className="text-2xl font-bold mb-4">🤝 想和我交换友链？</h2>
                    <p className="text-text-muted mb-6 max-w-lg mx-auto">
                        欢迎各位博主申请友链！请在下方评论区留下你的博客信息，格式如下：
                    </p>
                    <div className="bg-background/50 rounded-lg p-4 text-left max-w-md mx-auto text-sm font-mono">
                        <p>名称：你的博客名称</p>
                        <p>链接：https://你的博客地址</p>
                        <p>头像：头像图片链接</p>
                        <p>描述：一句话介绍</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
