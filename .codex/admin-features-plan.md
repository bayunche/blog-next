# Admin Features Implementation Plan

**Date**: 2025-10-06
**Executor**: Codex
**Status**: Planning

## 概述

本文档规划三个管理后台功能的实施方案：
1. 文章统计图表页面 (ArticleAnalytics)
2. 文章批量操作功能 (Batch Operations)
3. 实时监控仪表板 (Monitor Dashboard)

---

## 1. 文章统计图表页面 (ArticleAnalytics)

### 1.1 功能描述

展示各文章的浏览记录统计，使用折线图按日期展示每篇文章的访问量。

### 1.2 技术实现

**前端组件**: `src/features/admin/pages/ArticleGraphPage.tsx`

**依赖库**: `@ant-design/plots` (Line 组件)

**数据源**: `GET /record` 接口

**数据格式**:
```typescript
interface RecordDataPoint {
  articleId: string
  time: string      // 日期 (YYYY-MM-DD)
  cnt: number       // 访问次数
}
```

**图表配置**:
- xField: `time` (时间轴)
- yField: `cnt` (访问次数)
- seriesField: `articleId` (按文章分组)
- legend: 顶部展示
- smooth: 平滑曲线
- animation: 5秒动画

### 1.3 实施步骤

1. ✅ **后端验证**:
   - `server/router/record.js` 已存在 `GET /record` 路由
   - `server/controllers/record.js` 已实现 `fetchRecordByDay` 方法
   - 数据按 articleId 和日期分组统计

2. **创建 API 层**:
   - 在 `src/features/admin/api/record.ts` 创建 API 函数
   - 实现类型定义

3. **创建 Hook**:
   - 在 `src/features/admin/hooks/useArticleRecords.ts` 创建 React Query hook
   - 缓存策略: 5 分钟 staleTime

4. **创建页面组件**:
   - 在 `src/features/admin/pages/ArticleGraphPage.tsx` 创建页面
   - 使用 `@ant-design/plots` 的 Line 组件
   - 加载状态、错误处理

5. **测试**:
   - 创建 `ArticleGraphPage.test.tsx`
   - 验证图表配置正确性
   - 验证路由映射 (已在 routes.config.test.tsx)

### 1.4 验收标准

- [ ] `/admin/article/graph` 路由正常工作
- [ ] 图表正确展示多文章访问趋势
- [ ] 图例可交互（点击切换文章显示）
- [ ] 加载/错误状态正确处理
- [ ] 测试覆盖率 > 80%

---

## 2. 文章批量操作功能

### 2.1 功能描述

在文章管理页面提供批量操作能力：
- 批量删除
- 批量导出
- 批量设为公开/私密
- 批量置顶/取消置顶

### 2.2 技术实现

**前端组件**:
- `src/features/admin/components/BatchActions.tsx` - 批量操作工具栏
- `src/features/admin/hooks/useArticleBatch.ts` - 批量操作逻辑 Hook

**后端接口**:
- ✅ `DELETE /article/list/:ids` - 批量删除 (已存在)
- ✅ `GET /article/output/list/:ids` - 批量导出 (已存在)
- ✅ `GET /article/output/all` - 导出全部 (已存在)
- ❌ `PUT /article/batch/status` - 批量更新状态 (需新增)

**状态管理**:
- `batchMode`: boolean - 批量模式开关
- `selectedRowKeys`: number[] - 选中的文章 ID
- `loading`: boolean - 操作加载状态

### 2.3 实施步骤

#### 后端实现

1. **创建批量更新接口**:
   - 在 `server/controllers/article.js` 添加 `batchUpdateStatus` 方法
   - 路由: `PUT /article/batch/status`
   - 请求体: `{ ids: number[], type?: boolean, top?: boolean }`
   - 使用 Sequelize `update` 方法批量更新

2. **在路由中注册**:
   - 在 `server/router/article.js` 添加路由

#### 前端实现

3. **创建 BatchActions 组件**:
   - Switch 切换批量模式
   - 选中计数徽章
   - 批量操作按钮组（导出、删除、更多操作）
   - Dropdown 菜单（公开/私密、置顶/取消置顶）

4. **创建 useArticleBatch Hook**:
   - 管理批量模式状态
   - 管理选中项
   - 提供批量操作方法（使用 React Query mutations）
   - 返回 `getRowSelection` 配置给 Table

5. **集成到 ArticleManager**:
   - 引入 BatchActions 组件
   - 使用 useArticleBatch Hook
   - 传递 rowSelection 给 Table 组件
   - 刷新列表时清空选中项

6. **创建 API 层**:
   - 在 `src/features/admin/api/article.ts` 添加批量操作 API 函数
   - 使用 React Query mutations

### 2.4 验收标准

- [ ] 批量模式切换正常
- [ ] 表格支持多选
- [ ] 批量删除功能正常（带确认弹窗）
- [ ] 批量导出功能正常（下载文件）
- [ ] 批量设为公开/私密功能正常
- [ ] 批量置顶/取消置顶功能正常
- [ ] 操作后自动刷新列表
- [ ] 操作后清空选中项
- [ ] 测试覆盖批量操作逻辑

---

## 3. 实时监控仪表板

### 3.1 功能描述

展示服务器和前端性能监控数据：

