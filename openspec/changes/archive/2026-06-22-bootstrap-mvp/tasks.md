# Tasks: bootstrap-mvp

> 对应 spec §21 的 6 个开发阶段，外加 Phase 0（项目骨架）和 Phase 7（文档与提交）。

## 1. Setup — 项目骨架

- [x] 1.1 用 Vite 初始化 React + TS 项目
- [x] 1.2 安装运行时依赖：`zustand`
- [x] 1.3 安装开发依赖：`tailwindcss @tailwindcss/vite vitest @vitest/ui jsdom tsx`
- [x] 1.4 配置 Tailwind v4 通过 `@tailwindcss/vite` 插件
- [x] 1.5 配置 `tsconfig.app.json` 严格模式 + `verbatimModuleSyntax`
- [x] 1.6 在 `package.json` 增加脚本：`dev`, `build`, `preview`, `validate:events`, `lint`, `test`, `test:watch`
- [x] 1.7 创建目录骨架：`src/app/`, `src/components/`, `src/data/`, `src/engine/`, `src/store/`, `src/types/`, `src/styles/`, `src/test/`, `scripts/`
- [x] 1.8 独立 `vitest.config.ts` 配置 jsdom 环境

## 2. Type System — 类型契约

- [x] 2.1 在 `src/types/game.ts` 定义 `MacroVariableKey`、`RegionKey`、`AssetKey`、`RoleKey`、`EventCategory` 联合类型
- [x] 2.2 定义 `EffectDetail { score, reason }`、`MacroEvent`、`Question`、`Explanation` 接口
- [x] 2.3 定义 `ScoreBoard`（7 维度）、`GameState`、`RoundResult`、`HistoryRecord` 接口
- [x] 2.4 定义 `Portfolio` 类型（`Record<AssetKey, number>`）+ 校验函数 `assertPortfolioSumsTo100`
- [x] 2.5 导出 `DiagnosisType` 联合类型：`热点追逐型 | 宏观敏感型 | 风险控制型 | 资产配置型`

## 3. Data Layer — 静态数据

- [x] 3.1 `src/data/variables.ts`：8 个变量元数据 + `arrowForScore` / `scoreLabel`
- [x] 3.2 `src/data/regions.ts`：6 个区域元数据 + 6 区域 SVG 占位矩形 + `colorForScore`
- [x] 3.3 `src/data/assets.ts`：10 类资产元数据 + `RETURN_FOR_SCORE` 映射表（+2→+4% 等）
- [x] 3.4 `src/data/roles.ts`：5 个角色元数据
- [x] 3.5 `src/data/portfolios.ts`：4 套预设组合（激进成长/稳健配置/周期商品/防御现金）+ `normalizeCustomPortfolio` + `assertPortfolioSumsTo100`
- [x] 3.6 `src/data/events.ts`：20 张事件卡数据，分类分布符合 spec §22
- [x] 3.7 复用 spec §14 中已给出的 3 个示例（`event_us_cpi_hot`, `event_china_rrr_cut`, `event_middle_east_conflict`）
- [x] 3.8 `src/data/diagnosis.ts`：4 种诊断类型 + `classify()` + `weakestDimensions` + `riskBandRatios` + `maxDrawdown`

## 4. Engine — 游戏引擎

- [x] 4.1 `src/engine/eventEngine.ts`：`pickFiveEvents(pool)`（无重复采样，至少 2 张 difficulty ≥ 2）
- [x] 4.2 `src/engine/questionEngine.ts`：`validateAnswer(question, userAnswer)` + `scoreBoardFromAnswers`
- [x] 4.3 `src/engine/portfolio.ts`：`computeRoundReturn(portfolio, assetEffects)`（固定表 +2 → +4%）
- [x] 4.4 `computePortfolioValue(prevValue, roundReturn)`，初始值 100
- [x] 4.5 `classifyRiskBand(roundReturn)`（>5% 高 / 2–5% 中 / <2% 低）
- [x] 4.6 `applyDimensionGains`（按 question.dimensions 元数据 +10/题/维度）
- [x] 4.7 `clampScoreBoard(scoreBoard)` 保证每个维度 ∈ [0, 100]
- [x] 4.8 `totalScore(scoreBoard)` 返回 0–700
- [x] 4.9 `src/engine/roleScoring.ts`：`roleSurvivalScore()`（基于组合暴露 + 累计维度）

