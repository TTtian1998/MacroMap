import { useGameStore } from '../store/gameStore'
import { VARIABLE_META, arrowForScore, scoreLabel } from '../data/variables'
import { MACRO_VARIABLES } from '../types/game'

export function VariablePanel() {
  const currentEvent = useGameStore((s) => s.currentEvent)
  const effects = currentEvent?.variableEffects ?? {}

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="text-sm text-slate-400 mb-2">宏观变量</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {MACRO_VARIABLES.map((key) => {
          const meta = VARIABLE_META[key]
          const score = effects[key]
          const colorClass =
            score === undefined
              ? 'text-slate-500'
              : score > 0
              ? 'text-emerald-300'
              : score < 0
              ? 'text-rose-300'
              : 'text-amber-300'
          return (
            <div
              key={key}
              className="bg-slate-900/40 rounded-md p-2 border border-slate-700/60"
              title={meta.definition}
            >
              <div className="text-xs text-slate-400">{meta.label}</div>
              <div className={`text-lg font-mono ${colorClass}`}>
                {score === undefined ? '—' : arrowForScore(score)}
              </div>
              <div className="text-[10px] text-slate-500">
                {score === undefined ? '中性' : scoreLabel(score)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}