# Macro Map：世界经济模拟器 Web 小游戏产品与技术规格

> 目标：用小游戏形式训练用户对宏观经济、货币政策、资产价格和个人角色影响的理解。  
> 核心不是预测市场，而是建立“事件 → 变量 → 国家/行业/资产/角色 → 决策”的宏观传导链认知。

---

## 1. 项目背景

用户在学习理财和投资时，常见问题是：

- 看到市场热点后直接参与，缺乏宏观框架。
- 不清楚美联储、利率、美元、美债、商品、股市之间的传导关系。
- 对“新闻事件如何影响资产价格”没有系统判断。
- 交易纪律弱，容易短线买入、中线被套、长线自我安慰。

本项目希望通过一个交互式 Web 小游戏，让用户在模拟世界事件中学习金融知识，并检测自己的认知短板。

---

## 2. 产品定位

产品名称建议：**Macro Map：世界经济模拟器**

一句话定义：

> 一个基于世界地图和事件卡片的宏观金融认知训练小游戏。

核心玩法：

> 玩家选择角色和初始资产组合，系统随机触发世界事件，玩家判断事件对宏观变量、国家、行业、资产和个人角色的影响，系统给出传导链解释与评分。

---

## 3. 产品目标

### 3.1 核心目标

1. 检测玩家的金融知识认知水平。
2. 训练玩家理解宏观事件对资产价格的传导路径。
3. 通过小游戏增强交互体验，降低金融知识学习门槛。
4. 帮助玩家形成投资前的判断框架。

### 3.2 非目标

MVP 阶段不做以下内容：

- 不做真实投资建议。
- 不接入真实交易。
- 不做复杂宏观经济预测模型。
- 不追求完全真实的国家经济仿真。
- 不做多人在线对战。
- 不做实时行情系统。

---

## 4. 目标用户

### 4.1 主要用户

- 正在学习理财、炒股、基金、宏观经济的普通投资者。
- 已经参与市场，但缺乏系统金融框架的用户。
- 想理解美联储、利率、美元、商品、股票、债券关系的用户。

### 4.2 次要用户

- 金融课程学习者。
- 投资社群、理财课程、内部培训场景。
- 希望用交互式方式理解经济知识的普通用户。

---

## 5. 核心设计原则

### 5.1 教学优先于真实预测

游戏结论要强调“宏观传导逻辑”，而不是给出真实市场预测。

错误示例：

> 美联储加息后股票一定跌。

正确示例：

> 美联储加息通常会提高资金成本和折现率，对高估值成长股形成压力，但实际走势还要结合盈利、预期差和市场定价程度。

### 5.2 因果链要清晰

所有事件都必须能解释为：

```text
事件 → 宏观变量变化 → 国家/行业/资产变化 → 角色影响 → 玩家决策
```

### 5.3 结果不追求单一答案

部分决策题允许多种策略，只要风险解释合理。

例如：

> CPI 超预期后，减仓成长股、加现金、买短债、降低杠杆都可能合理，但全仓追高成长股通常不合理。

---

## 6. 游戏核心循环

```text
1. 玩家选择角色
2. 玩家选择初始资产组合
3. 系统触发世界事件
4. 玩家判断事件影响
5. 系统展示正确传导链
6. 玩家调整仓位或做角色决策
7. 系统更新资产、国家、行业、角色状态
8. 进入下一回合
9. 完成 5 回合后输出认知诊断报告
```

---

## 7. MVP 范围

第一版只做轻量可玩的单机 Web 版本。

### 7.1 MVP 功能清单

必须包含：

1. 世界地图展示。
2. 6 个区域：美国、中国、欧洲、日本、中东、新兴市场。
3. 5 个角色：交易员、普通上班族、企业老板、公务员、基金经理。
4. 20 张事件卡。
5. 8 个宏观变量。
6. 10 类资产/行业。
7. 每局 5 回合。
8. 每回合包含判断题和解释。
9. 最终生成知识评分和投资风格诊断。
10. 本地存储历史成绩。

