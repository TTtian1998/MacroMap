import { useGameStore } from '../store/gameStore'
import { ASSET_META } from '../data/assets'
import { ASSETS } from '../types/game'

export function AssetImpactPanel() {
  const currentEvent = useGameStore((s) => s.currentEvent)
  const effects = currentEvent?.assetEffects ?? {}

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="text-sm text-slate-400 mb-2">资产影响</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {ASSETS.map((key) => {
          const meta = ASSET_META[key]
          const effect = effects[key]
          const score = effect?.score
          const color =
            score === undefined
              ? 'border-slate-700/60'
              : score > 0
              ? 'border-emerald-400/60'
              : score < 0
              ? 'border-rose-400/60'
              : 'border-amber-400/60'
          return (
            <div
              key={key}
              className={`bg-slate-900/40 rounded-md p-2 border ${color}`}
              title={effect?.reason ?? '影响较小'}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-200">{meta.label}</div>
                <div
                  className={`text-lg font-mono ${
                    score === undefined
                      ? 'text-slate-500'
                      : score > 0
                      ? 'text-emerald-300'
                      : score < 0
                      ? 'text-rose-300'
                      : 'text-amber-300'
                  }`}
                >
                  {score === undefined ? '—' : score > 0 ? `+${score}` : score}
                </div>
              </div>
              {effect && (
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">{effect.reason}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}