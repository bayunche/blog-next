/**
 * Admin fragment editor page
 */

import { useEffect } from 'react'
import { Button, Card, Form, Input, message, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useCreateFragmentMutation,
  useFragmentDetailQuery,
  useUpdateFragmentMutation,
} from '../../hooks/useFragmentManage'

const { TextArea } = Input

export function FragmentEditor() {
  const { id } = useParams<{ id?: string }>()
  const fragmentId = id ? Number(id) : 0
  const isEdit = fragmentId > 0

  const navigate = useNavigate()
  const [form] = Form.useForm<{ author?: string; content: string }>()

  const detailQuery = useFragmentDetailQuery(fragmentId, { enabled: isEdit })

  const createMutation = useCreateFragmentMutation({
    onSuccess: () => {
      message.success('\u5df2\u521b\u5efa\u788e\u7247')
      navigate('/admin/fragment/manager')
    },
    onError: err => {
      message.error(err.message ?? '\u64cd\u4f5c\u5931\u8d25')
    },
  })

  const updateMutation = useUpdateFragmentMutation(fragmentId, {
    onSuccess: () => {
      message.success('\u5df2\u66f4\u65b0\u788e\u7247')
      navigate('/admin/fragment/manager')
    },
    onError: err => {
      message.error(err.message ?? '\u64cd\u4f5c\u5931\u8d25')
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
      <Card title={isEdit ? '\u7f16\u8f91\u788e\u7247' : '\u65b0\u5efa\u788e\u7247'}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ author: '', content: '' }}
          onFinish={handleSubmit}
        >
          <Form.Item label="\u4f5c\u8005" name="author">
            <Input placeholder="\u53ef\u9009" allowClear />
          </Form.Item>

          <Form.Item
            label="\u5185\u5bb9"
            name="content"
            rules={[
              { required: true, message: '\u8bf7\u8f93\u5165\u788e\u7247\u5185\u5bb9' },
              { min: 3, message: '\u5185\u5bb9\u81f3\u5c11 3 \u4e2a\u5b57\u7b26' },
            ]}
          >
            <TextArea rows={10} placeholder="\u8bb0\u5f55\u4f60\u7684\u7075\u611f..." />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate(-1)}>\u53d6\u6d88</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEdit ? '\u4fdd\u5b58' : '\u521b\u5efa'}
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  )
}

export default FragmentEditor
