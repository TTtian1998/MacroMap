import type { ScoreBoard, Portfolio, RoleKey } from '../types/game'

/**
 * 根据角色 + 组合 + 当前得分，估算角色生存分（0~100）
 * MVP 简化：基于组合权重在不同角色关心维度上的暴露程度
 */
export function roleSurvivalScore(args: {
  scoreBoard: ScoreBoard
  portfolio: Portfolio
  role: RoleKey
}): number {
  const { scoreBoard, portfolio, role } = args

  // 不同角色"理想组合"的方向（简化版）
  const idealExposures: Record<RoleKey, { likes: string[]; dislikes: string[] }> = {
    trader: { likes: ['usTechStocks', 'chinaGrowthStocks', 'oil'], dislikes: ['cash'] },
    officeWorker: { likes: ['cash', 'usBonds', 'consumerStocks'], dislikes: ['usTechStocks', 'oil', 'copper'] },
    businessOwner: { likes: ['banks', 'consumerStocks', 'cash'], dislikes: ['usTechStocks'] },
    civilServant: { likes: ['usBonds', 'cash', 'gold'], dislikes: ['oil', 'copper'] },
    fundManager: { likes: ['usBonds', 'usTechStocks', 'gold', 'cash'], dislikes: [] },
  }

  const ideal = idealExposures[role]
  let fit = 0
  for (const [k, w] of Object.entries(portfolio)) {
    if (ideal.likes.includes(k)) fit += w
    if (ideal.dislikes.includes(k)) fit -= w * 0.5
  }

  // 基础分 = 暴露度（0~100），加上 scoreBoard.roleSurvivalScore 的现有累计
  const base = Math.max(0, Math.min(60, fit * 0.6))
  const existing = scoreBoard.roleSurvivalScore
  return Math.min(100, Math.round(base + existing * 0.4))
}