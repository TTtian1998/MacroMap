# Design: bootstrap-mvp

## Context

- 项目仓库 `/Users/brown/AI_WorkPlace/MacroMap` 当前已初始化，包含 git 仓库并已与 `git@github.com:TTtian1998/MacroMap.git` 关联并推送过一次提交。仓库根目录有 `macro-map-finance-game-spec.md` 作为单一权威产品规格（28 节，~1400 行）。
- 目标交付物是单机 Web MVP：5 角色、6 区域、20 事件卡、5 回合主循环、最终投资风格诊断报告。
- 受众是学习理财、宏观经济的普通投资者，目的是训练"事件 → 宏观变量 → 区域 / 行业 / 资产 → 角色 → 决策"的传导链认知。
- MVP 不接真实行情、不接后端、不做用户登录（参见 spec §3.2 / §7.2）。
- 这是项目首次实质性变更，没有历史代码或既有 spec。

## Goals / Non-Goals

**Goals:**
- 给出一份可玩的 React Web 单页应用，启动即可在 8–12 分钟内完成一局 5 回合游戏。
- 用 TypeScript 强类型约束事件 / 角色 / 资产 / 变量，避免运行时错误。
- 用规则引擎（确定性映射）实现评分和诊断，不引入任何 AI 调用。
- 用 `localStorage` 保存历史成绩，离线可玩。
- 代码组织上把"游戏引擎"和"UI 组件"严格分离，方便后续接入真实宏观日历或 AI 事件生成器。

**Non-Goals:**
- 不做用户系统、登录、注册、云存档。
- 不接真实行情、FRED / Wind / Bloomberg 等接口。
- 不做服务端、不做多人对战。
- 不做后端 LLM 生成事件卡（留作未来 `add-ai-event-generator` 变更）。
- 不做动效优化、移动端深度适配（基础可用即可）。

## Decisions

### D1. 技术栈：Vite + React + TypeScript + Tailwind + Zustand

- **选型理由**：
  - Vite 启动快、HMR 体验好，是 React 工具链的事实标准。
  - TypeScript 是 spec 中明确要求的（spec §19.1），事件/资产/角色/变量全是 union type，类型约束能减少事件数据出错。
  - Tailwind 让三栏布局和颜色编码（绿/红/黄/灰）开发更快，避免写大量 CSS。
  - Zustand 比 Redux 更轻量，store 写法直观；游戏状态规模适中（1 个 store、~10 个 action），不需要 Redux 的 middleware 和 slice 复杂度。
- **替代方案**：Redux Toolkit（更结构化但样板代码多）；Jotai（粒度更细但对中等规模应用收益不大）；Recoil（已被 Meta 收编维护节奏放缓）。最终选 Zustand。

### D2. 状态模型：单 Zustand store + 不可变更新

- **选型理由**：游戏状态（`GameState`）体量适中，单一 store 比拆成多个 slice 更便于在 React 组件树深处按需订阅，避免频繁 re-render。
- 行动作为 store 方法暴露（`selectRole`, `selectPortfolio`, `startRound`, `submitAnswers`, `nextRound`, `restart`），由调用方 dispatch。
- 历史记录走单独的小 store（`historyStore`），避免主 store 频繁写入触发整树重渲染。
- **替代方案**：Redux Toolkit + RTK Query（过大）；Context + useReducer（性能较差，调试不便）。

### D3. 事件加载：构建期静态导入 `src/data/events.ts`

- **选型理由**：MVP 20 张事件卡写在 TS 文件中，构建期被 Vite 打包进 bundle；体积小（< 50KB），首屏无网络请求。
- 后续如果扩展到几百张事件卡，可平滑切换为动态 import / JSON / 后端拉取。
- **替代方案**：运行时 fetch `events.json`（引入首屏 loading 状态，对 MVP 没必要）；JSON Schema + ajv 校验（增加复杂度，TS 类型检查已够用）。

### D4. 世界地图：极简 SVG 6 区域手绘占位

