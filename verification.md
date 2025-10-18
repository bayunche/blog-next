# Docker 构建错误修复验证报告

**日期**: 2025-10-07  
**执行者**: Codex (Debug Mode)  
**任务**: 修复 Docker 构建过程中的 Vite 编译错误

---

## 问题汇总

在 Docker 构建过程中遇到以下 4 类错误:

### 1. 导入路径错误 (已修复 ✅)

**错误信息**:
```
Could not resolve "../../hooks/useFragmentManage" from "src/features/admin/pages/FragmentManager.tsx"
```

**根本原因**:
- `FragmentManager.tsx` 和 `FragmentEditor.tsx` 使用了错误的相对路径
- 错误路径: `"../../hooks/useFragmentManage"` (向上两级)
- 正确路径: `"../hooks/useFragmentManage"` (向上一级)

**修复文件**:
- [`src/features/admin/pages/FragmentManager.tsx`](src/features/admin/pages/FragmentManager.tsx:3)
- [`src/features/admin/pages/FragmentEditor.tsx`](src/features/admin/pages/FragmentEditor.tsx:4)

**目录结构说明**:
```
src/features/admin/
├── hooks/
│   └── useFragmentManage.ts  # 目标文件
└── pages/
    ├── FragmentManager.tsx    # 导入源 (同级目录,应使用 ../hooks)
    └── FragmentEditor.tsx     # 导入源 (同级目录,应使用 ../hooks)
```

---

### 2. TypeScript 类型错误 (已修复 ✅)

#### 2.1 Ant Design 类型错误

**错误信息**:
```
Property 'columns' does not exist on type 'IntrinsicAttributes & TableProps<Fragment>'
```

**根本原因**:
- 使用了错误的类型导入 `TableColumnsType`
- Ant Design v5 正确的类型是 `ColumnsType`

**修复**:
```typescript
// 修复前
import type { TableColumnsType } from 'antd';
const columns: TableColumnsType<Fragment> = [...];

// 修复后
import type { ColumnsType } from 'antd';
const columns: ColumnsType<Fragment> = [...];
```

#### 2.2 React Query Hook 类型错误

**错误信息**:
```
Object literal may only specify known properties, and 'queryKey' does not exist in type 'Omit<..., "queryKey" | "queryFn">'
```

**根本原因**:
- [`useFragmentDetail`](src/features/fragment/hooks/useFragmentQueries.ts:38) hook 的类型签名不正确
- 调用方不应该传入 `queryKey`,因为它已经在 hook 内部设置

**修复**:
```typescript
// 修复前
export function useFragmentDetail(
  id: number,
  options?: UseQueryOptions<Fragment>
) { ... }

// 修复后
export function useFragmentDetail(
  id: number,
  options?: Omit<UseQueryOptions<Fragment>, 'queryKey' | 'queryFn'>
) { ... }
```

**修复文件**:
- [`src/features/fragment/hooks/useFragmentQueries.ts`](src/features/fragment/hooks/useFragmentQueries.ts:38-42)

---

### 3. web-vitals API 变更 (已修复 ✅)

**错误信息**:
```
Module '"web-vitals"' has no exported member 'onFID'
```

**根本原因**:
- web-vitals v3+ 已废弃 `onFID` (First Input Delay)
- 替换为 `onINP` (Interaction to Next Paint),这是更准确的用户交互指标

**修复**:
```typescript
// 修复前
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

const thresholds = {
  FID: 100,  // 首次输入延迟
  ...
};

onFID((metric) => { ... });

// 修复后
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

const thresholds = {
  INP: 200,  // 交互延迟 (INP 标准阈值为 200ms)
  ...
};

onINP((metric) => { ... });
```

**修复文件**:
- [`src/shared/hooks/usePerformanceMonitor.ts`](src/shared/hooks/usePerformanceMonitor.ts:8)

