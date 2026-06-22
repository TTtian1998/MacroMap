import type { MacroEvent } from '../types/game'
import { EVENTS } from '../data/events'

const POOL_SIZE = 20
const ROUNDS_PER_GAME = 5
const REQUIRED_HIGH_DIFFICULTY = 2

/**
 * 随机选择 5 个不重复的事件：
 * - 至少 2 张 difficulty >= 2
 * - 5 张事件 id 唯一
 */
export function pickFiveEvents(pool: MacroEvent[] = EVENTS): MacroEvent[] {
  if (pool.length < ROUNDS_PER_GAME) {
    throw new Error(`Event pool too small: ${pool.length} < ${ROUNDS_PER_GAME}`)
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const picked: MacroEvent[] = []

  // 先保证高难度配额
  const high = shuffled.filter((e) => e.difficulty >= 2)

  const needHigh = Math.min(REQUIRED_HIGH_DIFFICULTY, high.length)
  for (let i = 0; i < needHigh; i++) picked.push(high[i])

  // 用剩余事件补足
  for (const e of shuffled) {
    if (picked.length >= ROUNDS_PER_GAME) break
    if (!picked.find((p) => p.id === e.id)) picked.push(e)
  }

  // 兜底：万一仍然不足
  while (picked.length < ROUNDS_PER_GAME) {
    const candidate = shuffled.find((e) => !picked.find((p) => p.id === e.id))
    if (!candidate) break
    picked.push(candidate)
  }

  return picked.slice(0, ROUNDS_PER_GAME)
}

/** 按事件 id 列表还原事件对象 */
export function resolveEventsByIds(ids: string[]): MacroEvent[] {
  return ids
    .map((id) => EVENTS.find((e) => e.id === id))
    .filter((e): e is MacroEvent => Boolean(e))
}

/** 当前事件库的分类分布（用于自检） */
export function categoryDistribution(pool: MacroEvent[] = EVENTS): Record<string, number> {
  const dist: Record<string, number> = {}
  for (const e of pool) dist[e.category] = (dist[e.category] ?? 0) + 1
  return dist
}

export const EVENT_POOL_SIZE = POOL_SIZE
export const ROUNDS = ROUNDS_PER_GAME