'use client';

import { Button, Popconfirm, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

type AdminColumns<T extends object> = NonNullable<TableProps<T>['columns']>;

interface AdminTableProps<T extends object> {
    columns: AdminColumns<T>;
    dataSource: T[];
    loading?: boolean;
    rowKey?: TableProps<T>['rowKey'];
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
    headerTitle,
}: AdminTableProps<T>) {
    const actionColumn: AdminColumns<T>[number] = {
        title: 'Actions',
        key: 'action',
        render: (_: unknown, record: T) => (
            <Space size="small" wrap>
                {onEdit ? (
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        ghost
                    >
                        Edit
                    </Button>
                ) : null}

                {onDelete ? (
                    <Popconfirm
                        title="Delete item?"
                        description="This action cannot be undone."
                        onConfirm={() => onDelete(record)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                ) : null}
            </Space>
        ),
    };

    const finalColumns: AdminColumns<T> = [...columns, actionColumn];

    return (
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-4 shadow-xl backdrop-blur-md animate-fade-in-up dark:bg-gray-800/70 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">{headerTitle || 'List'}</h2>
                {onCreate ? (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                        Create
                    </Button>
                ) : null}
            </div>

            <Table
                columns={finalColumns}
                dataSource={dataSource}
                loading={loading}
                rowKey={rowKey}
                size="small"
                scroll={{ x: 720 }}
                pagination={{ pageSize: 10, responsive: true, showSizeChanger: false }}
            />
        </div>
    );
}