### 7.2 MVP 暂不包含

1. 用户登录。
2. 后端服务。
3. 真实行情接口。
4. 复杂 AI 生成事件。
5. 多人对战。
6. 分享海报。

---

## 8. 页面结构

### 8.1 主页面布局

推荐三栏结构：

```text
┌─────────────────────────────────────────────┐
│ 顶部状态栏：回合数 / 当前角色 / 总分 / 风险状态 │
├───────────────┬─────────────────────────────┤
│               │ 事件卡片                    │
│ 世界地图       │ 宏观变量变化                 │
│               │ 资产影响                    │
│               │ 角色影响                    │
├───────────────┴─────────────────────────────┤
│ 玩家选择区：判断题 / 仓位调整 / 下一回合       │
├─────────────────────────────────────────────┤
│ 解释区：正确传导链 / 知识点 / 复盘提醒         │
└─────────────────────────────────────────────┘
```

### 8.2 主要模块

#### 顶部状态栏

显示：

- 当前回合：第 N / 5 回合
- 当前角色
- 当前总分
- 当前组合收益
- 当前风险等级

#### 世界地图区

地图区域包含：

- 美国
- 中国
- 欧洲
- 日本
- 中东
- 新兴市场

每个区域展示当前状态：

- 绿色：受益
- 红色：受损
- 黄色：不确定
- 灰色：影响较小

区域悬浮提示展示：

- 当前影响说明
- 相关变量
- 相关资产

#### 事件卡片区

展示当前事件：

- 事件标题
- 事件背景
- 事件来源类型
- 事件影响标签
- 判断题

#### 宏观变量区

展示 8 个核心变量变化：

- 利率
- 美元
- 通胀
- 经济增长
- 风险偏好
- 流动性
- 商品价格
- 信用压力

变量变化用 -2 到 +2 表示。

#### 资产影响区

展示资产涨跌方向和原因：

- 美股科技
- A股成长
- 港股互联网
- 美债
- 黄金
- 原油
- 铜
- 银行
- 消费
- 现金

#### 角色影响区

根据当前角色展示影响：

- 交易员：持仓收益、回撤、风险敞口
- 普通上班族：工资、就业、房贷、物价
- 企业老板：融资成本、订单、库存、利润率
- 公务员：财政收入、地方债、公共支出
- 基金经理：风格切换、估值、久期、仓位压力

---

## 9. 核心变量系统

### 9.1 宏观变量定义

```ts
export type MacroVariableKey =
  | 'interestRate'
  | 'usd'
  | 'inflation'
  | 'growth'
  | 'riskAppetite'
  | 'liquidity'
  | 'commodityPrice'
  | 'creditStress';
```

### 9.2 变量解释

| 变量 | 中文名 | 含义 |
|---|---|---|
| interestRate | 利率 | 资金价格，影响债券、股票估值和融资成本 |
| usd | 美元 | 全球结算和储备货币，影响资金流向与商品价格 |
| inflation | 通胀 | 物价压力，影响央行政策和居民购买力 |
| growth | 经济增长 | 影响企业盈利、就业和周期品需求 |
| riskAppetite | 风险偏好 | 决定市场愿不愿意买风险资产 |
| liquidity | 流动性 | 资金是否宽松，影响估值和交易活跃度 |
| commodityPrice | 商品价格 | 原油、铜、粮食等价格压力 |
| creditStress | 信用压力 | 债务违约、融资困难和金融风险 |

### 9.3 变量取值

每个变量取值范围：

```text
-2：明显下降 / 明显恶化
-1：小幅下降 / 偏弱
0：中性
+1：小幅上升 / 偏强
+2：明显上升 / 明显强化
```

---

## 10. 区域系统

### 10.1 区域定义

```ts
export type RegionKey =
  | 'usa'
  | 'china'
  | 'europe'
  | 'japan'
  | 'middleEast'
  | 'emergingMarkets';
```

### 10.2 区域说明

