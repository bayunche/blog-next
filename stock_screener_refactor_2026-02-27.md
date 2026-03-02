# Stock-chart-screener 数据流重构说明（库→池→导出）

日期：2026-02-27

## 目标（你提出的三条铁律）

1. **强幂等入库**：同一交易日、同一只股票在“推荐库”中只能有一条记录；重复 seed/重复解析只允许合并更新“当日行”。
2. **历史行不可改**：历史推荐行（非当日）除 `backtest_results` 回测结果外，任何字段都不允许被更新/覆盖（策略/区间/指标/报告/评分等都冻结）。
3. **先入库、再入池**：池内数据必须来源于库，池是库的子集；导出 Excel 只做展示层处理（只改当日展示，不改历史）。

本次按你要求的推进顺序：
1) 入池必须来自库（硬约束） → ✅已完成
2) 强幂等口径再收紧/审计 → ✅已完成（并加强历史冻结）
3) 导出速度进一步压缩 → ✅已完成一轮（已明显提速，实测 <3 分钟）

---

## 1) 入池必须来自库（硬约束）✅

### 问题
之前 `realtime_pool_select.py` 的做法是：
- 每个 seed 跑 screener
- 直接用 `get_run_results(run_id)` 的返回拼 pool

这会导致“池”实际上是“脚本临时算出来的候选”，并不严格保证是“库的子集”。

### 改造
`realtime_pool_select.py` 现在改为：
- 仍然先运行 screener（让结果先落库）
- **然后只从 DB 里取出当日的 analysis_results 行来构建 pool**（硬约束：pool 必须能指回库）

关键点：
- pool_items 每只股票携带 `result_id`（DB 主键）+ `analysis_date` + `run_id`
- pool_codes/pool_add_codes 由 DB 行过滤得到

### pool sheet 对齐
`pool_sheet.py` 增加 `_latest_result_for_id(result_id)`：
- 导出 pool sheet 时优先用 `result_id` 取 DB 行
- 保证 Excel pool sheet 展示的数据和“库里那条记录”一致

---

## 2) 强幂等入库 + 历史冻结（只能改回测）✅

### 数据库 schema 调整（SQLite）
对 `analysis_results` 增加（轻量迁移方式 ADD COLUMN）：
- `analysis_date`：交易日（YYYY-MM-DD），作为幂等维度
- `source_run_ids`：来源 run 列表（JSON list）
- `source_refs`：来源 seed/ref 列表（JSON list）
- `updated_at`：当日行最后更新时间

并建立唯一约束：
- `UNIQUE(analysis_date, code)` （通过唯一索引 `uniq_results_day_code`）

### 写入规则（save_run 的核心行为）
- 当 `run_date == 今日`：允许对 (analysis_date, code) 做 UPSERT（覆盖当日行），并合并来源（source_run_ids/source_refs）。
- 当 `run_date != 今日`：
  - **禁止更新**（row exists → skip）
  - **禁止插入**（row not exists → skip）

这保证了“历史行只能改回测”：历史推荐数据不会被任何盘中/重复任务写脏。

同时增加“严格审计”：
- code 必须是 6 位数字，否则丢弃。

---

## 3) 导出速度优化（目标：3 分钟内）✅

### 问题
强幂等后，`analysis_runs` 会出现大量“重复运行但没有保留推荐结果”的 run（可视为孤儿 run）。
如果导出仍然遍历/导出所有 run，会造成不必要的 IO 和模板写入。

### 改造
`export_full_realtime_today.py` 改为：
- 优先使用 `db_manager.get_export_run_ids()`：只取 **仍被保留结果引用到的 run_id** 来导出
- 只有当该列表为空时，才回退到“取最近 N 个 run”的旧逻辑

### 实测
在当前环境一次导出耗时约 173 秒（<3 分钟）。

---

## 现状与后续建议（下一步如果继续优化）

1. **池的存储更纯粹**：pool.json 未来可以进一步只存引用（result_id/code），盘中行情类字段作为“导出临时字段”而不是 pool 的事实字段。
2. **导出进一步提速**：
   - 减少 template sheet 的样式复制次数
   - 按需生成 sheet（例如不需要 notes 时不生成）
   - 将实时行情抓取做缓存（同一轮导出只拉一次行情快照）

---

## 代码变更点（便于回溯）

- `skills/stock-chart-screener/scripts/db_manager.py`
  - 新增字段迁移、唯一索引、UPSERT、历史冻结、审计规则
- `skills/stock-chart-screener/scripts/realtime_pool_select.py`
  - pool 构建改为 DB 驱动（pool ⊂ DB）并写入 result_id
- `skills/stock-chart-screener/scripts/pool_sheet.py`
  - pool sheet 优先按 result_id 取库内记录
- `skills/stock-chart-screener/scripts/export_full_realtime_today.py`
  - 只导出仍被保留结果引用到的 run_id，显著减少导出开销
