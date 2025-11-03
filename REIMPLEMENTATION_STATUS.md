0. 目标特征总览

首页：仅展示一句简介与一排社交图标（GitHub/Twitter/Telegram/Bilibili/Email/Steam/PlayStation/Switch），底部版权与“Powered by …”。无文章列表与侧栏。
Hi, DIYgod

### 进度更新（2025-10-22）

- ✅ 首页 `/`：已重写为极简问候页，仅保留简介与社交图标，移除语言切换、按钮与链上信息块。
- ✅ 文章页 `/posts/:slug`：采用单栏正文、浮动目录按钮与文末 References，新增 locale 回退策略（若非常规语言无数据则回退中文）。
- ✅ 归档页 `/archives`：以年份分组列表展示文章，并嵌入 Ownership/IPFS 信息块。
- ✅ 标签列表 `/tags` 与 标签详情 `/tag/:slug`：改为极简行列表与文章清单，统一新路由 `/tag/:name` 并保留旧路径兼容。
- ⚠️ 后端暂未实现 `/article/slug/:slug?locale=` 接口，前端通过查询失败时回落至中文内容；需在后续迭代中补齐服务端能力。

文章页 /palworld：单栏长文、大标题+时间、二级/三级标题与正文、文末外链清单。支持 ?locale=zh|en|zh-TW 切换。无右侧边栏。
Hi, DIYgod
+2
Hi, DIYgod
+2

归档页：按年份分组的极简列表；站点存在链上/智能合约/IPFS元信息展示块。
Hi, DIYgod

1. 信息架构（IA）与路由
路由	用途	形态/关键点
/	个人主页	头像（可选）、一段简介、社交图标组；无文章与侧栏。
Hi, DIYgod

/posts/:slug	文章页	单栏正文；内置折叠TOC（可浮动按钮展开）；文末外链；支持 ?locale=。以 /palworld 为标杆。
Hi, DIYgod
+1

/archives	归档	年份分组极简列表；可附“Ownership/IPFS”信息区。
Hi, DIYgod

/tag/:slug	标签页	极简列表，卡片统一式样。
Hi, DIYgod

/about（可选）	关于/元信息	固定展示链上/智能合约/IPFS字段位（若非上链，可占位展示）。
Hi, DIYgod

i18n：所有页面均读取 ?locale=zh|en|zh-TW，未指定时回退 zh。 /palworld 明确存在三语版本。
Hi, DIYgod
+2
Hi, DIYgod
+2

2. 组件树（React/Vue 皆可，以下以抽象命名）
App
├─ LayoutRoot
│  ├─ HeaderMinimal   // 首页不显示，文章/归档可选最小化导航
│  ├─ Main (Outlet)
│  └─ FooterMeta
│
├─ HomeMinimal (route "/")
│  ├─ HeroIntro       // 标题/简介
│  └─ SocialLinks     // 社交图标组
│
├─ PostLayout (route "/posts/:slug")
│  ├─ PostHeader      // 标题 + 时间 + （可选）阅读时长
│  ├─ PostTOCFab      // 浮动目录按钮（移动端折叠）
│  ├─ PostContent     // Markdown → HTML
│  └─ PostReferences  // 文末外链清单（GitHub/演示等）
│
├─ Archives (route "/archives")
│  ├─ YearGroupList
│  └─ ChainMetaBlock  // Ownership/Tx/IPFS
│
├─ TagPage (route "/tag/:slug")
│  └─ PostListMinimal
│
└─ About (route "/about")
   └─ ChainMetaBlock

3. 样式设计（Design Tokens）

以 DIYgod 实际观感设定，保证“极简+高可读”。

容器宽度

文章正文：max-width: 720px（范围 680–760 均可）。

首页：内容居中，max-width: 640px。

字体与排版

桌面正文：font-size: 18px; line-height: 1.85；移动：16px/1.85；段落间距 1.1em。

标题（文章页）：h1 36–40px，h2 28–30px，h3 22–24px；标题前后留白 1.2em/0.8em。

代码块：等宽字体，font-size: .95em，可横向滚动；暗色模式对比度增强。

颜色（中性极简）

背景：#fff / 暗色 #0b0b0c。

正文：#151515 / 暗色 #e8e8e8。

次级文本：#6b7280。

链接：系统色（不强设色，保持主题可换）。

间距

页面垂直节距：64px（大区块），32px（小区块）。

首页图标组间距：gap: 16–20px。