| 区域 | 关注重点 |
|---|---|
| 美国 | 美联储、美元、美债、科技股、消费、就业 |
| 中国 | 政策、社融、地产、消费、制造业、A股 |
| 欧洲 | 能源、通胀、制造业、欧元、出口 |
| 日本 | 日元、央行政策、出口、套利交易 |
| 中东 | 原油、地缘冲突、能源供给 |
| 新兴市场 | 美元流动性、资本流动、本币汇率、外债压力 |

---

## 11. 资产系统

### 11.1 资产定义

```ts
export type AssetKey =
  | 'usTechStocks'
  | 'chinaGrowthStocks'
  | 'hkInternetStocks'
  | 'usBonds'
  | 'gold'
  | 'oil'
  | 'copper'
  | 'banks'
  | 'consumerStocks'
  | 'cash';
```

### 11.2 资产解释

| 资产 | 中文名 | 核心驱动 |
|---|---|---|
| usTechStocks | 美股科技 | 利率、AI 景气、盈利、估值 |
| chinaGrowthStocks | A股成长 | 国内流动性、产业政策、风险偏好 |
| hkInternetStocks | 港股互联网 | 美元利率、中国基本面、外资风险偏好 |
| usBonds | 美债 | 利率、通胀、衰退预期 |
| gold | 黄金 | 真实利率、美元、避险、央行购金 |
| oil | 原油 | 供需、OPEC、地缘冲突、全球增长 |
| copper | 铜 | 全球制造业、中国需求、电力投资 |
| banks | 银行 | 利差、资产质量、信用风险 |
| consumerStocks | 消费 | 居民收入、消费信心、利润率 |
| cash | 现金 | 防御、等待机会、高利率环境下收益 |

---

## 12. 角色系统

### 12.1 角色定义

```ts
export type RoleKey =
  | 'trader'
  | 'officeWorker'
  | 'businessOwner'
  | 'civilServant'
  | 'fundManager';
```

### 12.2 角色说明

#### 交易员

关注：

- 资产价格
- 仓位
- 回撤
- 风险敞口
- 市场情绪

#### 普通上班族

关注：

- 工资
- 就业
- 房贷
- 物价
- 消费压力

#### 企业老板

关注：

- 融资成本
- 订单需求
- 库存
- 利润率
- 汇率

#### 公务员

关注：

- 财政收入
- 地方债
- 土地财政
- 公共支出
- 政策周期

#### 基金经理

关注：

- 风格切换
- 估值
- 久期
- 回撤
- 客户赎回压力

---

## 13. 事件系统

### 13.1 事件分类

```ts
export type EventCategory =
  | 'usMonetaryPolicy'
  | 'usEconomicData'
  | 'chinaPolicy'
  | 'chinaEconomicData'
  | 'geopolitics'
  | 'commoditySupply'
  | 'technologyCycle'
  | 'financialRisk';
```

### 13.2 事件数据结构

```ts
export interface MacroEvent {
  id: string;
  title: string;
  category: EventCategory;
  difficulty: 1 | 2 | 3;
  description: string;
  variableEffects: Partial<Record<MacroVariableKey, number>>;
  regionEffects: Partial<Record<RegionKey, EffectDetail>>;
  assetEffects: Partial<Record<AssetKey, EffectDetail>>;
  roleEffects: Partial<Record<RoleKey, string>>;
  questions: Question[];
  explanation: Explanation;
}

export interface EffectDetail {
  score: -2 | -1 | 0 | 1 | 2;
  reason: string;
}

export interface Question {
  id: string;
  type: 'direction' | 'chainSort' | 'decision';
  prompt: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
}

export interface Explanation {
  chain: string[];
  summary: string;
  knowledgePoints: string[];
}
```

---

## 14. MVP 事件卡示例

### 14.1 美国 CPI 超预期

