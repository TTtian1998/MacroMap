import { useGameStore } from '../store/gameStore'
import { useHistoryStore } from '../store/historyStore'
import { totalScore } from '../engine/questionEngine'
import { DIAGNOSIS_META, riskBandColor, riskBandLabel } from '../data/diagnosis'
import { ROLE_META } from '../data/roles'
import { SCORE_DIMENSIONS } from '../types/game'
import type { ScoreDimension, HistoryRecord } from '../types/game'

export function Report() {
  const scoreBoard = useGameStore((s) => s.scoreBoard)
  const portfolioValue = useGameStore((s) => s.portfolioValue)
  const selectedRole = useGameStore((s) => s.selectedRole)
  const history = useGameStore((s) => s.history)
  const restart = useGameStore((s) => s.restart)
  const records = useHistoryStore((s) => s.records)

  const total = totalScore(scoreBoard)
  const diagnosisType = records[0]?.diagnosisType ?? '热点追逐型'
  const diagnosis = DIAGNOSIS_META[diagnosisType]
  const weakest = [...SCORE_DIMENSIONS].sort(
    (a, b) => scoreBoard[a] - scoreBoard[b]
  ).slice(0, 2)

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">诊断报告</h1>
          <p className="text-slate-400 mt-1">5 回合模拟已完成，以下是你的认知画像。</p>
        </div>

        {/* 总分卡 */}
        <div className="bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-400/40 rounded-xl p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-300">总分</div>
            <div className="text-5xl font-bold text-sky-200 font-mono">{total}</div>
            <div className="text-xs text-slate-400">满分 700 · {ROLE_META[selectedRole ?? 'trader'].label}</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">组合价值</div>
            <div className={`text-3xl font-mono ${portfolioValue >= 100 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {portfolioValue.toFixed(1)}
            </div>
            <div className="text-xs text-slate-400">
              收益 {(portfolioValue - 100).toFixed(1)}% · 基准 100
            </div>
          </div>
        </div>

        {/* 诊断 */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <div className="text-sm text-slate-400 mb-2">诊断类型</div>
          <div className="text-2xl font-bold text-slate-100 mb-2">{diagnosis.title}</div>
          <ul className="text-sm text-slate-300 list-disc list-inside space-y-1 mb-3">
            {diagnosis.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <div className="bg-sky-500/10 border border-sky-400/40 rounded-lg p-3 text-sm text-sky-100">
            <span className="text-sky-300 font-medium">建议：</span>
            {diagnosis.advice}
          </div>
        </div>

        {/* 维度分 */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <div className="text-sm text-slate-400 mb-3">维度得分</div>
          <div className="space-y-2">
            {SCORE_DIMENSIONS.map((dim) => (
              <DimensionBar
                key={dim}
                dim={dim}
                value={scoreBoard[dim]}
                isWeak={weakest.includes(dim)}
              />
            ))}
          </div>
        </div>

        {/* 回合历史 */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <div className="text-sm text-slate-400 mb-3">本局回合记录</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-400 text-xs">
                <tr>
                  <th className="text-left py-1">回合</th>
                  <th className="text-left py-1">事件</th>
                  <th className="text-right py-1">收益</th>
                  <th className="text-right py-1">价值</th>
                  <th className="text-right py-1">风险</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.round} className="border-t border-slate-700/60">
                    <td className="py-1.5 text-slate-300">{r.round}</td>
                    <td className="py-1.5 text-slate-200">{r.eventId}</td>
                    <td className={`py-1.5 text-right font-mono ${r.roundReturn >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {r.roundReturn >= 0 ? '+' : ''}{r.roundReturn.toFixed(1)}%
                    </td>
                    <td className="py-1.5 text-right font-mono text-slate-200">{r.portfolioValue.toFixed(1)}</td>
                    <td className="py-1.5 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${riskBandColor(r.riskBand)}`}>
                        {riskBandLabel(r.riskBand)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 历史成绩 */}
        {records.length > 1 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-3">历史成绩（最近 10 局）</div>
            <div className="space-y-1.5 text-sm">
              {records.slice(0, 10).map((r, i) => (
                <HistoryRow key={`${r.finishedAt}-${i}`} rec={r} />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            onClick={restart}
            className="px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium"
          >
            再来一局
          </button>
        </div>
        <div className="text-center text-xs text-slate-500 pt-2">
          本游戏用于金融知识学习，不构成任何投资建议。
        </div>
      </div>
    </div>
  )
}

const DIM_LABEL: Record<ScoreDimension, string> = {
  macroUnderstanding: '宏观理解',
  interestRateSensitivity: '利率敏感度',
  dollarSystemUnderstanding: '美元体系',
  commodityCycleUnderstanding: '商品周期',
  equityValuationUnderstanding: '股票估值',
  riskControlAwareness: '风险控制',
  roleSurvivalScore: '角色生存',
}

function DimensionBar({ dim, value, isWeak }: { dim: ScoreDimension; value: number; isWeak: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-sm text-slate-300">{DIM_LABEL[dim]}</div>
      <div className="flex-1 h-2 bg-slate-700/40 rounded-full overflow-hidden">
        <div
          className={`h-full ${isWeak ? 'bg-rose-500' : 'bg-sky-500'}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <div className="w-12 text-right text-sm font-mono text-slate-200">{value}</div>
      {isWeak && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-400/40">建议强化</span>}
    </div>
  )
}

function HistoryRow({ rec }: { rec: HistoryRecord }) {
  const date = new Date(rec.finishedAt)
  const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-700/40 last:border-b-0">
      <div className="text-slate-500 text-xs">{dateStr}</div>
      <div className="text-slate-300">{ROLE_META[rec.role].label}</div>
      <div className="font-mono text-sky-300">{rec.totalScore}</div>
      <div className="text-slate-400 text-xs">{rec.diagnosisType}</div>
    </div>
  )
}