import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaGithub } from 'react-icons/fa';
import { siteProfile } from '@/shared/constants/siteProfile';

export function AuthorCard() {
    return (
        <section className="rounded-3xl border border-card-border/80 bg-card-bg/85 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-primary/20">
                    <Image
                        src={siteProfile.author.avatar}
                        alt={siteProfile.author.shortName}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                            Writer · Recorder
                        </p>
                        <h3 className="mt-2 text-2xl font-bold font-serif">{siteProfile.author.name}</h3>
                        <p className="mt-1 text-sm text-text-muted">
                            {siteProfile.author.role} · {siteProfile.author.location}
                        </p>
                    </div>

                    <p className="text-sm leading-7 text-text-muted">
                        {siteProfile.author.bio}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {siteProfile.capabilityTags.slice(0, 5).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-card-border px-3 py-1 text-xs text-text-muted"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex shrink-0 flex-col gap-3 md:min-w-[180px]">
                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                    >
                        看看我在写什么
                        <FaArrowRight size={12} />
                    </Link>
                    <a
                        href={siteProfile.socialLinks[0].href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-card-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-primary/30 hover:text-primary"
                    >
                        <FaGithub size={14} />
                        GitHub
                    </a>
                </div>
            </div>
        </section>
    );
}
