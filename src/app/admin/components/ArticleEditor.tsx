'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button, Input, Form, Select, message, Upload, Modal, Spin, Tooltip, Alert } from 'antd';
import { UploadOutlined, SaveOutlined, PictureOutlined, ReloadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { articleApi } from '@/shared/api/article';
import request from '@/shared/api/request';
import { useAuthStore } from '@/shared/store/authStore';
import { categoryApi } from '@/shared/api/category';
import { tagApi } from '@/shared/api/tag';
import { getPrimaryCategory } from '@/shared/utils/articleDisplay';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import type { UploadProps } from 'antd';
import { LOCAL_BACKGROUND_IMAGE, EXTERNAL_BACKGROUND_FALLBACKS } from '@/shared/constants/backgrounds';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const MUSIC_SEARCH_PAGE_SIZE = 8;

interface ArticleEditorProps {
    articleId?: number;
}

interface MusicSearchResponse {
    code: number;
    data: any[];
    message: string;
    pagination?: {
        total: number;
        page: number;
        pageSize: number;
        hasMore: boolean;
    };
}

interface ImageBedUploadResponse {
    code: number;
    message: string;
    data?: {
        url?: string;
        displayUrl?: string;
        thumb?: string;
        medium?: string;
    };
}

interface CoverUploadResult {
    url: string;
    source: 'image-bed' | 'local';
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorDetail(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null) {
        const anyErr = error as any;
        if (anyErr.response?.data?.message) {
            return String(anyErr.response.data.message);
        }
        if (anyErr.message) {
            return String(anyErr.message);
        }
    }
    return fallback;
}

function getImageBedUrl(payload: ImageBedUploadResponse | undefined): string | null {
    if (!payload?.data) return null;
    return payload.data.displayUrl || payload.data.url || payload.data.medium || payload.data.thumb || null;
}

export default function ArticleEditor({ articleId }: ArticleEditorProps) {
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [coverUrl, setCoverUrl] = useState('');
    const [coverLoading, setCoverLoading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [lastUploadFile, setLastUploadFile] = useState<File | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [tagOptions, setTagOptions] = useState<string[]>([]);
    // 音乐相关状态
    const [musicId, setMusicId] = useState('');
    const [musicName, setMusicName] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchTotal, setSearchTotal] = useState(0);
    const [searchPage, setSearchPage] = useState(1);
    const [searchLoading, setSearchLoading] = useState(false);
    const musicSearchCacheRef = useRef<Record<string, { items: any[]; total: number }>>({});
    const router = useRouter();
    const user = useAuthStore(state => state.user);
    const categorySelectOptions = useMemo(
        () => categoryOptions.map((name) => ({ label: name, value: name })),
        [categoryOptions]
    );
    const tagSelectOptions = useMemo(
        () => tagOptions.map((name) => ({ label: name, value: name })),
        [tagOptions]
    );
    const totalSearchPages = useMemo(
        () => Math.max(1, Math.ceil(searchTotal / MUSIC_SEARCH_PAGE_SIZE)),
        [searchTotal]
    );

    useEffect(() => {
        setSearchPage((prev) => Math.min(prev, totalSearchPages));
    }, [totalSearchPages]);

    const refreshCategoryTagCandidates = useCallback(async () => {
        try {
            const [categoryList, tagList] = await Promise.all([
                categoryApi.getList(),
                tagApi.getList(),
            ]);
            const normalizedCategory = Array.from(
                new Set((categoryList || []).map((item) => item.name).filter(Boolean))
            );
            const normalizedTag = Array.from(
                new Set((tagList || []).map((item) => item.name).filter(Boolean))
            );
            setCategoryOptions(normalizedCategory);
            setTagOptions(normalizedTag);
        } catch (error) {
            console.error('加载分类/标签候选失败:', error);
            message.warning('分类/标签候选加载失败，当前可手动输入');
        }
    }, []);

    useEffect(() => {
        refreshCategoryTagCandidates();
    }, [refreshCategoryTagCandidates]);

    // 获取随机封面图片
    const fetchRandomCover = useCallback(async () => {
        setCoverLoading(true);
        try {
            const candidates = [
                LOCAL_BACKGROUND_IMAGE,
                ...EXTERNAL_BACKGROUND_FALLBACKS.map((url) =>
                    `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`
                ),
            ];
            const shuffledCandidates = [...candidates];
            for (let i = shuffledCandidates.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledCandidates[i], shuffledCandidates[j]] = [shuffledCandidates[j], shuffledCandidates[i]];
            }

            const tryLoad = (index: number) => {
                if (index >= shuffledCandidates.length) {
                    message.error('获取封面图片失败');
                    setCoverLoading(false);
                    return;
                }

                const target = shuffledCandidates[index];
                const img = new Image();
                img.onload = () => {
                    setCoverUrl(target);
                    form.setFieldValue('cover', target);
                    message.success(target === LOCAL_BACKGROUND_IMAGE ? '已随机到本地封面图' : '已随机获取封面图');
                    setCoverLoading(false);
                };
                img.onerror = () => {
                    tryLoad(index + 1);
                };
                img.src = target;
            };

            tryLoad(0);
        } catch (error) {
            console.error('获取随机图片失败:', error);
            message.error('获取随机图片失败');
            setCoverLoading(false);
        }
    }, [form]);

    const uploadCoverFile = useCallback(async (file: File, maxRetries = 2): Promise<CoverUploadResult> => {
        let imageBedError: unknown;
        try {
            const imageBedFormData = new FormData();
            imageBedFormData.append('file', file);
            const imageBedRes = await request.post<any, ImageBedUploadResponse>('/upload/image', imageBedFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = getImageBedUrl(imageBedRes);
            if (imageUrl) {
                return { url: imageUrl, source: 'image-bed' };
            }
            throw new Error('图床未返回可用图片地址');
        } catch (error) {
            imageBedError = error;
        }

        let lastError: unknown;

        for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                await request.post('/article/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const url = `/public/uploads/${encodeURIComponent(file.name)}`;
                return { url, source: 'local' };
            } catch (error) {
                lastError = error;
                if (attempt < maxRetries) {
                    await sleep((attempt + 1) * 400);
                }
            }
        }

        const imageBedDetail = getErrorDetail(imageBedError, '图床上传失败');
        const localDetail = getErrorDetail(lastError, '本地上传失败');
        throw new Error(`${imageBedDetail}；${localDetail}`);
    }, []);

    // 文件上传处理
    const handleUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        const uploadFile = file as File;
        setUploadingCover(true);
        setUploadError('');
        setLastUploadFile(uploadFile);
        try {
            const { url, source } = await uploadCoverFile(uploadFile, 2);
            setCoverUrl(url);
            form.setFieldValue('cover', url);
            onSuccess(url);
            message.success(source === 'image-bed' ? '封面图片已上传到图床' : '图床不可用，已回退本地上传');
            return url;
        } catch (err) {
            const detail = getErrorDetail(err, '封面图片上传失败');
            setUploadError(detail);
            onError(err);
            message.error(`封面图片上传失败：${detail}`);
        } finally {
            setUploadingCover(false);
        }
    };

    // 删除封面
    const handleRemoveCover = () => {
        setCoverUrl('');
        setUploadError('');
        form.setFieldValue('cover', '');
    };

    const handleRetryUpload = async () => {
        if (!lastUploadFile) {
            message.warning('没有可重试的上传文件');
            return;
        }
        setUploadingCover(true);
        setUploadError('');
        try {
            const { url, source } = await uploadCoverFile(lastUploadFile, 2);
            setCoverUrl(url);
            form.setFieldValue('cover', url);
            message.success(source === 'image-bed' ? '封面图片已上传到图床' : '图床不可用，已回退本地上传');
        } catch (error) {
            const detail = getErrorDetail(error, '封面图片重试失败');
            setUploadError(detail);
            message.error(`封面图片重试失败：${detail}`);
        } finally {
            setUploadingCover(false);
        }
    };

    // 处理 URL 输入变化
    const handleCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setCoverUrl(url);
    };

    useEffect(() => {
        if (articleId) {
            setLoading(true);
            articleApi.getDetail(articleId).then(res => {
                form.setFieldsValue({
                    title: res.title,
                    cover: res.cover,
                    categories: getPrimaryCategory(res) ? [getPrimaryCategory(res)!.name] : [],
                    tags: (res.tags || []).map(t => t.name),
                    description: res.content.substring(0, 100)
                });
                setContent(res.content);
                if (res.cover) {
                    setCoverUrl(res.cover);
                }
                // 加载音乐信息
                if ((res as any).musicId) {
                    setMusicId((res as any).musicId);
                    setMusicName((res as any).musicName || '');
                }
            }).finally(() => setLoading(false));
        }
    }, [articleId, form]);

    // 搜索音乐
    const handleSearchMusic = async (targetPage = 1) => {
        const keyword = searchKeyword.trim();
        if (!keyword) {
            message.warning('请输入搜索关键词');
            return;
        }
        const page = Math.max(1, targetPage);
        const cacheKey = `${keyword.toLowerCase()}::${page}`;
        const cached = musicSearchCacheRef.current[cacheKey];
        if (cached) {
            setSearchResults(cached.items);
            setSearchTotal(cached.total);
            setSearchPage(page);
            if (page === 1) {
                message.success('已加载缓存搜索结果');
            }
            return;
        }

        const offset = (page - 1) * MUSIC_SEARCH_PAGE_SIZE;
        setSearchLoading(true);
        try {
            const response = await request.get<any, MusicSearchResponse>(
                `/music/search?keyword=${encodeURIComponent(keyword)}&limit=${MUSIC_SEARCH_PAGE_SIZE}&offset=${offset}`
            );
            if (response.code === 200) {
                const normalizedData = response.data || [];
                const total = Math.max(
                    normalizedData.length,
                    response.pagination?.total || 0
                );
                musicSearchCacheRef.current[cacheKey] = {
                    items: normalizedData,
                    total,
                };
                setSearchResults(normalizedData);
                setSearchTotal(total);
                setSearchPage(page);
                if (page === 1 && normalizedData.length === 0) {
                    message.info('未检索到相关音乐');
                }
            } else {
                message.error(response.message || '搜索失败');
            }
        } catch (error) {
            console.error('搜索音乐失败:', error);
            message.error(`搜索失败：${getErrorDetail(error, '请稍后重试')}`);
        } finally {
            setSearchLoading(false);
        }
    };

    // 选择音乐
    const handleSelectMusic = (song: any) => {
        setMusicId(song.id.toString());
        setMusicName(`${song.name} - ${song.artist}`);
        message.success(`已选择: ${song.name}`);
    };

    // 清除音乐
    const handleClearMusic = () => {
        setMusicId('');
        setMusicName('');
    };

    const onFinish = async (values: any) => {
        if (!content.trim()) {
            message.error('请输入文章内容');
            return;
        }

        setLoading(true);
        const baseData = {
            title: values.title,
            content,
            cover: values.cover || coverUrl,
            description: values.description || content.substring(0, 100),
            type: true,
            top: false,
            musicId: musicId || null,
            musicName: musicName || null,
        };

        const createData = {
            ...baseData,
            categoryList: values.categories,
            tagList: values.tags,
            authorId: user?.id || 1,
        };

        const updateData = {
            ...baseData,
            categories: values.categories || [],
            tags: values.tags || [],
        };

        try {
            if (articleId) {
                await articleApi.update(articleId, updateData);
                message.success('文章更新成功！');
            } else {
                await articleApi.create(createData);
                message.success('文章发布成功！');
            }
            await refreshCategoryTagCandidates();
            router.push('/admin/articles');
        } catch (error) {
            console.error(error);
            message.error('保存文章失败');
        } finally {
            setLoading(false);
        }
    };

    const uploadProps: UploadProps = {
        customRequest: handleUpload,
        accept: 'image/*',
        showUploadList: false,
        maxCount: 1,
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-fade-in-up">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {articleId ? '✏️ 编辑文章' : '📝 创建文章'}
            </h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{}}
            >
                {/* 标题 */}
                <Form.Item
                    name="title"
                    label={<span className="text-gray-700 dark:text-gray-300">文章标题</span>}
                    rules={[{ required: true, message: '请输入文章标题' }]}
                >
                    <Input size="large" placeholder="输入一个吸引人的标题..." className="dark:bg-gray-700 dark:text-white" />
                </Form.Item>

                {/* 分类和标签 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="categories"
                        label={<span className="text-gray-700 dark:text-gray-300">分类</span>}
                    >
                        <Select
                            mode="tags"
                            placeholder="选择或输入分类"
                            className="dark:bg-gray-700"
                            options={categorySelectOptions}
                            optionFilterProp="label"
                            tokenSeparators={[',']}
                        />
                    </Form.Item>
                    <Form.Item
                        name="tags"
                        label={<span className="text-gray-700 dark:text-gray-300">标签</span>}
                    >
                        <Select
                            mode="tags"
                            placeholder="选择或输入标签"
                            className="dark:bg-gray-700"
                            options={tagSelectOptions}
                            optionFilterProp="label"
                            tokenSeparators={[',']}
                        />
                    </Form.Item>
                </div>

                {/* 封面图片区域 */}
                <Form.Item
                    label={<span className="text-gray-700 dark:text-gray-300">封面图片</span>}
                    className="mb-6"
                >
                    <div className="space-y-4">
                        {/* 工具栏 */}
                        <div className="flex flex-wrap gap-2">
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />} loading={uploadingCover}>上传图片</Button>
                            </Upload>
                            <Tooltip title="获取随机封面图片">
                                <Button
                                    icon={<ReloadOutlined spin={coverLoading} />}
                                    onClick={fetchRandomCover}
                                    loading={coverLoading}
                                >
                                    随机图片
                                </Button>
                            </Tooltip>
                            {coverUrl && (
                                <>
                                    <Tooltip title="预览图片">
                                        <Button
                                            icon={<EyeOutlined />}
                                            onClick={() => setPreviewVisible(true)}
                                        >
                                            预览
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="删除封面">
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={handleRemoveCover}
                                        >
                                            删除
                                        </Button>
                                    </Tooltip>
                                </>
                            )}
                        </div>

                        {/* URL 输入框 */}
                        <Form.Item name="cover" noStyle>
                            <Input
                                prefix={<PictureOutlined className="text-gray-400" />}
                                placeholder="输入图片 URL 或使用上方按钮获取图片"
                                onChange={handleCoverUrlChange}
                                className="dark:bg-gray-700 dark:text-white"
                            />
                        </Form.Item>

                        {uploadError && (
                            <Alert
                                type="error"
                                showIcon
                                message="封面上传失败"
                                description={uploadError}
                                action={
                                    <Button size="small" type="primary" danger onClick={handleRetryUpload} loading={uploadingCover}>
                                        重试上传
                                    </Button>
                                }
                            />
                        )}

                        {/* 封面预览 */}
                        {coverUrl && (
                            <div className="relative group">
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                    <Spin spinning={coverLoading}>
                                        <img
                                            src={coverUrl}
                                            alt="Cover Preview"
                                            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                message.error('图片加载失败，请检查 URL');
                                            }}
                                            onLoad={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'block';
                                            }}
                                        />
                                    </Spin>
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-lg">
                                    <Button
                                        type="primary"
                                        ghost
                                        icon={<EyeOutlined />}
                                        onClick={() => setPreviewVisible(true)}
                                    >
                                        查看大图
                                    </Button>
                                    <Button
                                        danger
                                        ghost
                                        icon={<DeleteOutlined />}
                                        onClick={handleRemoveCover}
                                    >
                                        删除
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Form.Item>

                {/* 背景音乐选择区域 */}
                <Form.Item
                    label={<span className="text-gray-700 dark:text-gray-300">🎵 背景音乐（可选）</span>}
                    className="mb-6"
                >
                    <div className="space-y-3">
                        {/* 已选择的音乐 */}
                        {musicId && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-pink-200 dark:border-purple-600">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🎶</span>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">{musicName}</span>
                                </div>
                                <Button size="small" danger onClick={handleClearMusic}>
                                    移除
                                </Button>
                            </div>
                        )}

                        {/* 搜索框 */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="搜索歌曲名称或歌手..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onPressEnter={() => {
                                    void handleSearchMusic();
                                }}
                                className="dark:bg-gray-700 dark:text-white"
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    void handleSearchMusic();
                                }}
                                loading={searchLoading}
                            >
                                搜索
                            </Button>
                        </div>

                        {/* 搜索结果 */}
                        {searchResults.length > 0 && (
                            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                                {searchResults.map((song: any) => (
                                    <div
                                        key={song.id}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-600"
                                        onClick={() => handleSelectMusic(song)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{song.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{song.artist}</p>
                                        </div>
                                        <Button size="small" type="link">选择</Button>
                                    </div>
                                ))}
                                {totalSearchPages > 1 && (
                                    <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-600">
                                        <span>第 {searchPage} / {totalSearchPages} 页，共 {searchTotal} 条</span>
                                        <div className="flex gap-2">
                                            <Button
                                                size="small"
                                                loading={searchLoading}
                                                disabled={searchPage <= 1 || searchLoading}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await handleSearchMusic(searchPage - 1);
                                                }}
                                            >
                                                上一页
                                            </Button>
                                            <Button
                                                size="small"
                                                loading={searchLoading}
                                                disabled={searchPage >= totalSearchPages || searchLoading}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await handleSearchMusic(searchPage + 1);
                                                }}
                                            >
                                                下一页
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <p className="text-xs text-gray-400">💡 添加背景音乐后，读者在阅读文章时可以播放</p>
                    </div>
                </Form.Item>

                {/* 内容编辑器 */}
                <Form.Item label={<span className="text-gray-700 dark:text-gray-300">文章内容</span>}>
                    <div data-color-mode="light" className="dark:hidden">
                        <MDEditor
                            value={content}
                            onChange={(val) => setContent(val || '')}
                            height={500}
                        />
                    </div>
                    <div data-color-mode="dark" className="hidden dark:block">
                        <MDEditor
                            value={content}
                            onChange={(val) => setContent(val || '')}
                            height={500}
                        />
                    </div>
                </Form.Item>

                {/* 操作按钮 */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button onClick={() => router.back()} size="large">
                        取消
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={loading}
                        size="large"
                    >
                        {articleId ? '更新文章' : '发布文章'}
                    </Button>
                </div>
            </Form>

            {/* 图片预览弹窗 */}
            <Modal
                open={previewVisible}
                title="封面预览"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                width={800}
                centered
            >
                <img
                    src={coverUrl}
                    alt="Cover Preview"
                    className="w-full h-auto rounded-lg"
                />
            </Modal>
        </div>
    );
}
