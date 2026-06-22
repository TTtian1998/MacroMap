import type { Question, AnswerRecord, ScoreDimension, ScoreBoard } from '../types/game'

export interface AnswerCheck {
  correct: boolean
  explanation: string
}

/** 比较玩家答案与正确答案（支持 string 和 string[]） */
export function validateAnswer(question: Question, userAnswer: string | string[]): AnswerCheck {
  const correct = isAnswerCorrect(question, userAnswer)
  return { correct, explanation: question.explanation }
}

function isAnswerCorrect(question: Question, userAnswer: string | string[]): boolean {
  if (question.type === 'chainSort') {
    if (!Array.isArray(question.answer) || !Array.isArray(userAnswer)) return false
    if (question.answer.length !== userAnswer.length) return false
    // 严格相等（顺序敏感）
    return question.answer.every((step, i) => step === userAnswer[i])
  }
  // direction / decision：string 精确匹配
  return typeof question.answer === 'string' && question.answer === userAnswer
}

/** 把答对的题目映射到维度加分 */
export function applyDimensionGains(
  currentBoard: ScoreBoard,
  question: Question,
  isCorrect: boolean,
  increment = 10
): { board: ScoreBoard; gains: Partial<Record<ScoreDimension, number>> } {
  const gains: Partial<Record<ScoreDimension, number>> = {}
  if (!isCorrect) return { board: currentBoard, gains }

  const board = { ...currentBoard }
  for (const dim of question.dimensions) {
    gains[dim] = increment
    board[dim] = board[dim] + increment
  }
  return { board, gains }
}

/** 把整局所有 AnswerRecord 转成 ScoreBoard 增量 */
export function scoreBoardFromAnswers(
  questions: Question[],
  records: AnswerRecord[]
): { board: ScoreBoard; gainsByRound: Partial<Record<ScoreDimension, number>>; correctCount: number; directionCorrectCount: number; directionTotal: number } {
  const board: ScoreBoard = {
    macroUnderstanding: 0,
    interestRateSensitivity: 0,
    dollarSystemUnderstanding: 0,
    commodityCycleUnderstanding: 0,
    equityValuationUnderstanding: 0,
    riskControlAwareness: 0,
    roleSurvivalScore: 0,
  }
  const gainsByRound: Partial<Record<ScoreDimension, number>> = {}
  let correctCount = 0
  let directionCorrectCount = 0
  let directionTotal = 0

  for (const rec of records) {
    const q = questions.find((x) => x.id === rec.questionId)
    if (!q) continue
    if (rec.correct) {
      correctCount++
      if (q.type === 'direction') directionCorrectCount++
      for (const dim of q.dimensions) {
        const inc = 10
        board[dim] = board[dim] + inc
        gainsByRound[dim] = (gainsByRound[dim] ?? 0) + inc
      }
    }
    if (q.type === 'direction') directionTotal++
  }

  return { board, gainsByRound, correctCount, directionCorrectCount, directionTotal }
}

/** 限制每个维度到 [0, 100] */
export function clampScoreBoard(board: ScoreBoard): ScoreBoard {
  const out = {} as ScoreBoard
  for (const k of Object.keys(board) as ScoreDimension[]) {
    out[k] = Math.max(0, Math.min(100, board[k]))
  }
  return out
}

export function totalScore(board: ScoreBoard): number {
  return Object.values(board).reduce((acc, v) => acc + v, 0)
}