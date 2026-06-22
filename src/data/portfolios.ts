import type { Portfolio, RoleKey } from '../types/game'
import { ASSETS } from '../types/game'

export interface PresetPortfolio {
  id: string
  name: string
  description: string
  weights: Portfolio
  /** 哪些角色特别适合这套组合（仅展示用，不影响逻辑） */
  suits: RoleKey[]
}

function makePortfolio(partial: Partial<Portfolio>): Portfolio {
  const result = {} as Portfolio
  for (const k of ASSETS) result[k] = partial[k] ?? 0
  return result
}

export const PRESET_PORTFOLIOS: PresetPortfolio[] = [
  {
    id: 'aggressive_growth',
    name: '激进成长组合',
    description: '高仓位押注科技与新兴市场成长股，回撤大但弹性高。',
    weights: makePortfolio({
      usTechStocks: 40,
      chinaGrowthStocks: 25,
      hkInternetStocks: 20,
      gold: 5,
      cash: 10,
    }),
    suits: ['trader'],
  },
  {
    id: 'balanced',
    name: '稳健配置组合',
    description: '股债商品均衡配置，适合大多数场景。',
    weights: makePortfolio({
      usTechStocks: 20,
      usBonds: 25,
      gold: 20,
      consumerStocks: 15,
      cash: 20,
    }),
    suits: ['officeWorker', 'fundManager'],
  },
  {
    id: 'cyclical_commodity',
    name: '周期商品组合',
    description: '重仓原油、铜、银行，对商品周期敏感。',
    weights: makePortfolio({
      oil: 25,
      copper: 25,
      banks: 15,
      gold: 15,
      cash: 20,
    }),
    suits: ['businessOwner'],
  },
  {
    id: 'defensive_cash',
    name: '防御现金组合',
    description: '高现金 + 美债 + 黄金，低回撤但弹性小。',
    weights: makePortfolio({
      cash: 50,
      usBonds: 25,
      gold: 15,
      consumerStocks: 10,
    }),
    suits: ['civilServant', 'officeWorker'],
  },
]

/** 自定义组合辅助：把任意 Partial<Portfolio> 归一化到 sum=100。返回 null 表示无法归一化。 */
export function normalizeCustomPortfolio(weights: Partial<Portfolio>): Portfolio | null {
  const entries = ASSETS.map((k) => [k, weights[k] ?? 0] as const)
  // 全部为 0 时返回等权（10/10/...）
  const sum = entries.reduce((acc, [, v]) => acc + v, 0)
  if (sum <= 0) return null
  const result = {} as Portfolio
  let allocated = 0
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i]
    if (i === entries.length - 1) {
      result[k] = Math.max(0, Math.round((100 - allocated) * 10) / 10)
    } else {
      const w = Math.round((v / sum) * 1000) / 10
      result[k] = w
      allocated += w
    }
  }
  return result
}

export function assertPortfolioSumsTo100(portfolio: Portfolio, tolerance = 0.5): void {
  const sum = ASSETS.reduce((acc, k) => acc + portfolio[k], 0)
  if (Math.abs(sum - 100) > tolerance) {
    throw new Error(`Portfolio weights must sum to 100, got ${sum}`)
  }
  for (const k of ASSETS) {
    if (portfolio[k] < 0) {
      throw new Error(`Asset ${k} has negative weight ${portfolio[k]}`)
    }
  }
}