**服务器监控**:
- CPU 使用率 (Gauge 仪表盘 + Area 趋势图)
- 内存使用率 (Liquid 水球图 + Area 趋势图)

**前端监控**:
- 性能指标 (FPS, CLS, LCP, FID 等)
- 帧率趋势图
- 内存使用概览
- 路由耗时记录

### 3.2 技术实现

**前端组件**: `src/features/admin/pages/MonitorPage.tsx`

**依赖库**:
- `@ant-design/plots` - Gauge, Area, Liquid 图表
- `socket.io-client` - WebSocket 连接
- `zustand` - 性能数据状态管理

**Socket 连接**:
- 服务器地址: `${SERVER_URL}:1234`
- 事件: `systemUpdate`
- 数据: `{ cpuUsage: string, MemUsage: string }`

**Zustand Store**: `src/shared/stores/performanceStore.ts`

```typescript
interface PerformanceStore {
  metrics: PerformanceMetric[]
  fpsHistory: FPSRecord[]
  memoryUsage: MemoryStats | null
  navigationHistory: NavigationRecord[]

  addMetric: (metric: PerformanceMetric) => void
  addFPS: (fps: number) => void
  updateMemory: (stats: MemoryStats) => void
  addNavigation: (record: NavigationRecord) => void
}
```

### 3.3 实施步骤

1. **创建 performanceStore**:
   - 在 `src/shared/stores/performanceStore.ts` 创建 Zustand store
   - 实现状态和更新方法
   - 限制历史记录长度（避免内存泄漏）

2. **创建性能监控钩子**:
   - 在 `src/shared/hooks/usePerformanceMonitor.ts` 创建 Hook
   - 使用 Web Vitals API 收集 FPS、CLS、LCP 等指标
   - 使用 Performance API 收集内存和导航数据
   - 自动上报到 performanceStore

3. **创建 MonitorPage 组件**:
   - CPU Gauge 仪表盘 + 历史趋势图
   - 内存 Liquid 水球图 + 历史趋势图
   - 前端性能指标列表（带评分标签）
   - 帧率趋势 Area 图
   - 内存使用统计卡片
   - 路由耗时记录列表

4. **集成 Socket.io**:
   - 在组件 mount 时连接 WebSocket
   - 监听 `systemUpdate` 事件
   - 更新 CPU/内存状态
   - 维护历史数据（最近 120 条）
   - 组件 unmount 时断开连接

5. **启动监控接口**:
   - 在组件 mount 时调用 `GET /monitor/start` 启动后端监控

6. **在 App 根组件集成性能监控**:
   - 在 `src/app/App.tsx` 中使用 `usePerformanceMonitor`
   - 全局收集性能数据

### 3.4 验收标准

- [ ] Socket.io 连接正常，实时接收服务器数据
- [ ] CPU/内存图表正常更新
- [ ] 前端性能指标正确收集
- [ ] 帧率监控正常工作
- [ ] 路由耗时记录正确
- [ ] 组件卸载时正确清理资源
- [ ] 无内存泄漏（历史数据限制长度）

---

## 4. 实施优先级

1. **P0 (高优先级)**: ArticleAnalytics 页面
   - 相对简单，依赖少
   - 后端接口已完成
   - 预计耗时: 1-2 小时

2. **P1 (中优先级)**: 批量操作功能
   - 需要新增后端接口
   - 需要较多测试
   - 预计耗时: 3-4 小时

3. **P2 (低优先级)**: 监控仪表板
   - 复杂度最高
   - 需要 Socket.io 和性能监控基础设施
   - 预计耗时: 4-6 小时

---

## 5. 依赖检查

### npm 包依赖

检查 `package.json` 是否包含：
- ✅ `@ant-design/plots` - 已安装
- ✅ `socket.io-client` - 需要检查版本
- ✅ `zustand` - 已安装

### 后端依赖

- ✅ Record 模型和控制器已存在
- ✅ Monitor 路由已存在
- ❌ 批量更新状态接口需要新增

---

## 6. 风险评估

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| Socket.io 版本不兼容 | 监控功能无法工作 | 检查并更新 socket.io-client 版本 |
| 性能监控影响应用性能 | 用户体验下降 | 限制采样频率，异步上报 |
| 批量操作数据库压力 | 服务器负载高 | 后端添加批量操作限制（如最多 100 条） |
| 历史数据内存泄漏 | 应用内存溢出 | Store 限制历史数据长度 |

---

## 7. 测试策略

### 单元测试
- 所有新增组件和 Hooks
- API 函数调用逻辑
- Store 状态更新逻辑

### 集成测试
- 批量操作流程（选中 → 操作 → 刷新）
- Socket 连接和数据更新
- 图表数据渲染

### 手动测试
- 在 Docker 环境中测试完整流程
- 验证 Socket 连接稳定性
- 验证批量操作数据正确性

---

## 8. 下一步行动

1. 验证 npm 依赖安装情况
2. 按优先级顺序实施：
   - ArticleAnalytics → Batch Operations → Monitor
3. 每个功能完成后：
   - 运行测试
   - 更新 REIMPLEMENTATION_STATUS.md
   - 提交代码

---

**规划完成时间**: 2025-10-06
**预计总耗时**: 8-12 小时
**执行者**: Codex
