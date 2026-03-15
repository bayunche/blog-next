'use client';

import { useEffect, useState } from 'react';
import { message, Modal, Input } from 'antd';
import AdminTable from '../components/AdminTable';
import { categoryApi, Category } from '@/shared/api/category';

export default function CategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categoryApi.getList();
            setCategories(res);
        } catch {
            message.error('获取分类失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (record: Category) => {
        try {
            await categoryApi.delete(record.name);
            message.success('分类删除成功');
            fetchCategories();
        } catch {
            message.error('分类删除失败');
        }
    };

    const handleEdit = (record: Category) => {
        let newName = record.name;
        Modal.confirm({
            title: '修改分类名称',
            content: <Input defaultValue={record.name} onChange={(e) => newName = e.target.value} />,
            onOk: async () => {
                if (!newName) return;
                try {
                    await categoryApi.update(record.name, newName);
                    message.success('分类已更新');
                    fetchCategories();
                } catch {
                    message.error('分类更新失败');
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
            headerTitle="分类管理"
            columns={columns}
            dataSource={categories}
            loading={loading}
            rowKey="name"
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
