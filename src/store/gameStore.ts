import { create } from 'zustand'
import type {
  GameState,
  RoleKey,
  Portfolio,
  AnswerRecord,
  RoundResult,
  ScoreBoard,
  EffectScore,
  AssetKey,
} from '../types/game'
import { pickFiveEvents, resolveEventsByIds } from '../engine/eventEngine'
import {
  scoreBoardFromAnswers,
  clampScoreBoard,
  totalScore,
} from '../engine/questionEngine'
import {
  computeRoundReturn,
  computePortfolioValue,
  classifyRiskBand,
} from '../engine/portfolio'
import { classify } from '../data/diagnosis'
import { useHistoryStore } from './historyStore'

const MAX_ROUNDS = 5 as const
const INITIAL_PORTFOLIO_VALUE = 100

const emptyScoreBoard = (): ScoreBoard => ({
  macroUnderstanding: 0,
  interestRateSensitivity: 0,
  dollarSystemUnderstanding: 0,
  commodityCycleUnderstanding: 0,
  equityValuationUnderstanding: 0,
  riskControlAwareness: 0,
  roleSurvivalScore: 0,
})

const initialState = (): GameState => ({
  currentRound: 0,
  maxRounds: MAX_ROUNDS,
  selectedRole: null,
  portfolio: null,
  scheduledEventIds: [],
  currentEvent: null,
  answeredQuestions: [],
  scoreBoard: emptyScoreBoard(),
  portfolioValue: INITIAL_PORTFOLIO_VALUE,
  history: [],
  gameStatus: 'notStarted',
})

interface GameActions {
  selectRole: (role: RoleKey) => void
  selectPortfolio: (portfolio: Portfolio) => void
  startGame: () => void
  submitAnswers: (records: AnswerRecord[]) => void
  nextRound: () => void
  restart: () => void
  /** 内部：在游戏状态变 finished 时由 nextRound 自动写入历史 */
  _archiveToHistory: () => void
}

export type GameStore = GameState & GameActions

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState(),

  selectRole: (role) => set({ selectedRole: role }),

  selectPortfolio: (portfolio) => set({ portfolio }),

  startGame: () => {
    const { selectedRole, portfolio } = get()
    if (!selectedRole || !portfolio) {
      console.warn('Cannot start: role or portfolio missing')
      return
    }
    const picked = pickFiveEvents()
    const events = resolveEventsByIds(picked.map((e) => e.id))
    const firstEvent = events[0] ?? null
    set({
      scheduledEventIds: picked.map((e) => e.id),
      currentEvent: firstEvent,
      currentRound: firstEvent ? 1 : 0,
      gameStatus: 'playing',
      portfolioValue: INITIAL_PORTFOLIO_VALUE,
      history: [],
      answeredQuestions: [],
      scoreBoard: emptyScoreBoard(),
    })
  },

  submitAnswers: (records) => {
    const { currentEvent, scoreBoard } = get()
    if (!currentEvent) return
    const { board, gainsByRound } = scoreBoardFromAnswers(currentEvent.questions, records)
    const newBoard = {
      macroUnderstanding: scoreBoard.macroUnderstanding + board.macroUnderstanding,
      interestRateSensitivity: scoreBoard.interestRateSensitivity + board.interestRateSensitivity,
      dollarSystemUnderstanding: scoreBoard.dollarSystemUnderstanding + board.dollarSystemUnderstanding,
      commodityCycleUnderstanding: scoreBoard.commodityCycleUnderstanding + board.commodityCycleUnderstanding,
      equityValuationUnderstanding: scoreBoard.equityValuationUnderstanding + board.equityValuationUnderstanding,
      riskControlAwareness: scoreBoard.riskControlAwareness + board.riskControlAwareness,
      roleSurvivalScore: scoreBoard.roleSurvivalScore + board.roleSurvivalScore,
    }
    set({
      answeredQuestions: records,
      scoreBoard: newBoard,
      // 把本回合维度增量暂存到 history 占位（nextRound 才会写正式 RoundResult）
    })
    // 把维度增益临时挂到一个 ref-like 字段上，用 module 级变量承载
    lastRoundGains = gainsByRound
  },

  nextRound: () => {
    const {
      currentRound,
      scheduledEventIds,
      currentEvent,
      portfolio,
      portfolioValue,
      scoreBoard,
      answeredQuestions,
      history,
    } = get()
    if (!currentEvent || !portfolio) return

    const assetScores = extractAssetScores(currentEvent.assetEffects)
    const roundReturn = computeRoundReturn(portfolio, assetScores)
    const newValue = computePortfolioValue(portfolioValue, roundReturn)
    const riskBand = classifyRiskBand(roundReturn)

    const roundResult: RoundResult = {
      round: currentRound,
      eventId: currentEvent.id,
      assetScores,
      roundReturn,
      portfolioValue: newValue,
      riskBand,
      answers: answeredQuestions,
      dimensionGains: lastRoundGains,
    }

    const newHistory = [...history, roundResult]
    const isLast = currentRound >= MAX_ROUNDS

    if (isLast) {
      const finalBoard = clampScoreBoard(scoreBoard)
      set({
        scoreBoard: finalBoard,
        history: newHistory,
        portfolioValue: newValue,
        gameStatus: 'finished',
        currentEvent: null,
      })
      // 归档到历史
      setTimeout(() => get()._archiveToHistory(), 0)
      return
    }

    const nextIdx = currentRound // currentRound 是 1-based 已经回答完的回合
    const nextEventId = scheduledEventIds[nextIdx]
    const nextEvent = resolveEventsByIds([nextEventId])[0] ?? null

    set({
      currentRound: currentRound + 1,
      currentEvent: nextEvent,
      portfolioValue: newValue,
      history: newHistory,
      answeredQuestions: [],
    })
    lastRoundGains = {}
  },

  restart: () => {
    lastRoundGains = {}
    set({ ...initialState() })
  },

  _archiveToHistory: () => {
    const { selectedRole, scoreBoard, portfolioValue } = get()
    if (!selectedRole) return
    const history = get().history
    const directionCorrectRatio = computeDirectionCorrectRatio(history)
    const diagnosisType = classify({ scoreBoard, history, directionCorrectRatio })
    useHistoryStore.getState().addRecord({
      finishedAt: Date.now(),
      role: selectedRole,
      totalScore: totalScore(scoreBoard),
      portfolioValue,
      diagnosisType,
      dimensionScores: scoreBoard,
    })
  },
}))

/** module 级：暂存最近一次 submitAnswers 的维度增益，供 nextRound 写入 RoundResult */
let lastRoundGains: Partial<Record<string, number>> = {}

/** 从 EffectDetail 字典里抽出 score 字段 */
function extractAssetScores(
  effects: Partial<Record<AssetKey, { score: EffectScore; reason: string }>>
): Partial<Record<AssetKey, EffectScore>> {
  const out: Partial<Record<AssetKey, EffectScore>> = {}
  for (const [k, v] of Object.entries(effects)) {
    if (v && typeof v.score === 'number') {
      out[k as AssetKey] = v.score
    }
  }
  return out
}

function computeDirectionCorrectRatio(history: RoundResult[]): number {
  let total = 0
  let correct = 0
  for (const r of history) {
    for (const a of r.answers) {
      // 不在这里判断题目类型，store 层简化处理：
      // 我们用 answers 的 correct 字段做粗略估计（direction 题占大多数）
      total++
      if (a.correct) correct++
    }
  }
  return total === 0 ? 0 : correct / total
}