'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { message, Tag } from 'antd';
import AdminTable from '../components/AdminTable';
import { articleApi, Article } from '@/shared/api/article';
import dayjs from 'dayjs';

export default function ArticleListPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const res = await articleApi.getList({ page: 1, pageSize: 100 }); // Simple pagination for now
            setArticles(res.rows);
        } catch (error) {
            message.error('Failed to fetch articles');
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
            message.success('Article deleted successfully');
            fetchArticles(); // Refresh list
        } catch (error) {
            message.error('Failed to delete article');
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (cat: any) => cat?.name || 'Uncategorized',
        },
        {
            title: 'Views',
            dataIndex: 'viewCount',
            key: 'viewCount',
        },
    ];

    return (
        <AdminTable
            headerTitle="Articles"
            columns={columns}
            dataSource={articles}
            loading={loading}
            onCreate={() => router.push('/admin/articles/create')}
            onEdit={(record) => router.push(`/admin/articles/edit/${record.id}`)}
            onDelete={handleDelete}
        />
    );
}
