'use client';

import { Button, Table, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface AdminTableProps<T> {
    columns: any[];
    dataSource: T[];
    loading?: boolean;
    rowKey?: string;
    onEdit?: (record: T) => void;
    onDelete?: (record: T) => void;
    onCreate?: () => void;
    headerTitle?: string;
}

export default function AdminTable<T extends object>({
    columns,
    dataSource,
    loading,
    rowKey = 'id',
    onEdit,
    onDelete,
    onCreate,
    headerTitle
}: AdminTableProps<T>) {

    const actionColumn = {
        title: 'Actions',
        key: 'action',
        render: (_: any, record: T) => (
            <Space size="middle">
                {onEdit && (
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        ghost // Wireframe style
                    >
                        Edit
                    </Button>
                )}
                {onDelete && (
                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => onDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                )}
            </Space>
        ),
    };

    const finalColumns = [...columns, actionColumn];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{headerTitle || 'List'}</h2>
                {onCreate && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                        Create New
                    </Button>
                )}
            </div>
            <Table
                columns={finalColumns}
                dataSource={dataSource}
                loading={loading}
                rowKey={rowKey}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}