```json
{
  "id": "event_us_cpi_hot",
  "title": "美国 CPI 超预期",
  "category": "usEconomicData",
  "difficulty": 1,
  "description": "美国最新 CPI 数据高于市场预期，通胀压力重新升温。",
  "variableEffects": {
    "inflation": 2,
    "interestRate": 1,
    "usd": 1,
    "liquidity": -1,
    "riskAppetite": -1
  },
  "regionEffects": {
    "usa": {
      "score": -1,
      "reason": "通胀压力上升，降息预期下降，股市估值承压。"
    },
    "emergingMarkets": {
      "score": -1,
      "reason": "美元走强可能导致资金回流美国，新兴市场承压。"
    }
  },
  "assetEffects": {
    "usTechStocks": {
      "score": -2,
      "reason": "高估值成长股对利率上行更敏感。"
    },
    "usBonds": {
      "score": -1,
      "reason": "利率预期上行会压制债券价格。"
    },
    "gold": {
      "score": -1,
      "reason": "真实利率和美元走强通常压制黄金。"
    },
    "cash": {
      "score": 1,
      "reason": "高利率环境下现金防御价值上升。"
    }
  },
  "roleEffects": {
    "trader": "高估值成长股仓位需要控制，关注美债收益率和美元。",
    "officeWorker": "通胀压力意味着生活成本可能继续偏高，降息推迟也会影响房贷压力。",
    "businessOwner": "融资成本下降的预期减弱，扩张计划需要更谨慎。",
    "fundManager": "成长风格短期承压，需要关注客户赎回和组合久期。"
  },
  "questions": [
    {
      "id": "q1",
      "type": "direction",
      "prompt": "美国 CPI 超预期后，降息预期通常会如何变化？",
      "options": ["增强", "减弱", "没有影响"],
      "answer": "减弱",
      "explanation": "通胀高于预期会让美联储更难快速降息。"
    }
  ],
  "explanation": {
    "chain": [
      "CPI 超预期",
      "通胀压力上升",
      "降息预期下降",
      "美债收益率上行",
      "美元偏强",
      "高估值成长股承压",
      "新兴市场风险偏好下降"
    ],
    "summary": "CPI 超预期属于典型的利率上行冲击，对成长股、债券和黄金短期偏压制。",
    "knowledgePoints": [
      "通胀数据会影响美联储政策预期。",
      "利率上行会提高股票估值折现率。",
      "美元走强会压制部分新兴市场资产。"
    ]
  }
}
```

### 14.2 中国降准

```json
{
  "id": "event_china_rrr_cut",
  "title": "中国央行宣布降准",
  "category": "chinaPolicy",
  "difficulty": 1,
  "description": "中国央行宣布下调金融机构存款准备金率，释放长期流动性。",
  "variableEffects": {
    "liquidity": 2,
    "riskAppetite": 1,
    "growth": 1
  },
  "regionEffects": {
    "china": {
      "score": 1,
      "reason": "流动性改善有助于缓解融资压力，提振风险偏好。"
    }
  },
  "assetEffects": {
    "chinaGrowthStocks": {
      "score": 1,
      "reason": "流动性宽松通常利好成长股估值。"
    },
    "banks": {
      "score": 1,
      "reason": "准备金释放可提升银行可贷资金。"
    },
    "hkInternetStocks": {
      "score": 1,
      "reason": "中国政策宽松可改善港股互联网风险偏好。"
    }
  },
  "roleEffects": {
    "trader": "A股和港股风险偏好可能改善，但仍要看政策力度和基本面验证。",
    "businessOwner": "融资环境边际改善，贷款可得性可能提升。",
    "civilServant": "政策意图偏稳增长，地方投资和融资环境可能边际改善。"
  },
  "questions": [
    {
      "id": "q1",
      "type": "direction",
      "prompt": "降准最直接影响的是哪个变量？",
      "options": ["流动性", "原油供给", "美国就业", "黄金库存"],
      "answer": "流动性",
      "explanation": "降准释放银行体系长期资金，最直接影响流动性。"
    }
  ],
  "explanation": {
    "chain": [
      "央行降准",
      "银行可贷资金增加",
      "流动性改善",
      "市场风险偏好上升",
      "权益资产估值修复"
    ],
    "summary": "降准是典型的国内流动性宽松信号，但最终效果取决于实体融资需求和政策组合。",
    "knowledgePoints": [
      "降准不等于企业一定会扩大投资。",
      "宽货币需要配合宽信用才更有效。",
      "市场通常会先交易政策预期。"
    ]
  }
}
```

