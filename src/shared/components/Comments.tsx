'use client';

import Giscus from '@giscus/react';
// 使用 ThemeProvider 中的主题状态
import { useEffect, useState } from 'react';

export default function Comments() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full mt-10 animate-fade-in-up">
            <Giscus
                id="comments"
                repo="user/repo" // TODO: Replace with user's repo
                repoId="R_kgDOG..." // TODO: Replace with user's repo ID
                category="Announcements"
                categoryId="DIC_kwDOG..."
                mapping="pathname"
                term="Welcome to my blog!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="light"
                lang="en"
                loading="lazy"
            />
        </div>
    );
}