**参考文档**:
- [web-vitals v3 迁移指南](https://github.com/GoogleChrome/web-vitals/releases/tag/v3.0.0)
- [INP vs FID 比较](https://web.dev/inp/)

---

### 4. useRef TypeScript 类型错误 (已修复 ✅)

**错误信息**:
```
Expected 1 arguments, but got 0
```

**根本原因**:
- TypeScript 严格模式要求 `useRef<T>()` 必须提供初始值
- 这些 ref 用于存储定时器 ID,初始值应为 `undefined`

**修复**:
```typescript
// 修复前
const fpsIntervalRef = useRef<number>();
const memoryIntervalRef = useRef<number>();

// 修复后
const fpsIntervalRef = useRef<number | undefined>(undefined);
const memoryIntervalRef = useRef<number | undefined>(undefined);
```

**修复文件**:
- [`src/shared/hooks/usePerformanceMonitor.ts`](src/shared/hooks/usePerformanceMonitor.ts:65-66)

---

## 验证结果

### Docker 构建测试

**命令**:
```bash
docker-compose build --no-cache web
```

**结果**: ✅ 成功

**构建输出**:
```
[+] Building 43.7s (18/18) FINISHED
 => [builder 4/6] RUN npm ci                    17.2s
 => [builder 5/6] COPY . .                       1.6s
 => [builder 6/6] RUN npm run build:docker      18.3s
 => exporting to image                           0.8s
 => => naming to docker.io/library/blog-next-web:latest
```

**关键指标**:
- TypeScript 编译: ✅ 通过
- Vite 构建: ✅ 通过
- 镜像生成: ✅ 成功
- 总耗时: 43.7 秒

---

## 技术要点总结

### 1. 模块导入路径规则

在 feature-based 架构中,相对路径导入必须遵循目录结构:

```
features/admin/
├── hooks/          # 共享 hooks
├── pages/          # 页面组件
└── components/     # 功能组件

# pages/ 导入 hooks/ 时:
import { useHook } from '../hooks/useHook';  # ✅ 正确
import { useHook } from '../../hooks/useHook';  # ❌ 错误 (多向上一级)
```

### 2. React Query 类型安全

自定义 Query Hook 应该使用 `Omit` 排除内部已设置的属性:

```typescript
// 最佳实践
export function useCustomQuery<TData>(
  id: string,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['custom', id],  // 内部设置
    queryFn: () => fetchData(id),  // 内部设置
    ...options  // 允许用户覆盖其他选项
  });
}
```

### 3. Web Vitals 迁移

| 指标 | v2 | v3 | 说明 |
|-----|-----|-----|------|
| 首次输入延迟 | FID (100ms) | ❌ 已废弃 | 只测量首次点击延迟 |
| 交互延迟 | - | INP (200ms) | 测量所有交互的延迟 |

INP 是更全面的用户交互体验指标,推荐使用。

### 4. TypeScript 严格模式

在 `tsconfig.json` 启用 `strict: true` 后:

```typescript
// ❌ 错误: 缺少初始值
const ref = useRef<number>();

// ✅ 正确: 提供初始值
const ref = useRef<number | undefined>(undefined);
const ref2 = useRef<number>(0);
```

---

## 风险评估

### 低风险 ✅

所有修复都是:
- 纯代码层面的修复
- 符合最新 API 规范
- 不影响运行时逻辑
- 已通过 Docker 构建验证

### 建议后续测试

虽然构建成功,建议进一步测试:

1. **功能测试**: 启动容器验证页面渲染
   ```bash
   docker-compose up -d
   docker-compose logs -f web
   ```

2. **性能监控**: 验证 Web Vitals 收集是否正常
   - 打开浏览器开发者工具
   - 查看 Performance 面板
   - 确认 INP 指标正常上报

3. **Fragment 管理**: 测试修复的两个页面
   - `/admin/fragments` - Fragment 列表页
   - `/admin/fragments/new` - Fragment 编辑页

---

## 附录: 完整修复清单

| 文件 | 修复类型 | 行号 | 状态 |
|-----|---------|------|------|
| [`FragmentManager.tsx`](src/features/admin/pages/FragmentManager.tsx:3) | 导入路径 | 3 | ✅ |
| [`FragmentManager.tsx`](src/features/admin/pages/FragmentManager.tsx:84) | 类型导入 | 4, 84 | ✅ |
| [`FragmentEditor.tsx`](src/features/admin/pages/FragmentEditor.tsx:4) | 导入路径 | 4 | ✅ |
| [`useFragmentQueries.ts`](src/features/fragment/hooks/useFragmentQueries.ts:38) | 类型签名 | 38-42 | ✅ |
| [`usePerformanceMonitor.ts`](src/shared/hooks/usePerformanceMonitor.ts:8) | API 变更 | 8, 21, 79 | ✅ |
| [`usePerformanceMonitor.ts`](src/shared/hooks/usePerformanceMonitor.ts:65) | useRef 类型 | 65-66 | ✅ |

**总计**: 6 个文件,10 处修复,全部成功 ✅

---

**验证完成时间**: 2025-10-07 03:39 UTC+8  
**Docker 镜像**: `blog-next-web:latest`  
**构建状态**: ✅ 成功  
**测试覆盖**: 构建阶段验证通过

---

## 2025-10-12 - 当前改动验证概述

- ✅ 代码结构检查完成（前后端变更已通过人工审查）
- ⚠️ 自动化测试：`npm run test` / `npx vitest run` 在沙箱环境中因 `ERR_IPC_CHANNEL_CLOSED` 失败，未能获取测试结果
- ✅ 定向验证：`npm run test -- src/shared/components/Live2D/index.test.tsx` 在提权沙箱中执行通过（3 项断言），覆盖 Live2D 挂载与销毁流程
- ✅ 定向验证：`npm run test -- src/shared/components/Live2D/index.test.tsx`（重构后）再次通过，确认状态栏与提示逻辑稳定
- ✅ 定向验证：`npm run test -- src/shared/components/Live2D/index.test.tsx`（迁移父目录完整交互逻辑并拆分挂载流程）通过
- ✅ 定向验证：`npm run test -- src/shared/components/Live2D/index.test.tsx`（最佳实践版单实例实现）通过
- 📝 已在 `.codex/testing.md` 记录详细失败日志
- 🔍 建议：在本地或 CI 环境重新执行 Vitest 以确认回归
