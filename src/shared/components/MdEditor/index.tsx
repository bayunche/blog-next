/**
 * Markdown 编辑器组件
 * 基于 @uiw/react-md-editor
 */

import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

export interface MdEditorProps {
  /** 编辑器内容 */
  value?: string
  /** 内容变更回调 */
  onChange?: (value?: string) => void
  /** 编辑器高度 */
  height?: number | string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否隐藏工具栏 */
  hideToolbar?: boolean
  /** 主题模式 */
  colorMode?: 'light' | 'dark'
}

/**
 * Markdown 编辑器组件
 */
export function MdEditor({
  value,
  onChange,
  height = 500,
  disabled = false,
  hideToolbar = false,
  colorMode = 'light',
}: MdEditorProps) {
  return (
    <div data-color-mode={colorMode}>
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="live"
        hideToolbar={hideToolbar}
        enableScroll={true}
        visibleDragbar={false}
        textareaProps={{
          disabled,
          placeholder: '请输入 Markdown 内容...',
        }}
      />
    </div>
  )
}

export default MdEditor
