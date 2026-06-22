import { describe, it, expect } from 'vitest'
import { computeRoundReturn, computePortfolioValue, classifyRiskBand, totalReturnPct } from '../engine/portfolio'
import { RETURN_FOR_SCORE } from '../data/assets'
import { ASSETS } from '../types/game'
import type { Portfolio, AssetKey, EffectScore } from '../types/game'

const emptyPortfolio: Portfolio = Object.fromEntries(ASSETS.map((k) => [k, 0])) as Portfolio

function makePortfolio(partial: Partial<Record<AssetKey, number>>): Portfolio {
  return { ...emptyPortfolio, ...partial }
}

describe('computeRoundReturn', () => {
  it('全现金返回 0', () => {
    const p = makePortfolio({ cash: 100 })
    const result = computeRoundReturn(p, { usTechStocks: -2 })
    expect(result).toBe(0)
  })

  it('100% 美股科技在 score=-2 时返回 -4%', () => {
    const p = makePortfolio({ usTechStocks: 100 })
    const result = computeRoundReturn(p, { usTechStocks: -2 })
    expect(result).toBe(-4)
  })

  it('加权求和正确', () => {
    const p = makePortfolio({ usTechStocks: 50, cash: 50 })
    const result = computeRoundReturn(p, { usTechStocks: -2 })
    // 0.5 * -4 + 0.5 * 0 = -2
    expect(result).toBe(-2)
  })

  it('多个资产累加', () => {
    const p = makePortfolio({ usTechStocks: 50, oil: 50 })
    const result = computeRoundReturn(p, { usTechStocks: -2, oil: 2 })
    // 0.5 * -4 + 0.5 * 4 = 0
    expect(result).toBe(0)
  })

  it('未指定 score 视为 0', () => {
    const p = makePortfolio({ usTechStocks: 100 })
    const result = computeRoundReturn(p, {})
    expect(result).toBe(0)
  })

  it('所有分数映射正确', () => {
    const scores: EffectScore[] = [-2, -1, 0, 1, 2]
    const expected = [-4, -2, 0, 2, 4]
    for (let i = 0; i < scores.length; i++) {
      const s = scores[i]
      expect(RETURN_FOR_SCORE[s]).toBe(expected[i])
    }
  })
})

describe('computePortfolioValue', () => {
  it('初始值 100 + 0% 收益 = 100', () => {
    expect(computePortfolioValue(100, 0)).toBe(100)
  })

  it('-4% 收益后 100 -> 96', () => {
    expect(computePortfolioValue(100, -4)).toBeCloseTo(96)
  })

  it('+10% 收益后 100 -> 110', () => {
    expect(computePortfolioValue(100, 10)).toBeCloseTo(110)
  })
})

describe('classifyRiskBand', () => {
  it('>5% 亏损为高', () => {
    expect(classifyRiskBand(-6)).toBe('high')
    expect(classifyRiskBand(-10)).toBe('high')
  })

  it('2%-5% 亏损为中', () => {
    expect(classifyRiskBand(-2)).toBe('medium')
    expect(classifyRiskBand(-5)).toBe('medium')
  })

  it('<2% 为低', () => {
    expect(classifyRiskBand(0)).toBe('low')
    expect(classifyRiskBand(-1.5)).toBe('low')
    expect(classifyRiskBand(2)).toBe('low')
  })
})

describe('totalReturnPct', () => {
  it('110 -> +10%', () => {
    expect(totalReturnPct(110)).toBe(10)
  })
  it('90 -> -10%', () => {
    expect(totalReturnPct(90)).toBe(-10)
  })
})