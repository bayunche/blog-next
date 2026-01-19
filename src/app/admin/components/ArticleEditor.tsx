'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button, Input, Form, Select, message, Upload, Modal, Spin, Tooltip } from 'antd';
import { UploadOutlined, SaveOutlined, PictureOutlined, ReloadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { articleApi, Article } from '@/shared/api/article';
import request from '@/shared/api/request';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import type { UploadFile, UploadProps } from 'antd';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface ArticleEditorProps {
    articleId?: number;
}

// 随机图片 API 列表
const RANDOM_IMAGE_APIS = [
    'https://api.dujin.org/bing/1920.php',
    'https://picsum.photos/1920/1080',
    'https://source.unsplash.com/1920x1080/?nature,landscape',
    'https://api.ixiaowai.cn/gqapi/gqapi.php',
    'https://api.paugram.com/wallpaper',
];

export default function ArticleEditor({ articleId }: ArticleEditorProps) {
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [coverUrl, setCoverUrl] = useState('');
    const [coverLoading, setCoverLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    // 音乐相关状态
    const [musicId, setMusicId] = useState('');
    const [musicName, setMusicName] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const router = useRouter();

    // 获取随机封面图片
    const fetchRandomCover = useCallback(async () => {
        setCoverLoading(true);
        try {
            // 随机选择一个 API
            const randomApi = RANDOM_IMAGE_APIS[Math.floor(Math.random() * RANDOM_IMAGE_APIS.length)];
            // 添加时间戳避免缓存
            const url = `${randomApi}${randomApi.includes('?') ? '&' : '?'}t=${Date.now()}`;

            // 验证图片是否可访问
            const img = new Image();
            img.onload = () => {
                setCoverUrl(url);
                form.setFieldValue('cover', url);
                message.success('已获取随机封面图片');
                setCoverLoading(false);
            };
            img.onerror = () => {
                // 如果失败，使用备用 API
                const fallbackUrl = `https://picsum.photos/1920/1080?random=${Date.now()}`;
                setCoverUrl(fallbackUrl);
                form.setFieldValue('cover', fallbackUrl);
                message.success('已获取随机封面图片');
                setCoverLoading(false);
            };
            img.src = url;
        } catch (error) {
            console.error('获取随机图片失败:', error);
            message.error('获取随机图片失败');
            setCoverLoading(false);
        }
    }, [form]);

    // 文件上传处理
    const handleUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        try {
            await request.post('/article/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = `/public/uploads/${file.name}`;
            setCoverUrl(url);
            form.setFieldValue('cover', url);
            onSuccess(url);
            message.success('封面图片上传成功');
            return url;
        } catch (err) {
            onError(err);
            message.error('封面图片上传失败');
        }
    };

    // 删除封面
    const handleRemoveCover = () => {
        setCoverUrl('');
        form.setFieldValue('cover', '');
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
                    categories: res.category ? [res.category.name] : [],
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
    const handleSearchMusic = async () => {
        if (!searchKeyword.trim()) {
            message.warning('请输入搜索关键词');
            return;
        }
        setSearchLoading(true);
        try {
            const response = await request.get(`/music/search?keyword=${encodeURIComponent(searchKeyword)}`);
            if (response.data?.code === 200) {
                setSearchResults(response.data.data || []);
            } else {
                message.error('搜索失败');
            }
        } catch (error) {
            console.error('搜索音乐失败:', error);
            message.error('搜索失败，请稍后重试');
        } finally {
            setSearchLoading(false);
        }
    };

    // 选择音乐
    const handleSelectMusic = (song: any) => {
        setMusicId(song.id.toString());
        setMusicName(`${song.name} - ${song.artist}`);
        setSearchResults([]);
        setSearchKeyword('');
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
        const data = {
            title: values.title,
            content,
            cover: values.cover || coverUrl,
            categoryList: values.categories,
            tagList: values.tags,
            authorId: 1,
            type: true,
            top: false,
            musicId: musicId || null,
            musicName: musicName || null,
        };

        try {
            if (articleId) {
                await articleApi.update(articleId, data);
                message.success('文章更新成功！');
            } else {
                await articleApi.create(data);
                message.success('文章发布成功！');
            }
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
                        <Select mode="tags" placeholder="选择或输入分类" className="dark:bg-gray-700" />
                    </Form.Item>
                    <Form.Item
                        name="tags"
                        label={<span className="text-gray-700 dark:text-gray-300">标签</span>}
                    >
                        <Select mode="tags" placeholder="选择或输入标签" className="dark:bg-gray-700" />
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
                                <Button icon={<UploadOutlined />}>上传图片</Button>
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
                                onPressEnter={handleSearchMusic}
                                className="dark:bg-gray-700 dark:text-white"
                            />
                            <Button
                                type="primary"
                                onClick={handleSearchMusic}
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