### 14.3 中东冲突升级

```json
{
  "id": "event_middle_east_conflict",
  "title": "中东冲突升级",
  "category": "geopolitics",
  "difficulty": 2,
  "description": "中东地缘冲突升级，市场担心原油供应受扰。",
  "variableEffects": {
    "commodityPrice": 2,
    "inflation": 1,
    "riskAppetite": -1
  },
  "regionEffects": {
    "middleEast": {
      "score": -2,
      "reason": "地缘风险直接上升。"
    },
    "europe": {
      "score": -1,
      "reason": "能源进口成本可能上升。"
    }
  },
  "assetEffects": {
    "oil": {
      "score": 2,
      "reason": "供应扰动预期推高油价。"
    },
    "gold": {
      "score": 1,
      "reason": "避险需求上升。"
    },
    "consumerStocks": {
      "score": -1,
      "reason": "能源价格上升可能压制消费和企业利润率。"
    }
  },
  "roleEffects": {
    "officeWorker": "油价上涨可能推高通勤和生活成本。",
    "businessOwner": "运输和能源成本上升，利润率承压。",
    "trader": "原油和黄金可能受益，但权益风险偏好下降。"
  },
  "questions": [
    {
      "id": "q1",
      "type": "direction",
      "prompt": "中东冲突升级最直接利好哪类资产？",
      "options": ["原油", "航空股", "高估值科技股", "长期消费股"],
      "answer": "原油",
      "explanation": "中东冲突会引发市场对原油供应的担忧。"
    }
  ],
  "explanation": {
    "chain": [
      "中东冲突升级",
      "原油供应担忧",
      "油价上涨",
      "通胀压力上升",
      "风险偏好下降",
      "黄金避险需求上升"
    ],
    "summary": "地缘冲突通常会首先影响能源和避险资产，再通过通胀和风险偏好影响股债市场。",
    "knowledgePoints": [
      "地缘事件不一定长期影响市场，但短期冲击明显。",
      "油价上涨既可能利好能源资产，也可能压制消费和制造业。"
    ]
  }
}
```

---

## 15. 题型设计

### 15.1 方向判断题

用于检测基础因果关系。

示例：

```text
美国 CPI 超预期后，美债收益率大概率：
A. 上升
B. 下降
C. 没影响
```

### 15.2 传导链排序题

用于检测系统理解。

示例：

```text
请排序：
- 美元走强
- 美联储加息
- 新兴市场资金流出
- 本币贬值压力上升
```

正确答案：

```text
美联储加息 → 美元走强 → 新兴市场资金流出 → 本币贬值压力上升
```

### 15.3 决策题

用于检测风险意识。

示例：

```text
美联储释放鹰派信号，10 年期美债收益率上行。你作为基金经理，较合理的操作是：
A. 全仓追高成长股
B. 降低组合久期和估值暴露
C. 加大杠杆买入亏损概念股
D. 忽略宏观变化
```

---

## 16. 评分系统

### 16.1 评分维度

```ts
export interface ScoreBoard {
  macroUnderstanding: number;
  interestRateSensitivity: number;
  dollarSystemUnderstanding: number;
  commodityCycleUnderstanding: number;
  equityValuationUnderstanding: number;
  riskControlAwareness: number;
  roleSurvivalScore: number;
}
```

### 16.2 维度解释

| 维度 | 含义 |
|---|---|
| macroUnderstanding | 是否理解宏观变量之间的关系 |
| interestRateSensitivity | 是否理解利率对股债资产的影响 |
| dollarSystemUnderstanding | 是否理解美元、美债、新兴市场之间的关系 |
| commodityCycleUnderstanding | 是否理解油、铜、黄金等商品驱动 |
| equityValuationUnderstanding | 是否理解股票估值和盈利关系 |
| riskControlAwareness | 是否具备止损、仓位、回撤意识 |
| roleSurvivalScore | 当前角色在模拟环境中的综合表现 |

