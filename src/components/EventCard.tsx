import type { MacroEvent } from '../types/game'

const CATEGORY_LABEL: Record<string, string> = {
  usMonetaryPolicy: '美国货币政策',
  usEconomicData: '美国经济数据',
  chinaPolicy: '中国政策',
  chinaEconomicData: '中国经济数据',
  geopolitics: '地缘政治',
  commoditySupply: '商品供给',
  technologyCycle: '科技周期',
  financialRisk: '金融风险',
}

const DIFFICULTY_LABEL: Record<number, string> = {
  1: '★',
  2: '★★',
  3: '★★★',
}

export function EventCard({ event }: { event: MacroEvent }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
            {CATEGORY_LABEL[event.category]}
          </span>
          <span className="text-amber-300">{DIFFICULTY_LABEL[event.difficulty]}</span>
        </div>
        <span className="text-slate-500">{event.id}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{event.title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{event.description}</p>
    </div>
  )
}