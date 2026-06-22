import { useGameStore } from '../store/gameStore'
import { totalScore } from '../engine/questionEngine'
import { riskBandColor, riskBandLabel } from '../data/diagnosis'
import { ROLE_META } from '../data/roles'

export function StatusBar() {
  const currentRound = useGameStore((s) => s.currentRound)
  const maxRounds = useGameStore((s) => s.maxRounds)
  const scoreBoard = useGameStore((s) => s.scoreBoard)
  const portfolioValue = useGameStore((s) => s.portfolioValue)
  const selectedRole = useGameStore((s) => s.selectedRole)
  const history = useGameStore((s) => s.history)

  const last = history[history.length - 1]
  const score = totalScore(scoreBoard)
  const pct = portfolioValue - 100

  return (
    <div className="bg-slate-800/80 border-b border-slate-700 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-5 text-sm">
        <div>
          <span className="text-slate-500">回合</span>{' '}
          <span className="text-slate-100 font-mono text-base">
            {currentRound} / {maxRounds}
          </span>
        </div>
        <div>
          <span className="text-slate-500">角色</span>{' '}
          <span className="text-slate-100">
            {selectedRole ? ROLE_META[selectedRole].label : '—'}
          </span>
        </div>
        <div>
          <span className="text-slate-500">总分</span>{' '}
          <span className="text-sky-300 font-mono text-base">{score}</span>
          <span className="text-slate-500 text-xs"> /700</span>
        </div>
        <div>
          <span className="text-slate-500">组合价值</span>{' '}
          <span className={`font-mono text-base ${pct >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {portfolioValue.toFixed(1)}
          </span>
          <span className="text-slate-500 text-xs ml-1">({pct >= 0 ? '+' : ''}{pct.toFixed(1)}%)</span>
        </div>
      </div>
      {last && (
        <div className={`text-xs px-2.5 py-1 rounded-full border ${riskBandColor(last.riskBand)}`}>
          本回合风险：{riskBandLabel(last.riskBand)}
        </div>
      )}
    </div>
  )
}