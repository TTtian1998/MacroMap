# Macro Map · 世界经济模拟器

> 用小游戏训练"事件 → 宏观变量 → 国家/行业/资产 → 角色 → 决策"的宏观传导链认知。

Macro Map 是一个基于世界地图和事件卡片的宏观金融认知训练 Web 小游戏。玩家选择角色和初始资产组合，系统随机触发世界事件，玩家判断事件对宏观变量、国家、行业、资产和个人角色的影响，系统给出传导链解释与评分，最终输出投资风格诊断报告。

## ✨ 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:5173 即可游玩。

### 常用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 编译 TypeScript + 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm test` | 运行单元测试（vitest） |
| `npm run test:watch` | 监听模式运行测试 |
| `npm run validate:events` | 自检事件库字段、分类分布 |
| `npm run lint` | ESLint 检查 |

## 🧰 技术栈

- **构建**：Vite 8 + React 19 + TypeScript 6
- **样式**：Tailwind CSS v4
- **状态**：Zustand
- **测试**：Vitest + jsdom
- **持久化**：localStorage

## 📁 目录结构

```
src/
├── app/App.tsx              # 根组件，按 gameStatus 路由
├── components/              # UI 组件
│   ├── RoleSelect.tsx       # 角色选择页
│   ├── PortfolioSelect.tsx  # 组合选择页（含自定义编辑）
│   ├── MainGame.tsx         # 主游戏页（三栏布局）
│   ├── StatusBar.tsx        # 顶部状态栏
│   ├── WorldMap.tsx         # SVG 世界地图
│   ├── EventCard.tsx        # 事件卡片
│   ├── VariablePanel.tsx    # 8 个宏观变量
│   ├── AssetImpactPanel.tsx # 10 类资产影响
│   ├── RoleImpactPanel.tsx  # 角色影响
│   ├── QuestionPanel.tsx    # 题目面板（direction / chainSort / decision）
│   ├── ExplanationPanel.tsx # 解释面板
│   └── Report.tsx           # 最终诊断报告
├── data/                    # 静态数据
│   ├── variables.ts         # 8 个宏观变量元数据
│   ├── regions.ts           # 6 个区域元数据 + 颜色
│   ├── assets.ts            # 10 类资产元数据 + 收益表
│   ├── roles.ts             # 5 个角色元数据
│   ├── portfolios.ts        # 4 套预设组合 + 校验工具
│   ├── events.ts            # 20 张 MVP 事件卡
│   └── diagnosis.ts         # 4 种诊断类型 + 分类函数
├── engine/                  # 游戏引擎（纯函数，无 React 依赖）
│   ├── eventEngine.ts       # 随机抽 5 个事件
│   ├── questionEngine.ts    # 答案校验 + 维度加分
│   ├── portfolio.ts         # 回合收益 + 组合价值 + 风险等级
│   └── roleScoring.ts       # 角色生存分
├── store/                   # Zustand store
│   ├── gameStore.ts         # 主游戏状态
│   └── historyStore.ts      # localStorage 历史
├── types/game.ts            # 全局 TypeScript 类型定义
├── styles/global.css        # Tailwind 入口
└── test/                    # vitest 单元测试

scripts/
└── validate-events.ts       # 事件库自检脚本

openspec/                    # OpenSpec AI 项目管理
├── changes/                 # 正在进行的变更
└── specs/                   # 已归档的权威 spec
```

## 🎮 玩法

1. **选角色**：交易员 / 普通上班族 / 企业老板 / 公务员 / 基金经理
2. **选组合**：4 套预设（激进成长 / 稳健配置 / 周期商品 / 防御现金）或自定义权重
3. **5 回合事件**：每回合系统随机抽 1 张事件卡（20 张库中无重复抽取）
4. **答题**：方向判断 / 传导链排序 / 决策题
5. **看解释**：完整传导链 + 总结 + 知识点
6. **看报告**：总分、7 维度得分、4 类诊断（热点追逐 / 宏观敏感 / 风险控制 / 资产配置）

## ➕ 如何新增一张事件卡

打开 `src/data/events.ts`，在 `EVENTS` 数组末尾追加：

```ts
{
  id: 'event_my_new_event',
  title: '我的新事件',
  category: 'usMonetaryPolicy', // 8 个分类之一
  difficulty: 1,                 // 1 | 2 | 3
  description: '事件背景描述',
  variableEffects: {
    interestRate: 1,             // -2 ~ +2
    usd: 1,
  },
  regionEffects: {
    usa: { score: -1, reason: '...' }, // score -2 ~ +2
  },
  assetEffects: {
    usTechStocks: { score: -2, reason: '...' },
  },
  roleEffects: {
    trader: '交易员角度的解读...',
  },
  questions: [
    {
      id: 'q1',
      type: 'direction',         // direction | chainSort | decision
      prompt: '问题内容',
      options: ['A', 'B', 'C'],  // chainSort 顺序点击，direction/decision 单选
      answer: 'A',               // chainSort 用 string[]
      explanation: '解释',
      dimensions: ['interestRateSensitivity', 'macroUnderstanding'],
    },
  ],
  explanation: {
    chain: ['事件', '传导', '影响'],  // 4-10 步
    summary: '一句话总结',
    knowledgePoints: ['知识点 1', '知识点 2'],
  },
}
```

完成后运行：

```bash
npm run validate:events
```

校验脚本会检查字段齐全性、分数范围、分类计数。

## ➕ 如何新增一个角色 / 资产 / 预设组合

- **角色**：编辑 `src/data/roles.ts`
- **资产**：编辑 `src/data/assets.ts`（注意同步 `src/types/game.ts` 的 `ASSETS` 联合类型）
- **预设组合**：编辑 `src/data/portfolios.ts`

## 🚫 MVP 不做事项

明确不在 MVP 范围内（参见 `macro-map-finance-game-spec.md` §3.2、§7.2）：

- ❌ 用户系统、登录、注册
- ❌ 后端服务
- ❌ 真实行情接口（FRED / Wind / Bloomberg 等）
- ❌ 复杂 AI 生成事件
- ❌ 多人对战
- ❌ 分享海报

## ⚠️ 免责声明

本游戏用于金融知识学习和认知训练，不构成任何投资建议。

投资有风险，决策需谨慎。游戏中的事件、传导链和资产影响均为教学示意，与真实市场走势可能不一致。

## 📜 许可证

本项目以 MIT 许可证开源。

## 📐 项目管理

本项目使用 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 进行 AI-native 的 spec-driven 项目管理。当前正在进行的主要变更：

- `bootstrap-mvp`：奠基变更，包含上述所有功能

查看当前所有变更：

```bash
openspec list
```