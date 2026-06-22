import { useState, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { PRESET_PORTFOLIOS, assertPortfolioSumsTo100 } from '../data/portfolios'
import { ASSETS } from '../types/game'
import type { Portfolio, AssetKey } from '../types/game'
import { ASSET_META } from '../data/assets'

const CUSTOM_TAB = '__custom__'

export function PortfolioSelect() {
  const selectPortfolio = useGameStore((s) => s.selectPortfolio)
  const startGame = useGameStore((s) => s.startGame)
  const portfolio = useGameStore((s) => s.portfolio)
  const selectedRole = useGameStore((s) => s.selectedRole)
  const [activeTab, setActiveTab] = useState<string>(
    portfolio ? '__custom__' : PRESET_PORTFOLIOS[0]?.id ?? CUSTOM_TAB
  )
  const [custom, setCustom] = useState<Partial<Portfolio>>(() =>
    portfolio
      ? { ...portfolio }
      : { ...(PRESET_PORTFOLIOS[0]?.weights ?? {}) }
  )

  const customSum = useMemo(
    () => Object.values(custom).reduce((acc, v) => acc + (v ?? 0), 0),
    [custom]
  )
  const customValid = Math.abs(customSum - 100) < 0.5

  function handleConfirm() {
    let finalPortfolio: Portfolio
    if (activeTab === CUSTOM_TAB) {
      if (!customValid) return
      // 把 custom 归一化到 sum=100
      const factor = 100 / (customSum || 1)
      const normalized: Portfolio = {} as Portfolio
      let alloc = 0
      for (let i = 0; i < ASSETS.length; i++) {
        const k = ASSETS[i]
        const v = custom[k] ?? 0
        if (i === ASSETS.length - 1) {
          normalized[k] = Math.round((100 - alloc) * 10) / 10
        } else {
          const w = Math.round(v * factor * 10) / 10
          normalized[k] = w
          alloc += w
        }
      }
      assertPortfolioSumsTo100(normalized)
      finalPortfolio = normalized
    } else {
      const preset = PRESET_PORTFOLIOS.find((p) => p.id === activeTab)
      if (!preset) return
      finalPortfolio = preset.weights
    }
    selectPortfolio(finalPortfolio)
    // 直接开始游戏
    setTimeout(() => startGame(), 0)
  }

  if (!selectedRole) return null

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">选择初始资产组合</h2>
        <p className="text-slate-400 mb-6">权重合计必须为 100%。可以选预设，也可以自定义。</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_PORTFOLIOS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveTab(p.id)
                setCustom({ ...p.weights })
              }}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                activeTab === p.id
                  ? 'bg-sky-500 border-sky-400 text-white'
                  : 'border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setActiveTab(CUSTOM_TAB)}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              activeTab === CUSTOM_TAB
                ? 'bg-sky-500 border-sky-400 text-white'
                : 'border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            自定义
          </button>
        </div>

        {activeTab !== CUSTOM_TAB ? (
          <PresetDetail id={activeTab} />
        ) : (
          <CustomEditor custom={custom} setCustom={setCustom} sum={customSum} valid={customValid} />
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={handleConfirm}
            disabled={activeTab === CUSTOM_TAB && !customValid}
            className={`px-6 py-2.5 rounded-lg font-medium ${
              (activeTab !== CUSTOM_TAB || customValid)
                ? 'bg-sky-500 hover:bg-sky-400 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            确认并开始 →
          </button>
        </div>
      </div>
    </div>
  )
}

function PresetDetail({ id }: { id: string }) {
  const preset = PRESET_PORTFOLIOS.find((p) => p.id === id)
  if (!preset) return null
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <div className="text-lg font-semibold text-slate-100 mb-1">{preset.name}</div>
      <div className="text-sm text-slate-400 mb-4">{preset.description}</div>
      <PortfolioBar weights={preset.weights} />
    </div>
  )
}

function CustomEditor({
  custom,
  setCustom,
  sum,
  valid,
}: {
  custom: Partial<Portfolio>
  setCustom: (p: Partial<Portfolio>) => void
  sum: number
  valid: boolean
}) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-slate-100">自定义权重</div>
        <div className={`text-sm font-mono ${valid ? 'text-emerald-300' : 'text-rose-300'}`}>
          合计 {sum.toFixed(1)}% {!valid && '（需为 100%）'}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ASSETS.map((k) => (
          <div key={k} className="flex items-center gap-3">
            <div className="w-28 text-sm text-slate-300">{ASSET_META[k].label}</div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={custom[k] ?? 0}
              onChange={(e) =>
                setCustom({ ...custom, [k]: Number(e.target.value) })
              }
              className="flex-1 accent-sky-500"
            />
            <div className="w-14 text-right text-sm font-mono text-slate-200">
              {(custom[k] ?? 0).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <PortfolioBar weights={custom as Portfolio} />
      </div>
    </div>
  )
}

function PortfolioBar({ weights }: { weights: Portfolio }) {
  const segments = ASSETS.map((k) => ({
    key: k,
    weight: weights[k] ?? 0,
    label: ASSET_META[k].shortLabel,
  })).filter((s) => s.weight > 0)

  const palette: Record<string, string> = {
    usTechStocks: 'bg-indigo-500',
    chinaGrowthStocks: 'bg-rose-500',
    hkInternetStocks: 'bg-orange-500',
    usBonds: 'bg-emerald-500',
    gold: 'bg-amber-400',
    oil: 'bg-yellow-600',
    copper: 'bg-orange-700',
    banks: 'bg-sky-600',
    consumerStocks: 'bg-teal-500',
    cash: 'bg-slate-400',
  }

  return (
    <div>
      <div className="h-6 w-full rounded-md overflow-hidden flex bg-slate-900/40">
        {segments.map((s) => (
          <div
            key={s.key as AssetKey}
            className={palette[s.key] ?? 'bg-slate-500'}
            style={{ width: `${s.weight}%` }}
            title={`${s.label} ${s.weight}%`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {segments.map((s) => (
          <div key={s.key as AssetKey} className="flex items-center gap-1">
            <span className={`inline-block w-2.5 h-2.5 rounded-sm ${palette[s.key] ?? 'bg-slate-500'}`} />
            <span className="text-slate-300">{s.label}</span>
            <span className="text-slate-500">{s.weight}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}