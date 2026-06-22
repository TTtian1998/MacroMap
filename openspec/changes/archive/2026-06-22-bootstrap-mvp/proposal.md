# bootstrap-mvp

## Why

MacroMap 的目标是训练普通投资者建立"事件 → 宏观变量 → 国家/行业/资产 → 角色影响 → 决策"的宏观传导链认知（详见 `macro-map-finance-game-spec.md`）。当前仓库是空的——没有代码、没有类型、没有数据，没有任何可玩的版本。需要从零搭起一个可玩的单机 Web MVP，包含 5 角色、6 区域、20 张事件卡、5 回合主循环，以及最终的投资风格诊断报告。这是从"规格"走向"可玩 MVP"的第一个、也是最大的一次性奠基变更。

## What Changes

- 初始化 Vite + React + TypeScript + Tailwind + Zustand 项目骨架。
- 定义完整的 TypeScript 类型系统（`MacroVariableKey` / `RegionKey` / `AssetKey` / `RoleKey` / `MacroEvent` / `ScoreBoard` 等）。
- 实现 20 张 MVP 事件卡数据，覆盖 8 个事件分类。
- 实现游戏状态 store 与状态机（`notStarted` → `playing` → `finished`）。
- 实现三大题型引擎（方向判断 / 传导链排序 / 决策题）与答案校验。
- 实现 7 维度评分系统（macroUnderstanding / interestRateSensitivity / …）。
- 实现组合模拟（资产影响分数 → 回合收益 → 组合价值变化 → 风险等级）。
- 实现 4 种诊断类型判定（热点追逐型 / 宏观敏感型 / 风险控制型 / 资产配置型）。
- 实现三栏式主游戏页面（顶部状态栏 / 世界地图 / 事件卡片 / 变量面板 / 资产面板 / 角色面板 / 玩家操作区 / 解释区）。
- 实现角色选择页、资产组合选择页、最终诊断报告页。
- 使用 localStorage 持久化历史成绩。
- 提供 README 与"如何新增事件卡"的扩展说明。

## Capabilities

### New Capabilities

- `game-state`: 游戏全局状态模型、Zustand store、状态机流转、localStorage 持久化、历史成绩读取。
- `event-system`: 事件卡数据模型、20 张 MVP 事件库、随机抽卡、变量 / 区域 / 资产 / 角色影响的结构化表达。
- `macro-variables`: 8 个宏观变量（利率 / 美元 / 通胀 / 增长 / 风险偏好 / 流动性 / 商品价格 / 信用压力）的取值规则与影响范围。
- `regions`: 6 个区域（美国 / 中国 / 欧洲 / 日本 / 中东 / 新兴市场）的关注重点与状态着色。
- `assets`: 10 类资产（美股科技 / A股成长 / 港股互联网 / 美债 / 黄金 / 原油 / 铜 / 银行 / 消费 / 现金）的核心驱动与权重定义。
- `roles`: 5 个角色（交易员 / 普通上班族 / 企业老板 / 公务员 / 基金经理）的身份特征与影响维度。
- `question-engine`: 三种题型（direction / chainSort / decision）、题目数据模型、答案校验、错误反馈。
- `scoring`: 7 维度评分（macroUnderstanding / interestRateSensitivity / dollarSystemUnderstanding / commodityCycleUnderstanding / equityValuationUnderstanding / riskControlAwareness / roleSurvivalScore）的累计逻辑。
- `portfolio`: 4 套预设组合（激进成长 / 稳健配置 / 周期商品 / 防御现金）、回合收益计算、组合价值、风险等级判定。
- `diagnosis`: 5 回合结束后的诊断类型判定（热点追逐 / 宏观敏感 / 风险控制 / 资产配置）与个性化建议。
- `ui-shell`: 三栏式主游戏页面布局、角色与组合选择页、报告页、世界地图可视化、状态栏、组件复用规范。
- `docs`: README（启动命令、新增事件卡指引）、非目标说明、风险与免责声明。

### Modified Capabilities

无（仓库当前为空，没有已有 spec）。

## Impact

- **新增代码目录**：`src/app/`、`src/components/`、`src/data/`、`src/engine/`、`src/store/`、`src/types/`、`src/styles/`。
- **新增依赖**：`react`、`react-dom`、`typescript`、`vite`、`tailwindcss`、`postcss`、`autoprefixer`、`zustand`。
- **新增数据文件**：`src/data/events.ts`、`src/data/roles.ts`、`src/data/assets.ts`、`src/data/regions.ts`、`src/data/variables.ts`、`src/data/portfolios.ts`。
- **本地存储**：使用 `localStorage` 键 `macromap.history` 持久化历史成绩。
- **远程仓库**：本地 `main` 分支已与 `git@github.com:TTtian1998/MacroMap.git` 关联；首次 `push` 时因为远端为空，需要 `git push -u origin main`。
- **不做**：登录、后端、真实行情、复杂 AI 生成事件、多人对战、分享海报（见 spec §3.2、§7.2）。