卡片：尽量避免。归档/标签仅列表，无边框或轻投影（shadow-sm）。

4. 首页（/）复刻规范

结构

HeroIntro：

行1：Hi, <YourName> 或自定义签名。

行2：简介一句（如“Crafted in logic, shaped by soul.”）。
Hi, DIYgod

SocialLinks：图标与顺序严格包含：GitHub、Twitter、Bilibili、Telegram、Email、Steam、PlayStation、Nintendo Switch（保持与目标一致；“follow”图标为 RSS/订阅可自定）。
Hi, DIYgod

不出现文章列表、侧栏、统计卡片。
Hi, DIYgod

交互与状态

图标均为外链，悬浮有轻微缩放/透明度动画（transform: scale(1.05)）。

移动端单列、图标自动换行。

Footer

© <YourName> · Powered by <stack>；保留社交小图标复用。
Hi, DIYgod

5. 文章页（以 /palworld 为标杆）

页面头部

大标题（单行，不截断）、发表时间（年月日）。

不显示作者头像/侧栏统计。
Hi, DIYgod

正文

单栏排版（见 Design Tokens）。

支持二/三级标题；图片宽度自适应、居中，有 alt。

段落中可穿插外链（GitHub 项目、演示站）：

cheahjs/palworld-save-tools（解析存档 → JSON）

zaigie/palworld-server-tool（JSON → 前端页面）

https://pal.diygod.me（展示页）
上述三项在原文中出现并在“数据展示/一些额外探索”段落提到。
Hi, DIYgod

目录（TOC）

默认隐藏；右下角 PostTOCFab 浮动按钮点击后侧边滑出。

小屏（≤768px）进入抽屉；大屏可固定左侧窄栏（可选）。

文末模块

PostReferences：以列表集中展示本文相关外链（含 GitHub 与 Demo）。
Hi, DIYgod

多语言

文章读取 ?locale=：

zh 与 en、zh-TW 版本内容不同，均存在。
Hi, DIYgod
+2
Hi, DIYgod
+2

语言切换器：仅切换查询参数，保留路径与滚动位置。

6. 归档、标签、关于/元信息

归档 /archives

年份分组列表（YearGroupList）= 年份标题 + 若干条目（标题 + 日期）。

页面包含链上 Ownership/IPFS 信息块字段示例：

Owner: 0x…8944

Creation Tx: 0x5b37f0… / Last Update Tx: 0x717ffc…

IPFS: ipfs://QmVc2K…
以上字段在目标站点可见。
Hi, DIYgod

标签 /tag/:slug

极简列表（同归档样式）；不出现缩略图与复杂卡片。
Hi, DIYgod

关于 /about（可选）

固定展示同一套 Ownership/IPFS 字段，解释内容托管/上链由来。
Hi, DIYgod

7. 数据模型（Frontmatter 示例）
# posts/palworld/index.zh.md
title: 和帕鲁生活在一起的两周
date: 2023-02-01
locale: zh
links:
  - text: palworld-save-tools
    url: https://github.com/cheahjs/palworld-save-tools
  - text: palworld-server-tool
    url: https://github.com/zaigie/palworld-server-tool
  - text: Pal 展示页
    url: https://pal.diygod.me
# 正文 Markdown...

# posts/palworld/index.en.md
title: Two weeks living with Paru
date: 2023-02-01
locale: en
links: [ ... 同上 ... ]

# posts/palworld/index.zh-TW.md
title: 和帕魯生活在一起的兩周
date: 2023-02-01
locale: zh-TW
links: [ ... 同上 ... ]

// chain/meta.json （用于归档/关于页元信息块）
{
  "owner": "0xc8b960d09c0078c18dcbe7eb9ab9d816bcca8944",
  "creation_tx": "0x5b37f0b3...504fb81f34",
  "last_update_tx": "0x717ffc71...64e5ebbb35",
  "ipfs": "ipfs://QmVc2Ka8Loi6xrU7BHemy4CJQCSUXFnU7VX1qzL1FGJnk4"
}


文章页在构建时根据 ?locale 选择对应 Markdown；若缺失回退中文。links 渲染到 PostReferences。
Hi, DIYgod

8. SEO / 分享卡片

每页 <title>：

首页：<YourName>（不追加“博客/文章列表”字样）。
Hi, DIYgod

文章：{title} - <YourName>

<meta name="description">：文章前 160 字；首页为简介句。

