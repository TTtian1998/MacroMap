// ============================================================================
// Macro Map — Game Type System
// 全部类型定义集中在此文件，确保数据层、引擎层、UI 层共享契约。
// ============================================================================

// ---------- 宏观变量（8 个） ----------
export const MACRO_VARIABLES = [
  'interestRate',
  'usd',
  'inflation',
  'growth',
  'riskAppetite',
  'liquidity',
  'commodityPrice',
  'creditStress',
] as const

export type MacroVariableKey = (typeof MACRO_VARIABLES)[number]

// ---------- 区域（6 个） ----------
export const REGIONS = [
  'usa',
  'china',
  'europe',
  'japan',
  'middleEast',
  'emergingMarkets',
] as const

export type RegionKey = (typeof REGIONS)[number]

// ---------- 资产（10 类） ----------
export const ASSETS = [
  'usTechStocks',
  'chinaGrowthStocks',
  'hkInternetStocks',
  'usBonds',
  'gold',
  'oil',
  'copper',
  'banks',
  'consumerStocks',
  'cash',
] as const

export type AssetKey = (typeof ASSETS)[number]

// ---------- 角色（5 个） ----------
export const ROLES = [
  'trader',
  'officeWorker',
  'businessOwner',
  'civilServant',
  'fundManager',
] as const

export type RoleKey = (typeof ROLES)[number]

// ---------- 事件分类（8 类） ----------
export const EVENT_CATEGORIES = [
  'usMonetaryPolicy',
  'usEconomicData',
  'chinaPolicy',
  'chinaEconomicData',
  'geopolitics',
  'commoditySupply',
  'technologyCycle',
  'financialRisk',
] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

// ---------- 影响分数类型（-2 ~ +2） ----------
export type EffectScore = -2 | -1 | 0 | 1 | 2

// ---------- 维度（7 个） ----------
export const SCORE_DIMENSIONS = [
  'macroUnderstanding',
  'interestRateSensitivity',
  'dollarSystemUnderstanding',
  'commodityCycleUnderstanding',
  'equityValuationUnderstanding',
  'riskControlAwareness',
  'roleSurvivalScore',
] as const

export type ScoreDimension = (typeof SCORE_DIMENSIONS)[number]

export type ScoreBoard = Record<ScoreDimension, number>

// ---------- 诊断类型（4 种） ----------
export const DIAGNOSIS_TYPES = [
  '热点追逐型',
  '宏观敏感型',
  '风险控制型',
  '资产配置型',
] as const

export type DiagnosisType = (typeof DIAGNOSIS_TYPES)[number]

// ---------- 诊断维度判定类型 ----------
export type RiskBand = 'low' | 'medium' | 'high'

// ---------- 事件效果 ----------
export interface EffectDetail {
  score: EffectScore
  reason: string
}

// ---------- 题目 ----------
export interface Question {
  id: string
  type: 'direction' | 'chainSort' | 'decision'
  prompt: string
  options?: string[]
  /** direction / decision: string; chainSort: string[] */
  answer: string | string[]
  explanation: string
  /** 这道题影响哪些维度，答对时各 +10 */
  dimensions: ScoreDimension[]
}

// ---------- 解释 ----------
export interface Explanation {
  chain: string[]
  summary: string
  knowledgePoints: string[]
}

// ---------- 事件 ----------
export interface MacroEvent {
  id: string
  title: string
  category: EventCategory
  difficulty: 1 | 2 | 3
  description: string
  variableEffects: Partial<Record<MacroVariableKey, EffectScore>>
  regionEffects: Partial<Record<RegionKey, EffectDetail>>
  assetEffects: Partial<Record<AssetKey, EffectDetail>>
  roleEffects: Partial<Record<RoleKey, string>>
  questions: Question[]
  explanation: Explanation
}

// ---------- 组合 ----------
export type Portfolio = Record<AssetKey, number>

// ---------- 单回合玩家作答 ----------
export interface AnswerRecord {
  questionId: string
  userAnswer: string | string[]
  correct: boolean
}

// ---------- 单回合结果 ----------
export interface RoundResult {
  round: number
  eventId: string
  assetScores: Partial<Record<AssetKey, EffectScore>>
  roundReturn: number
  portfolioValue: number
  riskBand: RiskBand
  answers: AnswerRecord[]
  dimensionGains: Partial<Record<ScoreDimension, number>>
}

// ---------- 游戏主状态 ----------
export type GameStatus = 'notStarted' | 'playing' | 'finished'

export interface GameState {
  currentRound: number
  maxRounds: 5
  selectedRole: RoleKey | null
  portfolio: Portfolio | null
  /** 预先随机选好的 5 个事件（id 列表） */
  scheduledEventIds: string[]
  /** 当前回合的事件 */
  currentEvent: MacroEvent | null
  answeredQuestions: AnswerRecord[]
  scoreBoard: ScoreBoard
  portfolioValue: number
  history: RoundResult[]
  gameStatus: GameStatus
}

// ---------- 历史成绩 ----------
export interface HistoryRecord {
  finishedAt: number
  role: RoleKey
  totalScore: number
  portfolioValue: number
  diagnosisType: DiagnosisType
  dimensionScores: ScoreBoard
}