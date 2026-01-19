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
        } catch (error) {
            message.error('Failed to fetch categories');
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
            message.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            message.error('Failed to delete category');
        }
    };

    const handleEdit = (record: Category) => {
        let newName = record.name;
        Modal.confirm({
            title: 'Edit Category Name',
            content: <Input defaultValue={record.name} onChange={(e) => newName = e.target.value} />,
            onOk: async () => {
                if (!newName) return;
                try {
                    await categoryApi.update(record.name, newName);
                    message.success('Category updated');
                    fetchCategories();
                } catch (err) {
                    message.error('Failed to update category');
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
            headerTitle="Categories"
            columns={columns}
            dataSource={categories}
            loading={loading}
            rowKey="name"
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
