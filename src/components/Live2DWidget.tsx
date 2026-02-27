'use client';

import { useEffect, useRef, useState } from 'react';
import { FaComment, FaTimes, FaRandom, FaCamera, FaInfoCircle } from 'react-icons/fa';
import { clsx } from 'clsx';

// Live2D 消息列表
const messages = [
    '欢迎来到我的博客！(｡･ω･｡)ﾉ♡',
    '今天也要开心哦！٩(◕‿◕｡)۶',
    '有什么我可以帮你的吗？',
    '点击我可以切换模型哦~',
    '这里是一个有趣的地方！',
    '记得常来玩呀！',
    '哇，你发现了一个秘密！',
    '希望你喜欢这个网站~',
    '今天的天气真不错呢！',
    '看板娘在这里陪着你！',
];

export const Live2DWidget = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loaded, setLoaded] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [modelIndex, setModelIndex] = useState(0);

    // 模型列表 - 使用本地模型
    const models = [
        // 本地 Terisa 模型 (Cubism 2.x)
        '/live2d/Terisa/model.json',
        // 本地 miku 模型 (Cubism 2.x)
        '/live2d/miku/miku.model.json',
        // 本地 kobayaxi 模型 (Cubism 2.x)
        '/live2d/kobayaxi/model.json',
        // 本地 Haru 模型 (注意：Haru 通常是 Cubism 3，可能需要适配，或者只使用 2.x 的模型)
        // '/live2d/Haru/Haru.model3.json', 
    ];

    useEffect(() => {
        // 动态加载 Live2D 脚本
        const loadLive2D = async () => {
            try {
                // 检查是否已加载
                // @ts-ignore
                if (window.L2Dwidget) {
                    initLive2D();
                    return;
                }

                // 尝试多个 CDN 源
                const cdnSources = [
                    'https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js',
                    'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js',
                    'https://fastly.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js',
                ];

                for (const src of cdnSources) {
                    try {
                        await new Promise<void>((resolve, reject) => {
                            const script = document.createElement('script');
                            script.src = src;
                            script.async = true;
                            script.onload = () => resolve();
                            script.onerror = () => reject(new Error(`Failed to load from ${src}`));
                            document.head.appendChild(script);
                        });
                        // @ts-ignore
                        if (window.L2Dwidget) {
                            initLive2D();
                            break;
                        }
                    } catch (e) {
                        console.warn('Live2D CDN failed:', e);
                        continue;
                    }
                }
            } catch (error) {
                console.error('Failed to load Live2D:', error);
            }
        };

        loadLive2D();

        // 定时显示随机消息
        const messageInterval = setInterval(() => {
            if (!hidden && Math.random() > 0.7) {
                showRandomMessage();
            }
        }, 30000);

        return () => {
            clearInterval(messageInterval);
        };
    }, [hidden]);

    const initLive2D = (index: number = modelIndex) => {
        // @ts-ignore
        if (!window.L2Dwidget) return;

        // 清理现有的 widget
        const existingWidget = document.getElementById('live2d-widget');
        if (existingWidget) {
            existingWidget.remove();
        }

        // @ts-ignore
        window.L2Dwidget.init({
            pluginRootPath: 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/',
            pluginJsPath: 'lib/',
            pluginModelPath: 'assets/',
            tagMode: false,
            debug: false,
            model: {
                jsonPath: models[index],
                scale: 1,
            },
            display: {
                superSample: 2,
                width: 150,
                height: 300,
                position: 'left',
                hOffset: 0,
                vOffset: -20,
            },
            mobile: {
                show: false,
                scale: 0.5,
            },
            name: {
                canvas: 'live2dcanvas',
                div: 'live2d-widget',
            },
            react: {
                opacity: 1,
            },
        });
        setLoaded(true);
        showRandomMessage();
    };

    const showRandomMessage = () => {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMessage);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 5000);
    };

    const switchModel = () => {
        const newIndex = (modelIndex + 1) % models.length;
        setModelIndex(newIndex);
        setMessage('切换模型中...');
        setShowMessage(true);

        // 延迟初始化新模型，等待状态更新
        setTimeout(() => {
            initLive2D(newIndex);
            setMessage('新模型加载完成！');
        }, 300);
    };

    const captureScreenshot = () => {
        const canvas = document.getElementById('live2dcanvas') as HTMLCanvasElement;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'live2d-screenshot.png';
            link.href = canvas.toDataURL();
            link.click();
            setMessage('截图已保存！');
            setShowMessage(true);
        }
    };

    if (hidden) {
        return (
            <button
                onClick={() => setHidden(false)}
                className="fixed left-4 bottom-4 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                title="显示看板娘"
            >
                <FaComment size={16} />
            </button>
        );
    }

    return (
        <div className="fixed left-0 bottom-0 z-50 hidden md:block">
            {/* 消息气泡 */}
            <div
                className={clsx(
                    'absolute left-4 bottom-72 w-48 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg text-sm transition-all duration-300',
                    showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                )}
            >
                <div className="absolute bottom-0 left-4 w-3 h-3 bg-white/90 dark:bg-gray-800/90 transform rotate-45 translate-y-1.5" />
                {message}
            </div>

            {/* 工具栏 */}
            <div className="absolute left-40 bottom-24 flex flex-col gap-2">
                <button
                    onClick={showRandomMessage}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                    title="说话"
                >
                    <FaComment size={14} />
                </button>
                <button
                    onClick={switchModel}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                    title="切换模型"
                >
                    <FaRandom size={14} />
                </button>
                <button
                    onClick={captureScreenshot}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                    title="截图"
                >
                    <FaCamera size={14} />
                </button>
                <button
                    onClick={() => setHidden(true)}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
                    title="隐藏"
                >
                    <FaTimes size={14} />
                </button>
            </div>

            {/* Live2D 容器 */}
            <div ref={containerRef} id="live2d-widget-container" className="relative">
                {/* Live2D widget 会在这里被脚本注入 */}
            </div>
        </div>
    );
};
