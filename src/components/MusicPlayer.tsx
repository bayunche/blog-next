'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaVolumeUp, FaVolumeMute, FaList, FaRandom, FaRedo,
    FaMusic, FaCloudDownloadAlt, FaSearch,
    FaCompactDisc, FaTimes
} from 'react-icons/fa';
import { clsx } from 'clsx';
import { parseLrc, findCurrentLineIndex, type LyricLine } from './MusicPlayer/LyricParser';
import { useMusicStore, Track } from '@/shared/store/musicStore';

// 默认播放列表兜底（当后台未配置/接口不可用时使用）
const fallbackPlaylist = [
    {
        id: '1330348068',
        name: '起风了',
        artist: '买辣椒也用券',
        url: '/api/music/proxy/1330348068',
        cover: 'https://p1.music.126.net/GDyFqgR8Nf7FHtG7HYML-A==/109951163846251114.jpg',
    },
    {
        id: '1475596788',
        name: '起风了',
        artist: '周深',
        url: '/api/music/proxy/1475596788',
        cover: 'https://p4.music.126.net/IJKj5LML2r2OHVFlhzhQxw==/109951172355875728.jpg',
    },
    {
        id: '1330346841',
        name: '起风了 (伴奏)',
        artist: '买辣椒也用券',
        url: '/api/music/proxy/1330346841',
        cover: 'https://p2.music.126.net/AgkTZ35_NEhYhGxDPVv45A==/109951163699673352.jpg',
    },
    {
        id: '1931434848',
        name: '起风了（2018）翻自买辣椒也用卷',
        artist: '旧忆',
        url: '/api/music/proxy/1931434848',
        cover: 'https://p4.music.126.net/CfSHEI6jvS45z5rlFw2VfA==/109951167190711575.jpg',
    },
    {
        id: '2636494144',
        name: '起风了（林俊杰）',
        artist: '8Y1ar',
        url: '/api/music/proxy/2636494144',
        cover: 'https://p4.music.126.net/FIcHcb7J7ODv2Lx8M1qLtg==/109951167976855465.jpg',
    },
];

type ViewMode = 'player' | 'playlist' | 'lyrics' | 'import';
type PlaylistTrack = {
    id: string | number;
    name: string;
    artist?: string;
    cover?: string;
    ar?: Array<{ name: string }>;
    al?: { picUrl?: string };
};

const mapPlaylistTracks = (tracks: PlaylistTrack[]): Track[] => {
    return tracks.map((track) => {
        const id = String(track.id);
        return {
            id,
            name: track.name,
            artist: track.artist || (track.ar || []).map((a) => a.name).join('/') || '未知艺术家',
            url: `/api/music/proxy/${id}`,
            cover: track.cover || track.al?.picUrl || '',
        };
    });
};

const fallbackIdSet = new Set(fallbackPlaylist.map(track => track.id));