### 16.3 最终诊断类型

#### 热点追逐型

特征：

- 容易追涨。
- 对宏观变量敏感度低。
- 短线事件容易转成长线持有。

建议：

> 每次交易前先判断自己赚的是业绩钱、估值钱、周期钱，还是情绪钱。

#### 宏观敏感型

特征：

- 对利率、美元、通胀较敏感。
- 但可能过度交易宏观信号。

建议：

> 宏观判断需要和行业景气、估值、市场预期结合，不能只看单一变量。

#### 风险控制型

特征：

- 仓位谨慎。
- 能识别高风险事件。
- 可能错过高弹性机会。

建议：

> 保持风险控制优势，同时学会在高胜率场景中适度提高仓位。

#### 资产配置型

特征：

- 能理解不同资产的互补关系。
- 不盲目押注单一方向。

建议：

> 继续强化股债商品现金之间的组合管理能力。

---

## 17. 初始资产组合设计

玩家可选择预设组合，也可以手动配置。

### 17.1 预设组合

#### 激进成长组合

```json
{
  "usTechStocks": 40,
  "chinaGrowthStocks": 25,
  "hkInternetStocks": 20,
  "gold": 5,
  "cash": 10
}
```

#### 稳健配置组合

```json
{
  "usTechStocks": 20,
  "usBonds": 25,
  "gold": 20,
  "consumerStocks": 15,
  "cash": 20
}
```

#### 周期商品组合

```json
{
  "oil": 25,
  "copper": 25,
  "banks": 15,
  "gold": 15,
  "cash": 20
}
```

#### 防御现金组合

```json
{
  "cash": 50,
  "usBonds": 25,
  "gold": 15,
  "consumerStocks": 10
}
```

---

## 18. 状态计算逻辑

### 18.1 简化收益计算

每个资产的回合收益可以由事件影响分数决定：

```ts
roundReturn = assetEffectScore * baseVolatility * randomFactor
```

建议 MVP 简化为固定值：

| 影响分数 | 回合收益 |
|---|---|
| +2 | +4% |
| +1 | +2% |
| 0 | 0% |
| -1 | -2% |
| -2 | -4% |

为了避免过度随机，MVP 第一版可不加随机因子。

### 18.2 组合收益计算

```ts
portfolioReturn = sum(assetWeight * assetRoundReturn)
```

其中 assetWeight 使用百分比。

### 18.3 风险等级

```text
组合单回合亏损 > 5%：高风险
组合单回合亏损 2% - 5%：中风险
组合单回合亏损 < 2%：低风险
```

---

## 19. 前端技术方案

### 19.1 推荐技术栈

```text
React + TypeScript + Vite
Tailwind CSS
Zustand 或 Redux Toolkit
SVG 世界地图
localStorage
```

### 19.2 目录结构建议

```text
macro-map/
  src/
    app/
      App.tsx
      routes.tsx
    components/
      WorldMap.tsx
      EventCard.tsx
      VariablePanel.tsx
      AssetImpactPanel.tsx
      RoleImpactPanel.tsx
      QuestionPanel.tsx
      ExplanationPanel.tsx
      ScoreReport.tsx
      PortfolioPanel.tsx
    data/
      events.ts
      roles.ts
      assets.ts
      regions.ts
      variables.ts
      portfolios.ts
    engine/
      gameEngine.ts
      scoring.ts
      portfolio.ts
      diagnosis.ts
    store/
      gameStore.ts
    types/
      game.ts
    styles/
      global.css
```

### 19.3 核心状态

```ts
export interface GameState {
  currentRound: number;
  maxRounds: number;
  selectedRole: RoleKey | null;
  portfolio: Record<AssetKey, number>;
  currentEvent: MacroEvent | null;
  answeredQuestions: AnswerRecord[];
  scoreBoard: ScoreBoard;
  portfolioValue: number;
  history: RoundResult[];
  gameStatus: 'notStarted' | 'playing' | 'finished';
}
```

