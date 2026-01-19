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
            message.error('Failed to fetch tags');
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
            message.success('Tag deleted successfully');
            fetchTags();
        } catch (error) {
            message.error('Failed to delete tag');
        }
    };

    const handleEdit = (record: Tag) => {
        let newName = record.name;
        Modal.confirm({
            title: 'Edit Tag Name',
            content: <Input defaultValue={record.name} onChange={(e) => newName = e.target.value} />,
            onOk: async () => {
                if (!newName) return;
                try {
                    await tagApi.update(record.name, newName);
                    message.success('Tag updated');
                    fetchTags();
                } catch (err) {
                    message.error('Failed to update tag');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
        },
    ];

    return (
        <AdminTable
            headerTitle="Tags"
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
