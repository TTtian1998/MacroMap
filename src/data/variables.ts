import type { MacroVariableKey, EffectScore } from '../types/game'

interface VariableMeta {
  key: MacroVariableKey
  label: string
  shortLabel: string
  definition: string
}

export const VARIABLE_META: Record<MacroVariableKey, VariableMeta> = {
  interestRate: {
    key: 'interestRate',
    label: '利率',
    shortLabel: '利率',
    definition: '资金价格，影响债券、股票估值和融资成本。',
  },
  usd: {
    key: 'usd',
    label: '美元',
    shortLabel: '美元',
    definition: '全球结算和储备货币，影响资金流向与商品价格。',
  },
  inflation: {
    key: 'inflation',
    label: '通胀',
    shortLabel: '通胀',
    definition: '物价压力，影响央行政策和居民购买力。',
  },
  growth: {
    key: 'growth',
    label: '经济增长',
    shortLabel: '增长',
    definition: '影响企业盈利、就业和周期品需求。',
  },
  riskAppetite: {
    key: 'riskAppetite',
    label: '风险偏好',
    shortLabel: '风险偏好',
    definition: '决定市场愿不愿意买风险资产。',
  },
  liquidity: {
    key: 'liquidity',
    label: '流动性',
    shortLabel: '流动性',
    definition: '资金是否宽松，影响估值和交易活跃度。',
  },
  commodityPrice: {
    key: 'commodityPrice',
    label: '商品价格',
    shortLabel: '商品',
    definition: '原油、铜、粮食等价格压力。',
  },
  creditStress: {
    key: 'creditStress',
    label: '信用压力',
    shortLabel: '信用',
    definition: '债务违约、融资困难和金融风险。',
  },
}

/** 把分数翻译成箭头符号 */
export function arrowForScore(score: EffectScore): string {
  switch (score) {
    case 2: return '↑↑'
    case 1: return '↑'
    case 0: return '·'
    case -1: return '↓'
    case -2: return '↓↓'
  }
}

/** 把分数翻译成中文语义标签 */
export function scoreLabel(score: EffectScore | undefined): string {
  if (score === undefined) return '—'
  switch (score) {
    case 2: return '明显上升'
    case 1: return '小幅上升'
    case 0: return '中性'
    case -1: return '小幅下降'
    case -2: return '明显下降'
  }
}