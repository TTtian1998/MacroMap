import type { AssetKey, EffectScore } from '../types/game'

interface AssetMeta {
  key: AssetKey
  label: string
  shortLabel: string
  category: 'equity' | 'bond' | 'commodity' | 'cash'
  coreDrivers: string[]
}

/** 影响分数 → 回合收益率（百分比）。spec §18.1 固定表 */
export const RETURN_FOR_SCORE: Record<EffectScore, number> = {
  2: 4,
  1: 2,
  0: 0,
  '-1': -2,
  '-2': -4,
}

export const ASSET_META: Record<AssetKey, AssetMeta> = {
  usTechStocks: {
    key: 'usTechStocks',
    label: '美股科技',
    shortLabel: '美科技',
    category: 'equity',
    coreDrivers: ['利率', 'AI景气', '盈利', '估值'],
  },
  chinaGrowthStocks: {
    key: 'chinaGrowthStocks',
    label: 'A股成长',
    shortLabel: 'A成长',
    category: 'equity',
    coreDrivers: ['国内流动性', '产业政策', '风险偏好'],
  },
  hkInternetStocks: {
    key: 'hkInternetStocks',
    label: '港股互联网',
    shortLabel: '港互联',
    category: 'equity',
    coreDrivers: ['美元利率', '中国基本面', '外资风险偏好'],
  },
  usBonds: {
    key: 'usBonds',
    label: '美债',
    shortLabel: '美债',
    category: 'bond',
    coreDrivers: ['利率', '通胀', '衰退预期'],
  },
  gold: {
    key: 'gold',
    label: '黄金',
    shortLabel: '黄金',
    category: 'commodity',
    coreDrivers: ['真实利率', '美元', '避险', '央行购金'],
  },
  oil: {
    key: 'oil',
    label: '原油',
    shortLabel: '原油',
    category: 'commodity',
    coreDrivers: ['供需', 'OPEC', '地缘冲突', '全球增长'],
  },
  copper: {
    key: 'copper',
    label: '铜',
    shortLabel: '铜',
    category: 'commodity',
    coreDrivers: ['全球制造业', '中国需求', '电力投资'],
  },
  banks: {
    key: 'banks',
    label: '银行',
    shortLabel: '银行',
    category: 'equity',
    coreDrivers: ['利差', '资产质量', '信用风险'],
  },
  consumerStocks: {
    key: 'consumerStocks',
    label: '消费',
    shortLabel: '消费',
    category: 'equity',
    coreDrivers: ['居民收入', '消费信心', '利润率'],
  },
  cash: {
    key: 'cash',
    label: '现金',
    shortLabel: '现金',
    category: 'cash',
    coreDrivers: ['防御', '等待机会', '高利率环境下收益'],
  },
}