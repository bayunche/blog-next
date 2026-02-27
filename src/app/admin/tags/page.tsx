'use client';

import { useEffect, useState } from 'react';
import { message, Modal, Input } from 'antd';
import AdminTable from '../components/AdminTable';
import { tagApi, Tag } from '@/shared/api/tag';

export default function TagListPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const res = await tagApi.getList();
            setTags(res);
        } catch (error) {
            message.error('获取标签失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleDelete = async (record: Tag) => {
        try {
            await tagApi.delete(record.name);
            message.success('标签删除成功');
            fetchTags();
        } catch (error) {
            message.error('标签删除失败');
        }
    };

    const handleEdit = (record: Tag) => {
        let newName = record.name;
        Modal.confirm({
            title: '修改标签名称',
            content: <Input defaultValue={record.name} onChange={(e) => newName = e.target.value} />,
            onOk: async () => {
                if (!newName) return;
                try {
                    await tagApi.update(record.name, newName);
                    message.success('标签已更新');
                    fetchTags();
                } catch (err) {
                    message.error('标签更新失败');
                }
            }
        });
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '文章数量',
            dataIndex: 'count',
            key: 'count',
        },
    ];

    return (
        <AdminTable
            headerTitle="标签管理"
            columns={columns}
            dataSource={tags}
            loading={loading}
            rowKey="name"
            onEdit={handleEdit}
            onDelete={handleDelete}
        // No create button for tags as they are created with articles
        />
    );
}