## 5. State Layer — 状态管理

- [x] 5.1 `src/store/gameStore.ts`：Zustand store，暴露 `selectRole`, `selectPortfolio`, `startGame`, `submitAnswers`, `nextRound`, `restart`, `_archiveToHistory`
- [x] 5.2 `src/store/historyStore.ts`：单独 store 负责 localStorage 键 `macromap.history`
- [x] 5.3 启动时 `init()` 读取 history，解析失败时静默退化为空数组
- [x] 5.4 `gameStatus` 变 `finished` 时自动写入 `HistoryRecord`

## 6. UI Shell — 路由与布局

- [x] 6.1 `src/app/App.tsx`：根据 `gameStatus` 路由（finished → Report；playing → MainGame；notStarted → RoleSelect → PortfolioSelect）
- [x] 6.2 `RoleSelect.tsx`：5 个角色卡片 + "下一步"按钮
- [x] 6.3 `PortfolioSelect.tsx`：4 个预设 + 自定义滑块编辑器 + 校验 sum=100
- [x] 6.4 `MainGame.tsx` 三栏布局：顶部 StatusBar / 左侧 WorldMap + EventCard / 右侧 Variable/Asset/Role 面板 / 底部 Question + Explanation
- [x] 6.5 `StatusBar.tsx`：回合 N/5、角色、总分、组合价值、风险徽章
- [x] 6.6 `WorldMap.tsx`：6 区域占位 SVG + 颜色编码 + tooltip
- [x] 6.7 `EventCard.tsx`：标题、分类、难度、描述
- [x] 6.8 `VariablePanel.tsx` / `AssetImpactPanel.tsx` / `RoleImpactPanel.tsx`
- [x] 6.9 `QuestionPanel.tsx`：按 `type` 渲染 direction（radio）/ chainSort（点击升序）/ decision（radio）
- [x] 6.10 `ExplanationPanel.tsx`：chain 列表 + summary + knowledgePoints 列表
- [x] 6.11 `Report.tsx`：总分、7 维度柱状图、诊断类型、个性化建议、薄弱项、最近 10 次历史
- [x] 6.12 在所有页面 footer 渲染免责文案

## 7. Validation — 数据校验与单元测试

- [x] 7.1 `scripts/validate-events.ts`：扫描 `src/data/events.ts`，确保 20 张事件卡字段齐全、分数合法、分类计数符合 spec §22
- [x] 7.2 `npm run validate:events` 通过
- [x] 7.3 vitest 单元测试覆盖：`portfolio`（6 个用例）、`questionEngine`（10 个用例）、`diagnosis`（8 个用例） — 共 30 个
- [x] 7.4 `npm test` 通过 30/30

## 8. Documentation & Delivery

- [x] 8.1 `README.md`（中文）：项目介绍、quickstart、技术栈、目录结构
- [x] 8.2 README "如何新增事件卡"小节
- [x] 8.3 README "如何新增角色 / 资产 / 预设组合"小节
- [x] 8.4 README 列出 MVP 不做事项
- [x] 8.5 README 风险免责
- [x] 8.6 `LICENSE`（MIT）
- [x] 8.7 `git commit` 首次提交
- [x] 8.8 `git push -u origin main` 首次推送到 `git@github.com:TTtian1998/MacroMap.git`

## 9. Final Verification

- [x] 9.1 `npm run build` 通过
- [x] 9.2 `npm run validate:events` 通过 20/20
- [x] 9.3 `npm test` 通过 30/30
- [x] 9.4 `openspec validate bootstrap-mvp --type change` 通过