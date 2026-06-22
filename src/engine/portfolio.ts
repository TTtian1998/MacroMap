import type { Portfolio, AssetKey, EffectScore, RiskBand } from '../types/game'
import { RETURN_FOR_SCORE } from '../data/assets'
import { ASSETS } from '../types/game'

/**
 * 计算单回合组合收益率（百分比）
 * roundReturn = sum(weight% / 100 * assetReturn%)
 */
export function computeRoundReturn(
  portfolio: Portfolio,
  assetScores: Partial<Record<AssetKey, EffectScore>>
): number {
  let total = 0
  for (const k of ASSETS) {
    const weight = portfolio[k] ?? 0
    const score = assetScores[k] ?? 0
    const assetReturn = RETURN_FOR_SCORE[score as EffectScore] ?? 0
    total += (weight / 100) * assetReturn
  }
  return total
}

/**
 * 累计组合价值（百分比指数）
 * portfolioValue = prevValue * (1 + roundReturn/100)
 * 初始值 100
 */
export function computePortfolioValue(prevValue: number, roundReturnPct: number): number {
  return prevValue * (1 + roundReturnPct / 100)
}

/**
 * 风险等级：单回合组合亏损百分比
 * > 5% 高 / 2%~5% 中 / < 2% 低
 */
export function classifyRiskBand(roundReturnPct: number): RiskBand {
  const loss = -roundReturnPct // 正数表示亏损
  if (loss > 5) return 'high'
  if (loss >= 2) return 'medium'
  return 'low'
}

/** 累计总收益百分比（相对 100 基准） */
export function totalReturnPct(portfolioValue: number): number {
  return portfolioValue - 100
}