'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import dayjs from 'dayjs';
import AdminTable from '../components/AdminTable';
import { articleApi, Article } from '@/shared/api/article';
import { getPrimaryCategory } from '@/shared/utils/articleDisplay';

export default function ArticleListPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const res = await articleApi.getList({ page: 1, pageSize: 100 });
            setArticles(res.rows || []);
        } catch {
            message.error('获取文章列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (record: Article) => {
        try {
            await articleApi.delete(record.id);
            message.success('文章删除成功');
            fetchArticles();
        } catch {
            message.error('文章删除失败');
        }
    };

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            render: (_: unknown, record: Article) => getPrimaryCategory(record)?.name || '未分类',
        },
        {
            title: '查看次数',
            dataIndex: 'viewCount',
            key: 'viewCount',
        },
    ];

    return (
        <AdminTable
            headerTitle="文章管理"
            columns={columns}
            dataSource={articles}
            loading={loading}
            onCreate={() => router.push('/admin/articles/create')}
            onEdit={(record) => router.push(`/admin/articles/edit/${record.id}`)}
            onDelete={handleDelete}
        />
    );
}
