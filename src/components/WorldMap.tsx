import { useGameStore } from '../store/gameStore'
import { REGION_META, colorForScore } from '../data/regions'
import { REGIONS } from '../types/game'

export function WorldMap() {
  const currentEvent = useGameStore((s) => s.currentEvent)
  const regionEffects = currentEvent?.regionEffects ?? {}

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="text-sm text-slate-400 mb-2">世界地图 · 区域影响</div>
      <svg viewBox="0 0 100 100" className="w-full h-auto aspect-[2/1.4]" preserveAspectRatio="xMidYMid meet">
        {/* 海/底色 */}
        <rect x={0} y={0} width={100} height={100} className="fill-slate-900/40" />
        {/* 经纬网格 */}
        <g className="stroke-slate-700/40" strokeWidth={0.2} fill="none">
          {[20, 40, 60, 80].map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={100} y2={y} />
          ))}
          {[20, 40, 60, 80].map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={100} />
          ))}
        </g>
        {/* 区域方块 */}
        {REGIONS.map((key) => {
          const meta = REGION_META[key]
          const effect = regionEffects[key]
          const color = colorForScore(effect?.score)
          return (
            <g key={key} className="cursor-help">
              <rect
                x={meta.rect.x}
                y={meta.rect.y}
                width={meta.rect.w}
                height={meta.rect.h}
                rx={1.5}
                className={`${color.bg} ${color.border} stroke-2 transition-colors`}
              />
              <text
                x={meta.rect.x + meta.rect.w / 2}
                y={meta.rect.y + meta.rect.h / 2 + 0.8}
                textAnchor="middle"
                className={`fill-current ${color.text}`}
                fontSize={3}
              >
                {meta.shortLabel}
              </text>
              <title>
                {meta.label}
                {effect ? ` · 影响 ${effect.score > 0 ? '+' : ''}${effect.score}` : ' · 影响较小'}
                {effect ? `\n${effect.reason}` : ''}
              </title>
            </g>
          )
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {REGIONS.map((k) => (
          <div key={k} className="flex items-center gap-1">
            <span className="text-slate-300">{REGION_META[k].label}</span>
            <span className={`font-mono ${regionScoreColor(regionEffects[k]?.score)}`}>
              {regionEffects[k] ? formatScore(regionEffects[k]!.score) : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatScore(score: number): string {
  if (score > 0) return `+${score}`
  return `${score}`
}

function regionScoreColor(score: number | undefined): string {
  if (score === undefined) return 'text-slate-500'
  if (score > 0) return 'text-emerald-300'
  if (score < 0) return 'text-rose-300'
  return 'text-amber-300'
}