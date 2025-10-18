/**
 * 文章编辑页面
 */

import { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Card,
  message,
  Upload,
  type UploadProps,
} from 'antd'
import { SaveOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { MdEditor } from '@shared/components/MdEditor'
import {
  useArticleManageDetail,
  useCreateArticle,
  useUpdateArticle,
  useUploadImage,
} from '../hooks/useArticleManage'
import { useCategories, useTags } from '@features/article'
import type { ArticleFormData } from '../api/article'

const { TextArea } = Input

/**
 * 文章编辑页面组件
 */
export function ArticleEditor() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const [form] = Form.useForm()
  const [content, setContent] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')

  // 数据加载
  const { data: article, isLoading } = useArticleManageDetail(Number(id))
  const { data: categories } = useCategories()
  const { data: tags } = useTags()

  // 操作 Hooks
  const createMutation = useCreateArticle()
  const updateMutation = useUpdateArticle()
  const uploadMutation = useUploadImage()

  // 编辑模式下回填数据
  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        title: article.title,
        summary: article.summary,
        categoryId: article.category
          ? { value: article.category.id, label: article.category.name }
          : undefined,
        tagIds: article.tags?.map((t) => ({ value: t.id, label: t.name })),
      })
      setContent(article.content || '')
      setCoverImageUrl(article.coverImage || '')
    }
  }, [article, form])

  // 上传封面图
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片文件')
        return false
      }

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB')
        return false
      }

      uploadMutation.mutate(file, {
        onSuccess: (data) => {
          setCoverImageUrl(data.url)
          message.success('上传成功')
        },
      })

      return false
    },
    showUploadList: false,
  }

  const handleFinish = async (status: 'draft' | 'published') => {
    try {
      const values = await form.validateFields()
      const data: ArticleFormData = {
        ...values,
        categoryId: values.categoryId?.value,
        tagIds: values.tagIds?.map((t: { value: number }) => t.value),
        content,
        coverImage: coverImageUrl,
        status,
      }

      if (isEdit) {
        updateMutation.mutate(
          { id: Number(id), data },
          {
            onSuccess: () => navigate('/admin/article/manager'),
          }
        )
      } else {
        createMutation.mutate(data, {
          onSuccess: () => navigate('/admin/article/manager'),
        })
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  if (isEdit && isLoading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>加载中...</div>
  }

  return (
    <div>
      <Card
        title={isEdit ? '编辑文章' : '新建文章'}
        extra={
          <Space>
            <Button onClick={() => navigate('/admin/article/manager')}>取消</Button>
            <Button
              icon={<SaveOutlined />}
              onClick={() => handleFinish('draft')}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              保存草稿
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleFinish('published')}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              发布文章
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          {/* 标题 */}
          <Form.Item
            label="文章标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" size="large" />
          </Form.Item>

          {/* 分类和标签 */}
          <Space size="large" style={{ width: '100%', marginBottom: 24 }}>
            <Form.Item
              label="分类"
              name="categoryId"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select
                placeholder="选择分类"
                allowClear
                labelInValue
                options={categories?.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="标签"
              name="tagIds"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select
                mode="multiple"
                placeholder="选择标签"
                allowClear
                labelInValue
                options={tags?.map((tag) => ({
                  label: tag.name,
                  value: tag.id,
                }))}
              />
            </Form.Item>
          </Space>

          {/* 封面图 */}
          <Form.Item label="封面图">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} loading={uploadMutation.isPending}>
                  上传封面图
                </Button>
              </Upload>
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt="封面图"
                  style={{ maxWidth: '300px', maxHeight: '200px' }}
                />
              )}
            </Space>
          </Form.Item>

          {/* 摘要 */}
          <Form.Item label="文章摘要" name="summary">
            <TextArea
              placeholder="请输入文章摘要（选填，用于列表展示）"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          {/* Markdown 编辑器 */}
          <Form.Item label="文章内容" required>
            <MdEditor value={content} onChange={(val) => setContent(val || '')} height={600} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ArticleEditor
