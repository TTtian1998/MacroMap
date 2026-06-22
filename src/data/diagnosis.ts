import type { DiagnosisType, ScoreBoard, ScoreDimension, RiskBand, RoundResult } from '../types/game'
import { DIAGNOSIS_TYPES } from '../types/game'

interface DiagnosisMeta {
  type: DiagnosisType
  title: string
  features: string[]
  advice: string
}

/** 各诊断类型的判定阈值常量（便于调整和测试） */
export const DIAGNOSIS_THRESHOLDS = {
  hotChaser: {
    /** direction 题正确率超过此值即认为偏"热点追逐" */
    highDirectionRatio: 0.8,
    /** macroUnderstanding 低于此值认为宏观理解弱 */
    lowMacroUnderstanding: 50,
    /** 高风险回合数占比 */
    highRiskRatio: 0.4,
  },
  macroSensitive: {
    /** 利率敏感度高于此值 */
    highInterestRateSensitivity: 70,
    /** 美元体系理解高于此值 */
    highDollarUnderstanding: 70,
    /** 频繁切换组合（粗略：用回合收益正负交替表示） */
  },
  riskControl: {
    /** 低风险回合占比 */
    lowRiskRatio: 0.7,
    /** 风险控制意识高于此值 */
    highRiskControl: 70,
  },
  assetAllocator: {
    /** 各维度均衡：最低维度 ≥ 此值 */
    minDimension: 50,
    /** 最大回撤 < 此值（百分比单位，最差单回合亏损的绝对值） */
    maxDrawdown: 5,
  },
}

export const DIAGNOSIS_META: Record<DiagnosisType, DiagnosisMeta> = {
  '热点追逐型': {
    type: '热点追逐型',
    title: '热点追逐型',
    features: [
      '方向判断题正确率高',
      '宏观传导链理解较弱',
      '容易追涨杀跌',
    ],
    advice: '每次交易前先判断自己赚的是业绩钱、估值钱、周期钱，还是情绪钱。',
  },
  '宏观敏感型': {
    type: '宏观敏感型',
    title: '宏观敏感型',
    features: [
      '对利率、美元、通胀较敏感',
      '可能过度交易宏观信号',
    ],
    advice: '宏观判断需要和行业景气、估值、市场预期结合，不能只看单一变量。',
  },
  '风险控制型': {
    type: '风险控制型',
    title: '风险控制型',
    features: [
      '仓位谨慎',
      '能识别高风险事件',
      '可能错过高弹性机会',
    ],
    advice: '保持风险控制优势，同时学会在高胜率场景中适度提高仓位。',
  },
  '资产配置型': {
    type: '资产配置型',
    title: '资产配置型',
    features: [
      '能理解不同资产的互补关系',
      '不盲目押注单一方向',
    ],
    advice: '继续强化股债商品现金之间的组合管理能力。',
  },
}

/** 工具：算出最差的单回合收益 */
export function maxDrawdown(history: RoundResult[]): number {
  if (history.length === 0) return 0
  let worst = 0
  for (const r of history) {
    if (r.roundReturn < worst) worst = r.roundReturn
  }
  return Math.abs(worst)
}

/** 工具：算出低/中/高风险回合占比 */
export function riskBandRatios(history: RoundResult[]): {
  low: number
  medium: number
  high: number
} {
  if (history.length === 0) return { low: 0, medium: 0, high: 0 }
  let low = 0, medium = 0, high = 0
  for (const r of history) {
    if (r.riskBand === 'low') low++
    else if (r.riskBand === 'medium') medium++
    else high++
  }
  const total = history.length
  return { low: low / total, medium: medium / total, high: high / total }
}

/** 工具：找出最弱的 1-2 个维度 */
export function weakestDimensions(scoreBoard: ScoreBoard, n = 2): ScoreDimension[] {
  return (Object.entries(scoreBoard) as [ScoreDimension, number][])
    .sort(([, a], [, b]) => a - b)
    .slice(0, n)
    .map(([k]) => k)
}

interface ClassificationContext {
  scoreBoard: ScoreBoard
  history: RoundResult[]
  /** direction 题正确率（0~1） */
  directionCorrectRatio?: number
}

/**
 * 主分类函数：按规则从最匹配的开始判断
 */
export function classify(ctx: ClassificationContext): DiagnosisType {
  const { scoreBoard, history, directionCorrectRatio = 0 } = ctx
  const ratios = riskBandRatios(history)
  const drawdown = maxDrawdown(history)
  const minDim = Math.min(...Object.values(scoreBoard))

  // 1) 资产配置型：均衡 + 小回撤
  if (
    minDim >= DIAGNOSIS_THRESHOLDS.assetAllocator.minDimension &&
    drawdown < DIAGNOSIS_THRESHOLDS.assetAllocator.maxDrawdown
  ) {
    return '资产配置型'
  }

  // 2) 风险控制型：低风险回合占多 + 风险控制维度高
  if (
    ratios.low >= DIAGNOSIS_THRESHOLDS.riskControl.lowRiskRatio &&
    scoreBoard.riskControlAwareness >= DIAGNOSIS_THRESHOLDS.riskControl.highRiskControl
  ) {
    return '风险控制型'
  }

  // 3) 宏观敏感型：利率 + 美元体系双高
  if (
    scoreBoard.interestRateSensitivity >= DIAGNOSIS_THRESHOLDS.macroSensitive.highInterestRateSensitivity &&
    scoreBoard.dollarSystemUnderstanding >= DIAGNOSIS_THRESHOLDS.macroSensitive.highDollarUnderstanding
  ) {
    return '宏观敏感型'
  }

  // 4) 热点追逐型：方向题正确率高 + 宏观理解低 + 高风险占比高
  if (
    directionCorrectRatio >= DIAGNOSIS_THRESHOLDS.hotChaser.highDirectionRatio ||
    (scoreBoard.macroUnderstanding < DIAGNOSIS_THRESHOLDS.hotChaser.lowMacroUnderstanding &&
      ratios.high >= DIAGNOSIS_THRESHOLDS.hotChaser.highRiskRatio)
  ) {
    return '热点追逐型'
  }

  // 5) 兜底：按最匹配维度
  const dimScores: [DiagnosisType, number][] = [
    ['热点追逐型', (100 - scoreBoard.macroUnderstanding) + ratios.high * 100],
    ['宏观敏感型', (scoreBoard.interestRateSensitivity + scoreBoard.dollarSystemUnderstanding) / 2],
    ['风险控制型', scoreBoard.riskControlAwareness + ratios.low * 100],
    ['资产配置型', minDim * 4 - drawdown * 200],
  ]
  dimScores.sort((a, b) => b[1] - a[1])
  return dimScores[0]?.[0] ?? DIAGNOSIS_TYPES[0]
}

/** 风险等级文字 */
export function riskBandLabel(band: RiskBand): string {
  return band === 'low' ? '低风险' : band === 'medium' ? '中风险' : '高风险'
}

export function riskBandColor(band: RiskBand): string {
  return band === 'low'
    ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/60'
    : band === 'medium'
    ? 'bg-amber-500/30 text-amber-100 border-amber-400/60'
    : 'bg-rose-600/40 text-rose-100 border-rose-400/60'
}