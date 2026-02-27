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
        title: '操作',
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
                        编辑
                    </Button>
                )}
                {onDelete && (
                    <Popconfirm
                        title="确定删除？"
                        description="此操作不可撤销，确定要删除吗？"
                        onConfirm={() => onDelete(record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                )}
            </Space>
        ),
    };

    const finalColumns = [...columns, actionColumn];

    return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{headerTitle || '列表'}</h2>
                {onCreate && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                        新增
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
