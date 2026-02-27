'use client';

import { FaPlay, FaMusic } from 'react-icons/fa';
import { useMusicStore, Track } from '@/shared/store/musicStore';
import { message } from 'antd';

interface ArticleMusicProps {
    musicId: string;
    musicName: string;
}

export const ArticleMusic = ({ musicId, musicName }: ArticleMusicProps) => {
    const { addAndPlay } = useMusicStore();

    const handlePlay = async () => {
        if (!musicId) return;
        const proxyUrl = `/api/music/proxy/${musicId}`;

        try {
            message.loading({ content: '正在加载音乐...', key: 'music_loading' });

            let playableUrl = proxyUrl;
            try {
                const response = await fetch(`/api/music/url/${musicId}`);
                const data = await response.json();
                if (data.code === 200 && data.data?.url) {
                    playableUrl = data.data.url;
                }
            } catch (error) {
                console.warn('预检音乐链接失败，回退到代理地址:', error);
            }

            const track: Track = {
                id: musicId,
                name: musicName.split(' - ')[0] || musicName,
                artist: musicName.split(' - ')[1] || '未知艺术家',
                url: playableUrl,
                // 封面尝试使用网易云默认接口，或者留空由播放器处理
                cover: 'https://p1.music.126.net/6y-UleORiau0SRBCYvvl9g==/109951164390552913.jpg',
            };

            addAndPlay(track);
            message.success({ content: '已同步至全局播放器', key: 'music_loading' });
        } catch (error) {
            console.error('播放文章音乐失败:', error);
            message.error({ content: '播放失败，请稍后重试', key: 'music_loading' });
        }
    };

    return (
        <div className="flex items-center justify-center mt-4 animate-fade-in">
            <button
                onClick={handlePlay}
                className="flex items-center gap-3 px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white border border-white/30 transition-all hover:scale-105 group"
            >
                <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full group-hover:rotate-12 transition-transform">
                    <FaPlay size={12} className="ml-0.5" />
                </div>
                <div className="text-left">
                    <p className="text-xs opacity-70 flex items-center gap-1">
                        <FaMusic size={10} /> 背景音乐
                    </p>
                    <p className="text-sm font-medium truncate max-w-[150px]">{musicName}</p>
                </div>
            </button>
        </div>
    );
};