Open Graph / Twitter：og:title、og:description、og:image（首图/站点头像）。

多语言：为每篇文档输出 hreflang 到三语 URL（基于 ?locale=）。
Hi, DIYgod
+2
Hi, DIYgod
+2

站点地图与 RSS（可选）。

9. 可访问性（A11y）

颜色对比：正文与背景对比度 ≥ 7:1；链接 ≥ 4.5:1。

图标按钮：aria-label 标明服务名，如 aria-label="GitHub"。

图片：必须有 alt；装饰性图标 role="img"/aria-hidden="true"。

键盘可达：TOC 抽屉与语言切换器可 Tab 聚焦；浮动按钮 Enter/Space 可触发。

Lighthouse A11y 目标 ≥ 95。

10. 性能（Core Web Vitals）

首页首屏无文章与侧栏，请求数最小化（图标合并为 SVG 精灵或内联）。
Hi, DIYgod

图片全部 loading="lazy"，并设定 width/height 占位。

生产模式启用压缩（gzip/br），HTTP/2；长缓存与指纹文件名。

LCP 目标：≤1.8s（4G/中端机），CLS≈0，INP≤200ms。

11. 行为细节与边界

多语言切换：仅改 ?locale，不刷新全文（客户端路由内切换时需重新加载对应 Markdown）；保留滚动位置。

外链策略：所有外链 rel="noopener noreferrer"，新窗打开。

TOC 高亮：滚动观察者（IntersectionObserver）按可见度高亮当前章节。

无侧栏：文章页/首页均不出现右侧栏或多卡片区域（这是对齐的关键）。
Hi, DIYgod
+1

12. 验收清单（逐条过）

首页 /

 首屏仅简介+社交图标；无文章卡片、无侧栏。
Hi, DIYgod

 Footer 出现 © · Powered by。
Hi, DIYgod

文章 /palworld

 单栏正文、无侧栏；标题+时间；二/三级标题样式与行距一致。
Hi, DIYgod

 文中出现解析/展示相关外链；文末 References 集中列出三项（2个 GitHub + 1个 Demo）。
Hi, DIYgod

 ?locale=en、?locale=zh、?locale=zh-TW 三语切换成功且内容对应。
Hi, DIYgod
+2
Hi, DIYgod
+2

归档 /archives

 年份分组；页面可见 Ownership / Tx / IPFS 字段。
Hi, DIYgod

标签 /tag/:slug

 无缩略图/复杂卡片，极简列表。
Hi, DIYgod

全站

 Lighthouse：Performance>90 / Accessibility>95 / Best Practices>95 / SEO>95。

 OG/Twitter 卡片正确抓取；hreflang 正确。

13. 任务分解（开发指令）

移除/精简：删首页文章列表与所有侧栏组件；删除“最新文章更新”横幅。

新增首页组件：HeroIntro + SocialLinks + FooterMeta。社交顺序与目标一致。
Hi, DIYgod

文章模板：PostLayout（单栏）+ PostTOCFab + PostReferences；渲染 links[]。
Hi, DIYgod

i18n：路由读取 ?locale= 加载 index.{locale}.md；缺失时回退中文。
Hi, DIYgod
+1

归档：生成年份分组；注入 chain/meta.json 渲染 ChainMetaBlock。
Hi, DIYgod

标签页：列表统一样式，去缩略图与统计挂件。
Hi, DIYgod

SEO：通用 Head 组件输出 <title>、description、OG/Twitter、hreflang。

性能/A11y：图片懒加载、SVG 图标无阻塞、键盘可达与暗色支持。

14. 参考原始证据

首页结构与社交图标（极简个人页，无文章/侧栏）：Hi, DIYgod。
Hi, DIYgod

/palworld 内容与外链（含两个 GitHub 项目与 Demo 展示）：文章页单栏。
Hi, DIYgod

/palworld?locale=en / ?locale=zh-TW：三语并存、通过 ?locale 切换。
Hi, DIYgod
+1

归档页及链上/IPFS 元信息：Owner、Tx Hash、IPFS 地址。
Hi, DIYgod

标签页示例：极简列表样式。
Hi, DIYgod

追加说明（可选一致性点）

若要完全“神似”，请避免首页出现任何“文章/统计/卡片”，并保持单页氛围；文章页避免花哨卡片边框，维持“纯内容”的视觉重心。

/palworld 文中涉及“帕鲁/Palworld”的非站内内容无需复制，但外链与段落结构建议还原。
