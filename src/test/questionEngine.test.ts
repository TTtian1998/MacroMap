import { describe, it, expect } from 'vitest'
import { validateAnswer, scoreBoardFromAnswers, clampScoreBoard, totalScore } from '../engine/questionEngine'
import type { Question, AnswerRecord } from '../types/game'

describe('validateAnswer', () => {
  it('direction: 正确', () => {
    const q: Question = {
      id: 'q1',
      type: 'direction',
      prompt: 'test',
      options: ['A', 'B'],
      answer: 'A',
      explanation: '因为 A',
      dimensions: ['macroUnderstanding'],
    }
    expect(validateAnswer(q, 'A').correct).toBe(true)
    expect(validateAnswer(q, 'B').correct).toBe(false)
  })

  it('chainSort: 严格相等才算正确', () => {
    const q: Question = {
      id: 'q2',
      type: 'chainSort',
      prompt: '排序',
      options: ['A', 'B', 'C'],
      answer: ['A', 'B', 'C'],
      explanation: '',
      dimensions: ['macroUnderstanding'],
    }
    expect(validateAnswer(q, ['A', 'B', 'C']).correct).toBe(true)
    expect(validateAnswer(q, ['A', 'C', 'B']).correct).toBe(false)
    expect(validateAnswer(q, ['B', 'A', 'C']).correct).toBe(false)
  })

  it('chainSort: 长度不一致判定为错误', () => {
    const q: Question = {
      id: 'q3',
      type: 'chainSort',
      prompt: '',
      options: ['A', 'B', 'C'],
      answer: ['A', 'B', 'C'],
      explanation: '',
      dimensions: [],
    }
    expect(validateAnswer(q, ['A', 'B']).correct).toBe(false)
  })

  it('decision: 单选', () => {
    const q: Question = {
      id: 'q4',
      type: 'decision',
      prompt: '怎么做？',
      options: ['加仓', '减仓'],
      answer: '减仓',
      explanation: '',
      dimensions: ['riskControlAwareness'],
    }
    expect(validateAnswer(q, '减仓').correct).toBe(true)
    expect(validateAnswer(q, '加仓').correct).toBe(false)
  })
})

describe('scoreBoardFromAnswers', () => {
  const questions: Question[] = [
    {
      id: 'q1',
      type: 'direction',
      prompt: '',
      options: ['A'],
      answer: 'A',
      explanation: '',
      dimensions: ['macroUnderstanding', 'interestRateSensitivity'],
    },
    {
      id: 'q2',
      type: 'decision',
      prompt: '',
      options: ['A'],
      answer: 'A',
      explanation: '',
      dimensions: ['riskControlAwareness'],
    },
  ]

  it('全对累加维度', () => {
    const records: AnswerRecord[] = [
      { questionId: 'q1', userAnswer: 'A', correct: true },
      { questionId: 'q2', userAnswer: 'A', correct: true },
    ]
    const result = scoreBoardFromAnswers(questions, records)
    expect(result.board.macroUnderstanding).toBe(10)
    expect(result.board.interestRateSensitivity).toBe(10)
    expect(result.board.riskControlAwareness).toBe(10)
    expect(result.correctCount).toBe(2)
  })

  it('错题不加分', () => {
    const records: AnswerRecord[] = [
      { questionId: 'q1', userAnswer: 'B', correct: false },
      { questionId: 'q2', userAnswer: 'A', correct: true },
    ]
    const result = scoreBoardFromAnswers(questions, records)
    expect(result.board.macroUnderstanding).toBe(0)
    expect(result.board.riskControlAwareness).toBe(10)
    expect(result.correctCount).toBe(1)
  })
})

describe('clampScoreBoard', () => {
  it('超过 100 被截断', () => {
    const board = {
      macroUnderstanding: 150,
      interestRateSensitivity: -10,
      dollarSystemUnderstanding: 50,
      commodityCycleUnderstanding: 50,
      equityValuationUnderstanding: 50,
      riskControlAwareness: 50,
      roleSurvivalScore: 50,
    }
    const clamped = clampScoreBoard(board)
    expect(clamped.macroUnderstanding).toBe(100)
    expect(clamped.interestRateSensitivity).toBe(0)
  })
})

describe('totalScore', () => {
  it('累加 7 维度', () => {
    const board = {
      macroUnderstanding: 10,
      interestRateSensitivity: 20,
      dollarSystemUnderstanding: 30,
      commodityCycleUnderstanding: 40,
      equityValuationUnderstanding: 50,
      riskControlAwareness: 60,
      roleSurvivalScore: 70,
    }
    expect(totalScore(board)).toBe(280)
  })
})