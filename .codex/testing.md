# 测试执行记录

# 测试执行记录

## 2025-10-27
- `npm run lint`：失败，ESLint 报告 `.codex/reference/oml2d_options.md.js` 存在大量 `no-irregular-whitespace` 历史问题，以及 `react/no-unknown-property` 配置缺失。与本次样式调整无直接关联，未做额外修复。
- `npx eslint src/features/layout/web/WebLayout.tsx src/features/layout/web/components/WebHeader.tsx`：通过，验证头部结构重构后的关键文件无新增 lint 违例。
- `npx eslint src/features/layout/web/WebLayout.tsx src/features/layout/web/components/WebHeader.tsx`：再次通过，毛玻璃效果调整后复验未发现新问题。
- `npx eslint src/features/article/components/ArticleMusicPlayer.tsx src/features/article/pages/ArticleDetailPage.tsx src/features/layout/web/WebLayout.tsx src/features/layout/web/components/WebHeader.tsx`：失败，项目缺失 `react/no-unknown-property` 规则定义，无法完成新文件的 lint。
- 2025-10-27：未重复执行 ESLint（文章详情+音乐播放器），原因同上仍缺失 `react/no-unknown-property` 规则，等待仓库层面修复。
- `npx eslint src/features/about/pages/AboutPage.tsx`：通过，确认关于页重构后的组件符合规则。
- `npx eslint src/features/article/pages/ArticleListPage.tsx`：通过。

## 2025-10-12
- `npm run test`：失败，Vitest 在沙箱内报错 `ERR_IPC_CHANNEL_CLOSED`
- `npx vitest run`：失败，同样因沙箱通道关闭而终止

> 说明：当前沙箱环境不支持 Vitest 多进程运行，已记录失败原因，未对代码进行进一步修改。
- 2025-10-12 `npm run test`：再次失败，沙箱环境终止 IPC 通道，未产出测试结果。
- 2025-10-12 `npm run test -- src/shared/components/Live2D/index.test.tsx`：通过，使用提权沙箱执行单文件测试，3 项断言全部成功。
- 2025-10-12 `npm run test -- src/shared/components/Live2D/index.test.tsx`：通过（Live2D 状态栏与消息逻辑重构后回归）。
- 2025-10-12 `npm run test -- src/shared/components/Live2D/index.test.tsx`：通过（沿用父目录高级交互实现并拆分挂载逻辑后再次验证）。
- 2025-10-12 `npm run test -- src/shared/components/Live2D/index.test.tsx`：通过（最佳实践版单实例实现验证）。
## 2025-10-18
- `npm run test -- --run src/shared/components/Live2D/index.test.tsx`：通过，新增“模型未就绪”用例后 4 项断言全部成功，未出现 setModelPosition 相关错误。
- `npm run test -- --run src/shared/components/Live2D/index.test.tsx`：通过（增加调试日志后复测），控制台输出舞台生命周期日志便于定位自动开合问题。
- `npm run test -- --run src/shared/components/Live2D/index.test.tsx`：通过（修正模型挂载判定后复测），确认读取 `instance.models.model` 后仍保持 4 项断言成功。
- `npm run test -- --run src/shared/components/Live2D/index.test.tsx`：通过（引入 requestAnimationFrame 重试机制后复测），确保延迟应用舞台参数时单测依旧稳定。
- `npm run test -- --run src/shared/components/Live2D/index.test.tsx`：通过（增加响应式定位重试上限后复测），验证终止条件不会影响现有用例。
- `npm run test -- --run src/shared/components/Live2D/index.test.tsx`：通过（回退至官方最小实现后复测），3 项断言验证基础加载、隐藏与卸载流程。
- `npm run test -- --run src/shared/components/Live2D/index.test.tsx`：通过（迁移 legacy 精简实现并恢复响应式舞台后），确认首页加载与非首页禁用逻辑。

## 2025-10-21
- `npm run lint`：失败，沙箱返回 `failed in sandbox`（推测为资源限制），改以局部 ESLint 验证替代。
- `npx eslint src/features/layout/web/components/WebHeader.tsx src/features/article/pages/ArticleDetailPage.tsx`：首次通过，两处核心改动文件静态检查无警告。
- `npx eslint src/features/layout/web/components/WebHeader.tsx src/features/article/pages/ArticleDetailPage.tsx`：09:21 再次尝试失败（failed in sandbox），稍后重试。
- `npx eslint src/features/layout/web/components/WebHeader.tsx src/features/article/pages/ArticleDetailPage.tsx`：09:22 重试通过，确认最新结构符合规范。
- `npx eslint src/features/layout/web/components/WebHeader.tsx src/features/article/pages/ArticleListPage.tsx src/features/article/pages/ArticleDetailPage.tsx src/features/article/components/TableOfContents.tsx`：通过，首页与目录改动全部满足静态检查。
- `npx eslint src/features/home/pages/HomePage.tsx src/features/article/pages/ArticleDetailPage.tsx src/shared/components/Sidebar/index.tsx src/shared/components/QuickNav/index.tsx src/features/article/hooks/useArticleDetail.ts`：通过，确认极简首页与文章页重构符合规范。

## 2025-10-22
- `npm run test -- --run`：失败，Vitest 在沙箱中报 `ERR_IPC_CHANNEL_CLOSED` 后退出。
- `npm run test -- --run --runInBand`：失败，Vitest CLI 提示 `Unknown option --runInBand`。
- `npm run test -- --run --threads false`：失败，Vitest CLI 提示 `Unknown option --threads`。
- `npx vitest run`：失败，沙箱立即终止进程（无额外输出，推测同样触发 IPC 通道关闭）。
- `npx vitest run --reporter=verbose`：失败，沙箱再次立即终止，未产出测试结果。

> 结论：受沙箱 IPC 限制阻塞，无法在当前环境执行 Vitest 全量测试，需在具备充分权限的环境补跑。
- `npm run test -- --run src/shared/components/Live2D/index.test.tsx`：通过，使用提权沙箱验证 Live2D 精简实现（2 项断言）。
- 首页文章流重构：未执行自动化测试，需在浏览器手动验证接口请求、文章渲染与“查看更多”跳转。
- 全局样式重构：未运行额外自动化测试。请在浏览器检查顶栏导航、文章详情、关于页与归档/标签列表的布局是否符合预期。
