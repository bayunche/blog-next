'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaComment, FaTimes, FaRandom, FaCamera } from 'react-icons/fa';
import { clsx } from 'clsx';

type Live2DFrameEventType = 'ready' | 'message' | 'model-changed' | 'error';

type Live2DFrameEvent = {
    source: 'sakurairo-live2d';
    type: Live2DFrameEventType;
    payload?: {
        text?: string;
        index?: number;
        error?: string;
    };
};

const models = [
    '/live2d/Terisa/model.json',
    '/live2d/miku/miku.model.json',
    '/live2d/kobayaxi/model.json',
];

const fallbackMessages = [
    '欢迎来到我的博客！(｡･ω･｡)ﾉ♡',
    '今天也要开心哦！٩(◕‿◕｡)۶',
    '有什么我可以帮你的吗？',
    '点击我可以切换模型哦~',
    '希望你喜欢这个网站~',
];

export const Live2DWidget = () => {
    const enabled = useMemo(() => process.env.NEXT_PUBLIC_ENABLE_LIVE2D !== 'false', []);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const periodicSpeakRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const frameReadyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [hidden, setHidden] = useState(false);
    const [ready, setReady] = useState(false);
    const [modelIndex, setModelIndex] = useState(0);
    const [iframeSrc, setIframeSrc] = useState('/live2d/widget.html?model=0');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const setTransientMessage = useCallback((text: string) => {
        setMessage(text);
        setShowMessage(true);
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = setTimeout(() => {
            setShowMessage(false);
        }, 5000);
    }, []);

    const postFrameCommand = useCallback((type: string, payload: Record<string, unknown> = {}) => {
        const frameWindow = iframeRef.current?.contentWindow;
        if (!frameWindow) return;
        frameWindow.postMessage(
            {
                source: 'sakurairo-live2d-host',
                type,
                payload,
            },
            window.location.origin
        );
    }, []);

    const showFallbackMessage = useCallback(() => {
        const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
        setTransientMessage(randomMessage);
    }, [setTransientMessage]);

    useEffect(() => {
        if (!enabled) return;

        const handleFrameMessage = (event: MessageEvent<Live2DFrameEvent>) => {
            if (event.origin !== window.location.origin) return;
            const data = event.data;
            if (!data || data.source !== 'sakurairo-live2d') return;

            if (data.type === 'ready') {
                if (frameReadyTimeoutRef.current) {
                    clearTimeout(frameReadyTimeoutRef.current);
                    frameReadyTimeoutRef.current = null;
                }
                setReady(true);
                setTransientMessage('看板娘已就位~');
                return;
            }

            if (data.type === 'message' && data.payload?.text) {
                setTransientMessage(data.payload.text);
                return;
            }

            if (data.type === 'model-changed' && typeof data.payload?.index === 'number') {
                if (frameReadyTimeoutRef.current) {
                    clearTimeout(frameReadyTimeoutRef.current);
                    frameReadyTimeoutRef.current = null;
                }
                setModelIndex(data.payload.index);
                setReady(true);
                return;
            }

            if (data.type === 'error') {
                if (frameReadyTimeoutRef.current) {
                    clearTimeout(frameReadyTimeoutRef.current);
                    frameReadyTimeoutRef.current = null;
                }
                setTransientMessage(data.payload?.error || '看板娘加载失败');
            }
        };

        window.addEventListener('message', handleFrameMessage as EventListener);
        return () => {
            window.removeEventListener('message', handleFrameMessage as EventListener);
        };
    }, [enabled, setTransientMessage]);

    useEffect(() => {
        if (!enabled || hidden) return;

        if (periodicSpeakRef.current) {
            clearInterval(periodicSpeakRef.current);
        }
        periodicSpeakRef.current = setInterval(() => {
            if (Math.random() > 0.7) {
                postFrameCommand('speak');
            }
        }, 30000);

        return () => {
            if (periodicSpeakRef.current) {
                clearInterval(periodicSpeakRef.current);
                periodicSpeakRef.current = null;
            }
        };
    }, [enabled, hidden, postFrameCommand]);

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
            if (frameReadyTimeoutRef.current) {
                clearTimeout(frameReadyTimeoutRef.current);
            }
            if (periodicSpeakRef.current) {
                clearInterval(periodicSpeakRef.current);
            }
        };
    }, []);

    const switchModel = () => {
        const nextIndex = (modelIndex + 1) % models.length;
        setModelIndex(nextIndex);
        setReady(false);
        setTransientMessage('切换模型中...');
        // Use iframe reload as the primary switch path to avoid postMessage sync issues.
        setIframeSrc(`/live2d/widget.html?model=${nextIndex}&t=${Date.now()}`);
    };

    const captureScreenshot = () => {
        postFrameCommand('capture');
    };

    if (!enabled) return null;

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
        <div className="fixed left-0 bottom-0 z-50 hidden md:block" data-live2d-model-index={modelIndex}>
            <div
                className={clsx(
                    'absolute left-4 bottom-72 z-20 w-48 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg text-sm transition-all duration-300',
                    showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                )}
            >
                <div className="absolute bottom-0 left-4 w-3 h-3 bg-white/90 dark:bg-gray-800/90 transform rotate-45 translate-y-1.5" />
                {message}
            </div>

            <div className="absolute left-40 bottom-24 z-[80] pointer-events-auto flex flex-col gap-2">
                <button
                    onClick={() => postFrameCommand('speak')}
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
                    disabled={!ready}
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

            <div className="relative w-[180px] h-[340px]">
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    title="Live2D Widget"
                    className="w-full h-full border-0 bg-transparent"
                    loading="lazy"
                    onLoad={() => {
                        setReady(false);
                        showFallbackMessage();
                        if (frameReadyTimeoutRef.current) {
                            clearTimeout(frameReadyTimeoutRef.current);
                        }
                        frameReadyTimeoutRef.current = setTimeout(() => {
                            setTransientMessage('看板娘资源未就绪，正在重试或等待网络...');
                        }, 6000);
                    }}
                />
            </div>
        </div>
    );
};
