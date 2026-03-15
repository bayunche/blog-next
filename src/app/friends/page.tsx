import Image from 'next/image';
import { friendAvatarColors, friendLinkGroups } from '@/shared/constants/friends';
import { siteProfile } from '@/shared/constants/siteProfile';

export default function FriendsPage() {
    return (
        <div className="min-h-screen pt-20">
            <div className="bg-gradient-to-br from-primary/10 via-pink-100/20 to-purple-100/10 py-16 dark:from-primary/5 dark:via-purple-900/10 dark:to-transparent">
                <div className="mx-auto max-w-6xl space-y-4 px-4 text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                        Around The Web
                    </p>
                    <h1 className="text-3xl font-bold font-serif sm:text-4xl">友情链接</h1>
                    <p className="mx-auto max-w-3xl text-sm leading-7 text-text-muted">
                        这里放的是我愿意长期回访的站点。有的是技术博客，有的是阅读、生活和写作记录；它们让我觉得，互联网依然保留着认真表达的温度。
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
                <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                    <div className="rounded-[2rem] border border-card-border bg-card-bg/85 p-5 shadow-sm backdrop-blur-sm sm:p-8">
                        <h2 className="text-2xl font-bold font-serif">本站友链信息</h2>
                        <p className="mt-4 text-sm leading-8 text-text-muted">
                            {siteProfile.friendExchange.summary}
                        </p>
                        <div className="mt-6 space-y-3 text-sm text-text-muted">
                            <p><span className="font-medium text-foreground">博客名：</span>{siteProfile.siteName}</p>
                            <p><span className="font-medium text-foreground">定位：</span>{siteProfile.tagline}</p>
                            <p><span className="font-medium text-foreground">作者：</span>{siteProfile.author.name}</p>
                            <p><span className="font-medium text-foreground">链接：</span>/</p>
                        </div>
                        <p className="mt-5 text-sm leading-7 text-text-muted">
                            如果你也在认真更新自己的站点，不管主要写技术、读书还是生活记录，都欢迎来交换友链。
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-card-border bg-card-bg/85 p-5 shadow-sm backdrop-blur-sm sm:p-8">
                        <h2 className="text-2xl font-bold font-serif">申请友链条件</h2>
                        <p className="mt-4 text-sm leading-7 text-text-muted">
                            不要求风格一致，只希望彼此都在持续写作，也愿意让自己的站点保留一点真实和温度。
                        </p>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-text-muted">
                            {siteProfile.friendExchange.requirements.map((item) => (
                                <li key={item}>- {item}</li>
                            ))}
                        </ul>

                        <div className="mt-6 rounded-2xl bg-background/50 p-4 text-left font-mono text-sm text-text-muted">
                            {siteProfile.friendExchange.applicationTemplate.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>
                    </div>
                </section>

                {friendLinkGroups.map((group) => (
                    <section key={group.title} className="space-y-5">
                        <div>
                            <h2 className="text-2xl font-bold font-serif">{group.title}</h2>
                            <p className="mt-2 text-sm leading-7 text-text-muted">
                                {group.description}
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                            {group.links.map((friend, index) => (
                                <a
                                    key={friend.name}
                                    href={friend.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block rounded-3xl border border-card-border bg-card-bg/85 p-6 shadow-sm transition-all motion-transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                                >
                                    <div className="mb-4 flex items-center gap-4">
                                        <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full ${friendAvatarColors[index % friendAvatarColors.length]} text-2xl font-bold text-white`}>
                                            {friend.avatar ? (
                                                <Image
                                                    src={friend.avatar}
                                                    alt={friend.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : null}
                                            <span className="z-0">{friend.name.charAt(0)}</span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                                                {friend.name}
                                            </h3>
                                            <p className="max-w-[180px] truncate text-sm text-text-muted">
                                                {friend.url.replace(/^https?:\/\//, '')}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="line-clamp-2 text-sm leading-7 text-text-muted">
                                        {friend.description}
                                    </p>

                                    <div className="mt-4 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                        去逛逛 →
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