- **选型理由**：MVP 阶段地图只承担"着色 + 提示"两个职责，不需要真实地理坐标。
- 用 6 个不同颜色的圆/方块代表 6 个区域，hover 弹卡片显示影响。
- **替代方案**：d3-geo + TopoJSON（真实地图，但 1MB+ 资源、地图投影与交互代码量大）；react-simple-maps（中等，但地图区域边界与"6 区域"分类法对不上，需要自定义）；Mapbox / Leaflet（需要 token 和网络）。
- 未来 `add-real-world-map` 变更可以替换为 d3-geo 实现。

### D5. 评分与诊断：纯规则映射

- **选型理由**：每道题在数据中标注影响的 `dimensions`，答对 +10；诊断按 4 类硬规则判定（见 `specs/diagnosis/spec.md`）。
- 规则的好处：可解释、可调试、可单元测试；坏处：边界情况要枚举。
- **替代方案**：基于历史数据训练的 ML 分类（数据不足、过拟合、维护难）。

### D6. 资产收益：固定表（+2 → +4%）无随机因子

- **选型理由**：MVP 第一版不用随机因子，避免"运气"影响知识检测（spec §18.1）。
- 后续可加 `randomFactor ∈ [0.8, 1.2]` 增加张力。
- **替代方案**：蒙特卡洛模拟（对教学目的过重）。

### D7. 持久化：`localStorage` 键 `macromap.history`

- **选型理由**：MVP 只需要保存最近若干次成绩（最多几十条），`localStorage` 5MB 配额绰绰有余。
- 启动时读取，解析失败时回退到空数组，避免崩溃。
- **替代方案**：IndexedDB（API 复杂、收益不大）；后端（违反 Non-Goal）。

### D8. 单 change 还是多 change 拆解

- **选型理由**：spec 的 6 个开发阶段（§21）耦合度高（没有 types 就没有 events，没有 events 就没有 scoring），拆成 6 个 OpenSpec change 会在每个 change 之间制造大量"等待前序 spec 落地"的上下文切换。
- 把整个 MVP 作为 1 个 `bootstrap-mvp` change 提交，但内部用 6 个 capability 划分子系统，tasks.md 按阶段组织。
- 完成此 change 后，后续 `add-real-macro-calendar` / `add-ai-event-generator` / `add-multi-ending` 等可以独立 OpenSpec change 推进。

## Risks / Trade-offs

- **风险：20 张事件卡手工编写易遗漏字段** → 缓解：构建期用纯 TypeScript 类型守卫函数校验每张事件卡完整性；CI 阶段跑 `npm run validate:events`。
- **风险：诊断规则可能误判** → 缓解：分类时取最大匹配分数而非首个匹配；前端展示诊断依据（哪条规则触发）便于 debug。
- **风险：localStorage 在隐私模式或被禁用时不可用** → 缓解：写失败时退化为内存中保留本次成绩。
- **风险：拖拽排序题（chainSort）在触屏体验差** → 缓解：MVP 提供"点击升序排列"作为降级方案（spec §15.2）。
- **权衡：地图极简化牺牲了真实感** → 接受：MVP 优先信息清晰，地图只承担"着色 + 标签"职责。
- **权衡：固定收益表牺牲了张力** → 接受：MVP 优先教学确定性，玩家应该靠判断而非运气获胜。

## Migration Plan

- 仓库已包含此 change 提交（`feat: bootstrap MacroMap MVP`）。无历史数据迁移。
- 启动方式：`npm install && npm run dev`。
- 后续 OpenSpec 流程：用 `openspec new change <name>` 提交新变更；按 proposal → specs → design → tasks 顺序填充；`openspec validate <name>` 通过后实施；实施完毕 `/opsx:archive` 归档。

## Open Questions

- 拖拽排序题：MVP 是否值得引入 `react-dnd` / `dnd-kit`？还是先用"点击升序"占位、后续按需升级？—— 选后者，先做最小可用版。
- 世界地图：6 个区域是否需要更接近真实地理排布，还是接受占位方块？—— 接受占位，README 标注未来 `add-real-world-map` 计划。
- 是否需要在 store 中引入中间件做 dev-only 的时间旅行调试？—— MVP 不需要，console + React DevTools 已足够。
- 诊断分类规则的阈值（多少分以上算"宏观敏感"）—— 在 `src/data/diagnosis.ts` 的 `DIAGNOSIS_THRESHOLDS` 中给出默认值，并通过 vitest 单元测试锁定。