export const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const hasTriedInitialDefault = useRef(false);

    const {
        playlist,
        currentIndex,
        playing,
        minimized,
        volume,
        repeat,
        shuffle,
        setPlaying,
        togglePlay,
        setCurrentIndex,
        setPlaylist,
        setMinimized,
        setVolume,
        setRepeat,
        setShuffle,
        nextTrack,
        prevTrack,
        updateTrackUrl
    } = useMusicStore();

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('player');

    // 歌词相关
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
    const [loadingLyrics, setLoadingLyrics] = useState(false);

    // 歌单导入相关
    const [playlistId, setPlaylistId] = useState('');
    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState('');

    const currentTrack = playlist[currentIndex];
    const getProxyUrl = useCallback((songId: string) => `/api/music/proxy/${songId}`, []);

    // 获取歌词
    const fetchLyrics = useCallback(async (songId: string) => {
        if (!songId) return;
        setLoadingLyrics(true);
        try {
            const response = await fetch(`/api/music/lyric/${songId}`);
            const data = await response.json();
            if (data.code === 200 && data.data?.lrc) {
                const parsed = parseLrc(data.data.lrc);
                setLyrics(parsed.lines);
            } else {
                setLyrics([]);
            }
        } catch {
            setLyrics([]);
        } finally {
            setLoadingLyrics(false);
        }
    }, []);

    // 导入歌单
    const importPlaylist = async () => {
        if (!playlistId.trim()) {
            setImportError('请输入歌单 ID');
            return;
        }

        setImporting(true);
        setImportError('');

        try {
            const response = await fetch(`/api/music/playlist/${playlistId.trim()}`);
            const data = await response.json();

            if (data.code === 200 && data.data?.tracks?.length > 0) {
                const newTracks: Track[] = data.data.tracks.map((track: PlaylistTrack) => ({
                    id: track.id.toString(),
                    name: track.name,
                    artist: track.artist || (track.ar || []).map((a) => a.name).join('/') || '未知艺术家',
                    url: '',
                    cover: track.cover || track.al?.picUrl || '',
                }));
                setPlaylist(newTracks);
                setViewMode('playlist');
                setPlaylistId('');
                playTrack(0, newTracks);
            } else {
                setImportError(data.message || '导入失败，请检查歌单 ID');
            }
        } catch {
            setImportError('网络错误，请稍后重试');
        } finally {
            setImporting(false);
        }
    };

    // 播放指定曲目
    const playTrack = (index: number, tracks = playlist) => {
        const track = tracks[index];
        if (!track) return;

        const proxyUrl = getProxyUrl(track.id);
        if (track.url !== proxyUrl) {
            updateTrackUrl(track.id, proxyUrl);
        }

        setCurrentIndex(index);
        setPlaying(true);
        setViewMode('player');
    };

    // 进度条点击
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !audioRef.current) return;
        const audio = audioRef.current;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const validDuration = (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity)
            ? audio.duration
            : duration;

        if (validDuration > 0) {
            const newTime = percent * validDuration;
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // 音量控制
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        setMuted(newVolume === 0);
    };

    // 切换静音
    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    // 循环模式切换
    const toggleRepeatMode = () => {
        const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
        const currentModeIndex = modes.indexOf(repeat);
        setRepeat(modes[(currentModeIndex + 1) % 3]);
    };

    // 格式化时间
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // 初始化加载后台配置的默认歌单（如果 store 中为空）
    useEffect(() => {
        let active = true;
        if (hasTriedInitialDefault.current) return;
        hasTriedInitialDefault.current = true;

        const loadDefaultPlaylist = async () => {
            const shouldLoadConfiguredDefault =
                playlist.length === 0 ||
                playlist.every((track) => fallbackIdSet.has(String(track.id)));
            if (!shouldLoadConfiguredDefault) return;

            try {
                const response = await fetch('/api/music/playlist/default');
                const data = await response.json();

                if (active && data.code === 200 && data.data?.tracks?.length > 0) {
                    const tracks = mapPlaylistTracks(data.data.tracks as PlaylistTrack[]);
                    setPlaylist(tracks);
                    return;
                }
            } catch (error) {
                console.warn('加载默认歌单失败，使用兜底歌单:', error);
            }

            if (active) {
                setPlaylist(fallbackPlaylist as Track[]);
            }
        };

        loadDefaultPlaylist();
        return () => {
            active = false;
        };
    }, [playlist, setPlaylist]);

    // 当歌曲变化时获取歌词
    useEffect(() => {
        if (currentTrack?.id) {
            fetchLyrics(currentTrack.id);
        }
    }, [currentTrack?.id, fetchLyrics]);

    // 更新当前歌词索引
    useEffect(() => {
        if (lyrics.length > 0) {
            const index = findCurrentLineIndex(lyrics, currentTime);
            if (index !== currentLyricIndex) {
                setCurrentLyricIndex(index);
                if (lyricsContainerRef.current && index >= 0) {
                    const container = lyricsContainerRef.current;
                    const lineElement = container.children[index] as HTMLElement;
                    if (lineElement) {
                        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    }, [currentTime, lyrics, currentLyricIndex]);

    // 音频事件处理
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
                setDuration(audio.duration);
            }
        };

        const handleEnded = () => {
            if (repeat === 'one') {
                audio.currentTime = 0;
                audio.play();
            } else if (repeat === 'all' || currentIndex < playlist.length - 1) {
                nextTrack();
            } else {
                setPlaying(false);
            }
        };

        const handleError = (e: Event) => {
            console.error('音频加载错误:', e);
            if (currentTrack) {
                const proxyUrl = getProxyUrl(currentTrack.id);
                if (currentTrack.url !== proxyUrl) {
                    updateTrackUrl(currentTrack.id, proxyUrl);
                    return;
                }
            }
            if (playlist.length > 1) {
                nextTrack();
            } else {
                setPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [currentIndex, repeat, nextTrack, playlist.length, currentTrack, updateTrackUrl, setPlaying, getProxyUrl]);

    // 切换曲目或播放状态变化时的处理
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;

        const proxyUrl = getProxyUrl(currentTrack.id);
        if (currentTrack.url !== proxyUrl) {
            updateTrackUrl(currentTrack.id, proxyUrl);
            return;
        }

        if (playing) {
            audio.play().catch(err => {
                console.warn('Auto-play failed:', err);
                setPlaying(false);
            });
        } else {
            audio.pause();
        }
    }, [currentTrack, currentIndex, playing, updateTrackUrl, setPlaying, getProxyUrl]);

    // 迷你模式
    if (minimized) {
        return (
            <button
                onClick={() => setMinimized(false)}
                className="fixed right-20 bottom-4 z-40 p-4 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 text-white rounded-full shadow-xl hover:scale-110 hover:shadow-pink-300/50 transition-all motion-transition animate-pulse-slow font-sans"
                title="打开音乐播放器"
            >
                <FaMusic size={20} />
                {playing && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                )}
            </button>
        );
    }

    // 渲染导入歌单视图
    const renderImportView = () => (
        <div className="p-4 space-y-4 font-sans">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <FaCloudDownloadAlt className="text-purple-400" />
                    导入网易云歌单
                </h3>
                <button
                    onClick={() => setViewMode('player')}
                    className="text-text-muted hover:text-foreground"
                >
                    <FaTimes size={14} />
                </button>
            </div>
            <div className="space-y-2">
                <input
                    type="text"
                    value={playlistId}
                    onChange={(e) => setPlaylistId(e.target.value)}
                    placeholder="输入网易云歌单 ID"
                    className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-pink-200 dark:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
                <p className="text-xs text-text-muted">
                    💡 在网易云音乐分享歌单，链接中 id= 后的数字即为歌单 ID
                </p>
                {importError && (
                    <p className="text-xs text-red-500">{importError}</p>
                )}
                <button
                    onClick={importPlaylist}
                    disabled={importing}
                    className="w-full py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity motion-transition flex items-center justify-center gap-2"
                >
                    {importing ? (
                        <>
                            <FaCompactDisc className="animate-spin" />
                            导入中...
                        </>
                    ) : (
                        <>
                            <FaSearch />
                            导入歌单
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    // 渲染歌词视图
    const renderLyricsView = () => (
        <div className="h-48 font-sans">
            <div className="flex items-center justify-between px-4 py-2 border-b border-pink-200/50 dark:border-purple-700/50">
                <span className="text-xs font-medium text-text-muted">歌词</span>
                <button
                    onClick={() => setViewMode('player')}
                    className="text-text-muted hover:text-foreground"
                >
                    <FaTimes size={12} />
                </button>
            </div>
            <div
                ref={lyricsContainerRef}
                className="h-40 overflow-y-auto px-4 py-2 scrollbar-hide"
            >
                {loadingLyrics ? (
                    <div className="flex items-center justify-center h-full text-text-muted text-sm">
                        <FaCompactDisc className="animate-spin mr-2" />
                        加载歌词...
                    </div>
                ) : lyrics.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-text-muted text-sm">
                        暂无歌词
                    </div>
                ) : (
                    lyrics.map((line, index) => (
                        <p
                            key={`${line.time}-${index}`}
                            className={clsx(
                                "text-sm py-1 transition-all motion-transition text-center",
                                index === currentLyricIndex
                                    ? "text-purple-500 dark:text-pink-400 font-bold scale-105"
                                    : "text-text-muted"
                            )}
                        >
                            {line.text}
                        </p>
                    ))
                )}
            </div>
        </div>
    );

    // 渲染播放列表视图
    const renderPlaylistView = () => (
        <div className="max-h-48 overflow-y-auto border-t border-pink-200/50 dark:border-purple-700/50 font-sans">
            <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-inherit z-10">
                <span className="text-xs font-medium text-text-muted">
                    播放列表 ({playlist.length} 首)
                </span>
                <button
                    onClick={() => setViewMode('import')}
                    className="text-purple-400 hover:text-purple-500 text-xs flex items-center gap-1"
                >
                    <FaCloudDownloadAlt size={12} />
                    导入
                </button>
            </div>
            {playlist.map((track, index) => (
                <button
                    key={`${track.id}-${index}`}
                    onClick={() => playTrack(index)}
                    className={clsx(
                        "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors motion-transition",
                        index === currentIndex && "bg-purple-100/50 dark:bg-purple-900/30"
                    )}
                >
                    <img
                        src={track.cover}
                        alt={track.name}
                        className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <p className={clsx(
                            "text-sm truncate",
                            index === currentIndex ? "text-purple-500 dark:text-pink-400 font-medium" : "text-foreground"
                        )}>
                            {track.name}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                            {track.artist}
                        </p>
                    </div>
                    {index === currentIndex && playing && (
                        <div className="flex gap-0.5">
                            <span className="w-0.5 h-3 bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-0.5 h-3 bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-0.5 h-3 bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );

    return (
        <div className="fixed right-4 bottom-4 z-40 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
            {/* 隐藏的 audio 元素 */}
            <audio ref={audioRef} src={currentTrack?.url} preload="auto" />

            {/* 头部 */}
            <div className="relative h-28 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-60"
                    style={{ backgroundImage: `url(${currentTrack?.cover})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

                <div className="absolute left-4 top-3 w-20 h-20 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/20">
                    <img
                        src={currentTrack?.cover}
                        alt={currentTrack?.name}
                        className={clsx(
                            "w-full h-full object-cover transition-transform motion-transition-slow",
                            playing && "animate-spin-slow"
                        )}
                    />
                </div>

                <div className="absolute left-28 top-3 right-4">
                    <h4 className="text-sm font-bold text-white truncate drop-shadow-lg">
                        {currentTrack?.name}
                    </h4>
                    <p className="text-xs text-white/70 mt-1 drop-shadow">
                        {currentTrack?.artist}
                    </p>
                    <button
                        onClick={() => setViewMode(viewMode === 'lyrics' ? 'player' : 'lyrics')}
                        className={clsx(
                            "mt-2 text-xs px-2 py-0.5 rounded-full transition-colors motion-transition",
                            viewMode === 'lyrics'
                                ? "bg-purple-500 text-white"
                                : "bg-white/20 text-white/80 hover:bg-white/30"
                        )}
                    >
                        歌词
                    </button>
                </div>

                <div className="absolute right-2 top-2 flex gap-2">
                    <button
                        onClick={() => setMinimized(true)}
                        className="p-1.5 text-white/70 hover:text-white transition-colors motion-transition"
                        title="最小化"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            </div>

            {viewMode === 'lyrics' ? (
                renderLyricsView()
            ) : viewMode === 'import' ? (
                renderImportView()
            ) : viewMode === 'playlist' ? (
                renderPlaylistView()
            ) : (
                <>
                    <div className="px-4 py-2">
                        <div
                            ref={progressRef}
                            className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden group"
                            onClick={handleProgressClick}
                        >
                            <div
                                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all motion-transition relative"
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            >
                                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity motion-transition" />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 select-none font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 py-2">
                        <button
                            onClick={() => setShuffle(!shuffle)}
                            className={clsx(
                                "p-2 rounded-full transition-colors motion-transition",
                                shuffle ? "text-purple-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            )}
                            title="随机播放"
                        >
                            <FaRandom size={14} />
                        </button>
                        <button
                            onClick={prevTrack}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:text-purple-500 transition-colors motion-transition"
                            title="上一曲"
                        >
                            <FaStepBackward size={16} />
                        </button>
                        <button
                            onClick={togglePlay}
                            className="p-4 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-purple-300/50 transition-all motion-transition"
                            title={playing ? "暂停" : "播放"}
                        >
                            {playing ? <FaPause size={18} /> : <FaPlay size={18} className="ml-0.5" />}
                        </button>
                        <button
                            onClick={nextTrack}
                            className="p-2 text-foreground hover:text-purple-500 transition-colors motion-transition"
                            title="下一曲"
                        >
                            <FaStepForward size={16} />
                        </button>
                        <button
                            onClick={toggleRepeatMode}
                            className={clsx(
                                "p-2 rounded-full transition-colors motion-transition relative",
                                repeat !== 'none' ? "text-purple-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            )}
                            title={repeat === 'one' ? '单曲循环' : repeat === 'all' ? '列表循环' : '不循环'}
                        >
                            <FaRedo size={14} />
                            {repeat === 'one' && (
                                <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold">1</span>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 border-t border-pink-200/50 dark:border-purple-700/50">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors motion-transition"
                            >
                                {muted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={muted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-16 h-1 accent-purple-400"
                            />
                        </div>
                        <button
                            onClick={() => setViewMode('playlist')}
                            className="p-2 rounded-full transition-colors motion-transition text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            title="播放列表"
                        >
                            <FaList size={14} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
