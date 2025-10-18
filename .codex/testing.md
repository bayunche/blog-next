# 测试执行记录

## 2025-10-12
- `npm run test`：失败，Vitest 在沙箱内报错 `ERR_IPC_CHANNEL_CLOSED`
- `npx vitest run`：失败，同样因沙箱通道关闭而终止

> 说明：当前沙箱环境不支持 Vitest 多进程运行，已记录失败原因，未对代码进行进一步修改。
- 2025-10-12 `npm run test`：再次失败，沙箱环境终止 IPC 通道，未产出测试结果。
- 2025-10-12 `npm run test -- src/shared/components/Live2D/index.test.tsx`：通过，使用提权沙箱执行单文件测试，3 项断言全部成功。
- 2025-10-12 `npm run test -- src/shared/components/Live2D/index.test.tsx`：通过（Live2D 状态栏与消息逻辑重构后回归）。
- 2025-10-12 `npm run test -- src/shared/components/Live2D/index.test.tsx`：通过（沿用父目录高级交互实现并拆分挂载逻辑后再次验证）。
- 2025-10-12 `npm run test -- src/shared/components/Live2D/index.test.tsx`：通过（最佳实践版单实例实现验证）。