---

## 20. 关键组件说明

### 20.1 WorldMap

职责：

- 展示地图区域。
- 根据 regionEffects 改变区域颜色。
- 支持 hover 查看影响原因。

Props：

```ts
interface WorldMapProps {
  effects: Partial<Record<RegionKey, EffectDetail>>;
}
```

### 20.2 EventCard

职责：

- 展示当前事件标题、描述、分类、难度。

Props：

```ts
interface EventCardProps {
  event: MacroEvent;
}
```

### 20.3 QuestionPanel

职责：

- 展示题目。
- 接收用户答案。
- 提交后展示正确/错误。

Props：

```ts
interface QuestionPanelProps {
  questions: Question[];
  onSubmit: (answers: UserAnswer[]) => void;
}
```

### 20.4 ExplanationPanel

职责：

- 展示传导链。
- 展示知识点。
- 展示本回合复盘。

Props：

```ts
interface ExplanationPanelProps {
  explanation: Explanation;
}
```

### 20.5 ScoreReport

职责：

- 游戏结束后展示总分。
- 展示维度分。
- 展示诊断类型和建议。

---

## 21. 开发任务拆分

### 21.1 第一阶段：基础框架

任务：

1. 初始化 Vite + React + TypeScript 项目。
2. 建立基础目录结构。
3. 实现游戏状态 store。
4. 实现角色选择页。
5. 实现资产组合选择页。
6. 实现主游戏页静态布局。

验收标准：

- 能启动项目。
- 能选择角色。
- 能选择初始组合。
- 能进入主游戏页。

### 21.2 第二阶段：事件系统

任务：

1. 建立事件数据结构。
2. 编写 20 张事件卡。
3. 实现随机抽取事件。
4. 实现事件对变量、区域、资产、角色的影响展示。

验收标准：

- 每回合能随机出现事件。
- 事件能正确改变地图和面板展示。

### 21.3 第三阶段：问答与评分

任务：

1. 实现方向判断题。
2. 实现传导链排序题。
3. 实现决策题。
4. 实现答案校验。
5. 实现维度评分。

验收标准：

- 玩家答题后能看到正确答案和解释。
- 分数能按维度累计。

### 21.4 第四阶段：资产组合模拟

任务：

1. 实现资产影响分数转回合收益。
2. 实现组合收益计算。
3. 实现组合价值变化。
4. 实现回合历史记录。

验收标准：

- 每回合后组合收益变化。
- 能查看组合历史表现。

### 21.5 第五阶段：最终诊断报告

任务：

1. 实现游戏结束条件。
2. 实现总分和维度分展示。
3. 实现诊断类型判断。
4. 实现本地存储历史成绩。

验收标准：

- 5 回合结束后展示报告。
- 报告包含分数、诊断类型、薄弱点、建议。

### 21.6 第六阶段：UI 优化

任务：

1. 地图颜色优化。
2. 事件卡视觉优化。
3. 变量面板图标优化。
4. 移动端适配。
5. 增加基础动画。

验收标准：

- 页面可读性良好。
- 主要交互清晰。
- 移动端可基本使用。

---

## 22. MVP 事件库建议

第一版建议实现以下 20 个事件：

### 美国货币政策

1. 美联储加息。
2. 美联储释放降息信号。
3. 美联储鹰派讲话。
4. 美联储开始缩表。

### 美国经济数据

5. 美国 CPI 超预期。
6. 美国非农就业强劲。
7. 美国零售销售低于预期。
8. 美国经济衰退担忧上升。

### 中国政策与数据

9. 中国央行降准。
10. LPR 下调。
11. 社融低于预期。
12. 地产政策放松。
13. 出口数据超预期。

### 地缘与商品

14. 中东冲突升级。
15. OPEC 宣布减产。
16. 铜矿供应中断。
17. 黄金央行购金增加。

