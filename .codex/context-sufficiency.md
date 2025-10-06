# 上下文充分性检查
- [x] 我能定义清晰的接口契约吗？（Monitor 读取 performanceStore/systemPerformance；贡献图调用 GET /user/github/contributions -> [{ date, count }].）
- [x] 我理解关键技术选型吗？（沿用现有 TanStack Query + Zustand；可引入 react-calendar-heatmap 复刻体验。）
- [x] 我识别了主要风险点吗？（Socket 不在线、GitHub 抓取缓慢、第三方库样式冲突。）
- [x] 我知道如何验证实现吗？（Vitest 覆盖组件/Hook，手动模拟 store 数据，运行前端请求。）

→ 可以进入规划阶段。
