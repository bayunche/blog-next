/**
 * LRC 歌词解析器
 * 解析标准 LRC 格式歌词，返回结构化数据
 */

export interface LyricLine {
    time: number;  // 时间（秒）
    text: string;  // 歌词文本
}

export interface ParsedLyric {
    lines: LyricLine[];
    metadata: {
        title?: string;
        artist?: string;
        album?: string;
        by?: string;
    };
}

/**
 * 解析 LRC 格式歌词
 * @param lrcString - LRC 格式的歌词字符串
 * @returns 解析后的歌词对象
 */
export function parseLrc(lrcString: string): ParsedLyric {
    const lines: LyricLine[] = [];
    const metadata: ParsedLyric['metadata'] = {};

    if (!lrcString) {
        return { lines, metadata };
    }

    // 按行分割
    const lrcLines = lrcString.split('\n');

    // 时间标签正则：[mm:ss.xx] 或 [mm:ss]
    const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
    // 元数据标签正则
    const metaRegex = /\[(ti|ar|al|by):(.+)\]/i;

    for (const line of lrcLines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // 检查是否是元数据
        const metaMatch = trimmedLine.match(metaRegex);
        if (metaMatch) {
            const key = metaMatch[1].toLowerCase();
            const value = metaMatch[2].trim();
            switch (key) {
                case 'ti':
                    metadata.title = value;
                    break;
                case 'ar':
                    metadata.artist = value;
                    break;
                case 'al':
                    metadata.album = value;
                    break;
                case 'by':
                    metadata.by = value;
                    break;
            }
            continue;
        }

        // 提取所有时间标签
        const times: number[] = [];
        let match;
        while ((match = timeRegex.exec(trimmedLine)) !== null) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = match[3]
                ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10)
                : 0;
            const time = minutes * 60 + seconds + milliseconds / 1000;
            times.push(time);
        }

        // 提取歌词文本（移除所有时间标签后的内容）
        const text = trimmedLine.replace(/\[\d{2}:\d{2}(?:\.\d{2,3})?\]/g, '').trim();

        // 为每个时间点添加歌词行
        for (const time of times) {
            if (text) {
                lines.push({ time, text });
            }
        }
    }

    // 按时间排序
    lines.sort((a, b) => a.time - b.time);

    return { lines, metadata };
}

/**
 * 根据当前播放时间查找当前歌词行索引
 * @param lyrics - 歌词行数组
 * @param currentTime - 当前播放时间（秒）
 * @returns 当前歌词行的索引，如果没有匹配则返回 -1
 */
export function findCurrentLineIndex(lyrics: LyricLine[], currentTime: number): number {
    if (!lyrics.length) return -1;

    // 二分查找最后一个 time <= currentTime 的行
    let left = 0;
    let right = lyrics.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (lyrics[mid].time <= currentTime) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

/**
 * 格式化时间为 mm:ss 格式
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串
 */
export function formatLyricTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