### 科技与金融风险

18. AI 芯片需求爆发。
19. 美国银行风险暴露。
20. 人民币快速贬值。

---

## 23. UI 文案风格

### 23.1 总体要求

- 简洁。
- 准确。
- 少口号。
- 不使用夸张投资宣传语。
- 不暗示买卖建议。

### 23.2 示例文案

事件标题：

```text
美国 CPI 超预期
```

事件描述：

```text
最新通胀数据高于市场预期，市场开始重新评估美联储降息节奏。
```

解释文案：

```text
这类事件通常会降低降息预期，推动美债收益率上行，并对高估值成长股形成压力。
```

风险提示：

```text
本游戏用于金融知识学习，不构成任何投资建议。
```

---

## 24. 验收标准

### 24.1 功能验收

- 可以完整完成一局游戏。
- 每局包含 5 回合。
- 每回合包含事件、判断、解释、资产影响。
- 游戏结束后有诊断报告。
- 页面刷新后可保留历史成绩。

### 24.2 内容验收

- 每个事件必须有完整传导链。
- 每个资产影响必须有解释。
- 每个角色影响必须和角色身份相关。
- 不出现确定性投资建议。
- 不将复杂市场简化为绝对结论。

### 24.3 体验验收

- 用户能在 1 分钟内理解玩法。
- 单回合操作不超过 2 分钟。
- 一局完整时长控制在 8-12 分钟。
- 页面信息层级清晰。

---

## 25. 后续增强方向

### 25.1 真实宏观日历接入

后续可接入：

- FOMC 日历
- 美国 CPI / 非农 / PCE 日历
- 中国 PMI / CPI / 社融 / LPR 日历

用于生成“本周事件模式”。

### 25.2 AI 事件生成

后续可让 AI 根据真实新闻生成事件卡，但必须经过规则校验：

```text
新闻摘要 → 提取事件 → 判断变量影响 → 生成传导链 → 人工/规则校验 → 加入事件池
```

### 25.3 学习路径

根据用户薄弱项推荐学习模块：

- 利率专题
- 美元体系专题
- 债券专题
- 商品专题
- 中国政策专题
- 风险控制专题

### 25.4 多结局模式

不同角色可以有不同结局：

- 交易员：收益最大化 / 爆仓 / 稳健盈利
- 上班族：就业稳定 / 房贷压力 / 消费压力
- 企业老板：扩张成功 / 现金流危机
- 公务员：财政宽松 / 地方债压力
- 基金经理：跑赢基准 / 大幅回撤 / 客户赎回

---

## 26. 给开发 Agent 的执行要求

开发 Agent 执行时请遵守：

1. 先实现 MVP，不要过度设计。
2. 所有事件数据放在本地 JSON/TS 文件中。
3. 不接真实行情，不接后端。
4. 传导链解释必须清晰展示。
5. 评分系统先用规则实现，不引入 AI。
6. UI 优先保证信息清晰，不追求复杂动效。
7. 所有金融内容需要避免确定性投资建议。
8. 代码使用 TypeScript 类型约束事件、角色、资产、变量。
9. 游戏引擎逻辑和 UI 组件分离。
10. 最终需要提供 README，说明如何启动、如何新增事件卡。

---

## 27. README 启动说明草稿

```bash
npm install
npm run dev
```

推荐命令：

```bash
npm create vite@latest macro-map -- --template react-ts
cd macro-map
npm install
npm install zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

新增事件卡位置：

```text
src/data/events.ts
```

新增角色位置：

```text
src/data/roles.ts
```

核心游戏逻辑位置：

```text
src/engine/gameEngine.ts
src/engine/scoring.ts
src/engine/portfolio.ts
```

---

## 28. 一句话总结

Macro Map 的核心不是做真实经济预测，而是用可交互的事件模拟，训练用户理解：

```text
世界事件 → 宏观变量 → 国家/行业/资产 → 角色影响 → 投资决策
```

这正是普通投资者从“刷热点交易”走向“系统化理财判断”需要补上的能力。
