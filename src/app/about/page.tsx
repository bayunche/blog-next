'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    FaGithub, FaTwitter, FaTelegram, FaEnvelope,
    FaCode, FaServer, FaDatabase, FaCloud, FaPalette,
    FaHeart, FaStar, FaMapMarkerAlt
} from 'react-icons/fa';
import { SiBilibili, SiReact, SiTypescript, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiMysql, SiDocker } from 'react-icons/si';

// 技能列表
const skills = [
    { name: 'React', icon: SiReact, color: 'text-cyan-500' },
    { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-600' },
    { name: 'Next.js', icon: SiNextdotjs, color: 'text-gray-800 dark:text-white' },
    { name: 'Tailwind', icon: SiTailwindcss, color: 'text-teal-500' },
    { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-600' },
    { name: 'MySQL', icon: SiMysql, color: 'text-blue-500' },
    { name: 'Docker', icon: SiDocker, color: 'text-sky-500' },
];

// 社交链接
const socialLinks = [
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com', color: 'hover:bg-gray-800' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com', color: 'hover:bg-sky-500' },
    { name: 'Telegram', icon: FaTelegram, href: 'https://t.me', color: 'hover:bg-blue-500' },
    { name: 'Bilibili', icon: SiBilibili, href: 'https://bilibili.com', color: 'hover:bg-pink-500' },
    { name: 'Email', icon: FaEnvelope, href: 'mailto:example@email.com', color: 'hover:bg-red-500' },
];

// 时间线
const timeline = [
    { year: '2024', title: '博客上线', desc: '使用 Sakurairo 主题搭建个人博客' },
    { year: '2023', title: '全栈开发', desc: '深入学习 Next.js 和后端开发' },
    { year: '2022', title: '前端入门', desc: '开始学习 React 和现代前端技术' },
    { year: '2021', title: '编程起步', desc: '踏入编程世界，学习基础知识' },
];

export default function AboutPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen pt-20">
            {/* 顶部背景装饰 */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-primary/20 via-pink-200/30 to-purple-200/20 dark:from-primary/10 dark:via-purple-900/20 dark:to-transparent -z-10" />

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* 个人信息卡片 */}
                <section className="relative bg-card-bg backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-card-border overflow-hidden animate-fade-in-up">
                    {/* 装饰背景 */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                        {/* 头像 */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity motion-transition" />
                            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white dark:border-gray-700 shadow-2xl overflow-hidden">
                                <Image
                                    src="/images/avatar.jpg"
                                    alt="头像"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform motion-transition-slow"
                                />
                            </div>
                        </div>

                        {/* 基本信息 */}
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                                八云澈
                            </h1>
                            <p className="text-lg text-text-muted mb-4 flex items-center justify-center md:justify-start gap-2">
                                <FaMapMarkerAlt className="text-primary" />
                                <span>中国 · 深圳</span>
                            </p>
                            <p className="text-base text-text-muted leading-relaxed max-w-md">
                                一个热爱技术和生活的开发者，喜欢探索新事物，
                                致力于创造美好的用户体验。
                            </p>

                            {/* 社交链接 */}
                            <div className="flex justify-center md:justify-start gap-3 mt-6">
                                {socialLinks.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-3 bg-card-border rounded-full text-foreground ${item.color} hover:text-white transition-all motion-transition hover:scale-110 hover:shadow-lg`}
                                        title={item.name}
                                    >
                                        <item.icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 技能标签 */}
                <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-2xl font-bold font-serif mb-6 flex items-center gap-3">
                        <FaCode className="text-primary" />
                        技术栈
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {skills.map((skill, index) => (
                            <div
                                key={skill.name}
                                className="flex items-center gap-3 px-5 py-3 bg-card-bg shadow-md border border-card-border hover:shadow-xl hover:-translate-y-1 transition-all motion-transition cursor-default rounded-2xl"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <skill.icon className={`text-2xl ${skill.color}`} />
                                <span className="font-medium">{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 时间线 */}
                <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl font-bold font-serif mb-6 flex items-center gap-3">
                        <FaStar className="text-primary" />
                        成长历程
                    </h2>
                    <div className="relative pl-8 border-l-2 border-primary/30">
                        {timeline.map((item, index) => (
                            <div key={item.year} className="relative mb-8 last:mb-0">
                                {/* 时间点 */}
                                <div className="absolute -left-[25px] w-4 h-4 bg-primary rounded-full border-4 border-background" />
                                {/* 内容 */}
                                <div className="bg-card-bg rounded-2xl p-5 shadow-lg border border-card-border hover:shadow-xl transition-shadow motion-transition">
                                    <span className="text-sm text-primary font-semibold">{item.year}</span>
                                    <h3 className="text-lg font-bold mt-1">{item.title}</h3>
                                    <p className="text-text-muted text-sm mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 关于博客 */}
                <section className="bg-card-bg rounded-3xl p-8 border border-card-border shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl font-bold font-serif mb-4 flex items-center gap-3">
                        <FaHeart className="text-pink-500" />
                        关于博客
                    </h2>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p>
                            这个博客使用 <strong>Sakurairo</strong> 主题风格搭建，基于 Next.js 和 React 构建，
                            后端使用 Node.js + Koa + MySQL。
                        </p>
                        <p>
                            在这里，我会分享技术文章、生活感悟和学习心得。希望能与更多志同道合的朋友交流学习。
                        </p>
                        <p>
                            如果你喜欢这个博客，欢迎在 GitHub 上给个 Star ⭐
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
