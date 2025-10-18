/**
 * “闲言”编辑器页面
 */

import { useEffect } from 'react'
import { Button, Card, Form, Input, message, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useCreateFragment,
  useFragmentDetail,
  useUpdateFragment,
} from '@features/fragment'

const { TextArea } = Input

export function FragmentEditor() {
  const { id } = useParams<{ id?: string }>()
  const fragmentId = id ? Number(id) : 0
  const isEdit = fragmentId > 0

  const navigate = useNavigate()
  const [form] = Form.useForm<{ author?: string; content: string }>()

  const detailQuery = useFragmentDetail(fragmentId, { enabled: isEdit })

  const createMutation = useCreateFragment({
    onSuccess: () => {
      message.success('已创建碎片')
      navigate('/admin/fragment/manager')
    },
    onError: err => {
      message.error(err.message ?? '操作失败')
    },
  })

  const updateMutation = useUpdateFragment(fragmentId, {
    onSuccess: () => {
      message.success('已更新碎片')
      navigate('/admin/fragment/manager')
    },
    onError: err => {
      message.error(err.message ?? '操作失败')
    },
  })

  useEffect(() => {
    if (detailQuery.data) {
      form.setFieldsValue({
        author: detailQuery.data.author ?? '',
        content: detailQuery.data.content,
      })
    }
  }, [detailQuery.data, form])

  const handleSubmit = (values: { author?: string; content: string }) => {
    if (isEdit) {
      updateMutation.mutate(values)
    } else {
      createMutation.mutate(values)
    }
  }

  const submitting = createMutation.isPending || updateMutation.isPending

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700 }}>
      <Card title={isEdit ? '编辑碎片' : '新建碎片'}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ author: '', content: '' }}
          onFinish={handleSubmit}
        >
          <Form.Item label="作者" name="author">
            <Input placeholder="可选" allowClear />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[
              { required: true, message: '请输入碎片内容' },
              { min: 3, message: '内容至少 3 个字符' },
            ]}
          >
            <TextArea rows={10} placeholder="记录你的灵感..." />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate(-1)}>取消</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEdit ? '保存' : '创建'}
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  )
}

export default FragmentEditor
