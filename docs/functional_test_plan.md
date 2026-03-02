# 功能测试方案 (Functional Test Plan)

> 最近一次执行：2026-02-28（GitHub 登录链路 + 播放器行为 + 生产导出数据导入复测）  
> 执行环境：Docker Compose（mysql/server/web/nginx/remark42/music-api）  
> 执行方式：容器内自动化接口/页面连通测试 + Playwright 浏览器自动化 + 关键前端逻辑代码核验  
> 结果：核心可执行项全部通过（35/35），P1 专项增强校验通过（8/8）
> 附加冒烟：`npm run test:music:smoke` 通过（默认歌单抽样 8 首，代理播放可用 8/8）
> P0 热修补充（2026-02-27）：单击路由跳转压测 8 轮通过，`removeChild` 运行时异常 0 次。
> P0+ 热修补充（2026-02-28）：Live2D iframe 隔离 + 模型切换修复 + Remark42 401 静默，浏览器控制台 0 条致命错误。
> 本次补充（2026-02-28）：`server/test.sql` 已导入；因原 SQL 尾部 `ADD COLUMN IF NOT EXISTS` 多列语法在当前实例报错，已改为逐列补齐 `article` 扩展字段（`cover/description/likeCount/musicId/musicName`）。

## 1. 核心系统 (Core System)
- [x] **Docker 容器**: 检查 `blog-web` 和 `blog-server` 是否正常运行。
- [x] **端口监听**: 确认前端 `3002` 和后端 `6062` (或其他) 端口可访问。

## 2. 首页 (Home Page)
- [x] **Hero 区域**:
    - [x] 背景图显示正常（页面加载与资源路径验证通过）。
    - [x] 滚动时背景产生“线稿”滤镜效果及遮罩加深（逻辑代码核验通过）。
    - [x] 社交图标悬停效果正常（样式代码核验通过）。
    - [x] Hitokoto (一言) 正常显示（逻辑代码核验通过）。
- [x] **Live2D 看板娘**:
    - [x] 已改为 iframe 隔离架构（第三方脚本运行在独立文档，不再直接改写主页面 DOM）。
    - [x] 模型切换按钮可用（自动化验证：模型索引从 `0` 变更为 `1`）。
    - [x] 开启状态下多轮路由切换无 `removeChild` 崩溃。

## 3. 博客功能 (Blog Features)
- [x] **文章列表**: 首页文章列表加载正常，日期格式正确。
- [x] **文章详情**:
    - [x] Markdown 渲染正确 (含代码块、图片)（接口数据 + 渲染逻辑验证通过）。
    - [x] 目录 (TOC) 正常显示且可跳转（组件与页面挂载验证通过）。
    - [x] **背景音乐**: 
    - [x] 若文章绑定音乐，显示“背景音乐”按钮（逻辑核验通过）。
    - [x] 点击按钮可播放，并最小化到左下角（播放器状态逻辑核验通过）。
    - [x] 文章音乐与全局播放器均统一走后端代理地址 `/api/music/proxy/:id`（代码与接口核验通过）。
    - [x] **背景连续性**: 标题区滚动到正文区时保持同一背景层与同一 `background-image` 计算值（页面逻辑核验通过）。

## 4. 全局组件 (Global Components)
- [x] **音乐播放器**:
    - [x] “最小化”按钮功能正常 (隐藏为主界面，保留悬浮球或缩小状态)。
    - [x] 进度条拖动测试（`handleProgressClick` 逻辑核验通过）。
    - [x] 歌词显示 (如有)（`/music/lyric` 接口 + 解析逻辑通过）。
    - [x] `/music/url/:id` 返回后端代理地址（不再回传网易云外链）。
    - [x] `/music/proxy/:id` 支持 `Range` 请求并可返回音频分片（206 + 非零字节响应）。
- [x] **自定义指针**: 鼠标移动和点击时显示自定义图标（全局样式路径与选择器核验通过）。

## 5. 后台管理 (Admin System)
- [x] **登录**:
    - [x] 访问 `/login`。
    - [x] GitHub 登录跳转正常 (视网络环境)（回调与跳转逻辑核验通过）。
    - [x] 使用账号密码，验证失败/成功反馈（已自动化验证）。
- [x] **仪表盘**:
    - [x] 进入 `/admin`，UI 为玻璃拟态风格（样式代码核验通过）。
    - [x] 文字已中文化（文案核验通过）。
    - [x] 新增“网易云播放配置”管理区：支持保存 Cookie、清空 Cookie、配置默认歌单 ID、二维码登录（接口联调通过）。
- [x] **文章管理**:
    - [x] 列表加载正常。
    - [x] 编辑页面：支持搜索上传封面图、搜索添加音乐（已修复 `/music/search` 并验证通过）。
    - [x] 编辑页面：分类/标签候选接口可访问（`/category`、`/tag`）。
    - [x] 编辑页面：音乐搜索分页接口可用（`/music/search?limit&offset` 返回分页元数据）。
    - [x] 编辑页面：音乐分页数据存在页间差异（offset 生效）。
    - [x] 编辑页面：封面上传失败具备错误明细与重试入口（代码逻辑核验通过）。
    - [x] 编辑页面：音乐搜索缓存命中后可直接复用结果（代码逻辑核验通过）。

## 6. 音乐管理专项 (Music Admin Controls)
- [x] `GET /music/admin/status`：未携带管理员 token 返回 401，携带管理员 token 返回状态详情。
- [x] `PUT /music/admin/config`：可更新默认歌单 ID；`/music/playlist/default` 返回配置歌单（当前验证 id=`3778678`）。
- [x] `POST /music/admin/qr/start`：可返回二维码 `key` 与 `qrimg`（供后台扫码登录流程使用）。
- [x] `npm run test:music:smoke`：默认歌单前 8 首歌曲通过 `/music/url` + `/music/proxy` 自动化播放链路检查（8/8 可播）。

## 7. 路由稳定性专项 (P0 Hotfix)
- [x] 复现并定位：`Cannot read properties of null (reading 'removeChild')` 可在高频切页下复现。
- [x] 修复验证：`/ -> /posts -> /posts/[id] -> /about -> /` 循环 8 轮，无 `removeChild` 致命错误。
- [x] 登录态处理验证：401 不再直接 `window.location.href` 打断路由，改为事件驱动处理。
- [x] 评论静默验证：Remark42 经前端代理后，未登录探测 401 不再污染控制台；其它异常仍保留上报。

## 8. 本次专项补测 (2026-02-28)
- [x] GitHub 登录回调兼容：新增 `/api/conn/github/callback`，返回相对重定向 `/login?code=...&state=...`（避免容器内绝对地址泄漏为 `0.0.0.0:3000`）。
- [x] GitHub 未配置行为：`POST /login` 传入 `code` 时返回明确错误文案（`GitHub OAuth 未配置...`），不再出现不清晰的 GitHub 404。
- [x] 播放器自动播放防御：模拟旧 localStorage 中 `playing=true`，进站后自动重置为 `playing=false` 且播放器最小化，`audio` 实例数 `0`。
- [x] 文章音乐联动：为文章 `id=106` 绑定 `musicId` 后，点击“背景音乐”触发右下角全局播放器播放，页面仅 1 个 `audio` 元素，无重复播放。
- [x] 前台播放器禁用手动导入：播放面板不再出现“导入歌单 ID”按钮与输入框；来源显示“管理端默认（ID: ...）”。
- [x] 数据导入后展示校验：`/article/list` 数量 13、`/article/106` 详情正常、`/discuss?articleId=93` 评论数 2、`/api/article/archives` 年份分组正常。
