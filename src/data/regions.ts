import type { RegionKey, EffectScore } from '../types/game'

interface RegionMeta {
  key: RegionKey
  label: string
  shortLabel: string
  focusAreas: string[]
  /** 在世界地图中的占位位置（x, y, width, height，单位 0-100） */
  rect: { x: number; y: number; w: number; h: number }
}

export const REGION_META: Record<RegionKey, RegionMeta> = {
  usa: {
    key: 'usa',
    label: '美国',
    shortLabel: '美',
    focusAreas: ['美联储', '美元', '美债', '科技股', '消费', '就业'],
    rect: { x: 5, y: 22, w: 22, h: 22 },
  },
  china: {
    key: 'china',
    label: '中国',
    shortLabel: '中',
    focusAreas: ['政策', '社融', '地产', '消费', '制造业', 'A股'],
    rect: { x: 60, y: 28, w: 22, h: 22 },
  },
  europe: {
    key: 'europe',
    label: '欧洲',
    shortLabel: '欧',
    focusAreas: ['能源', '通胀', '制造业', '欧元', '出口'],
    rect: { x: 36, y: 18, w: 16, h: 18 },
  },
  japan: {
    key: 'japan',
    label: '日本',
    shortLabel: '日',
    focusAreas: ['日元', '央行政策', '出口', '套利交易'],
    rect: { x: 76, y: 30, w: 12, h: 14 },
  },
  middleEast: {
    key: 'middleEast',
    label: '中东',
    shortLabel: '中东',
    focusAreas: ['原油', '地缘冲突', '能源供给'],
    rect: { x: 40, y: 36, w: 16, h: 18 },
  },
  emergingMarkets: {
    key: 'emergingMarkets',
    label: '新兴市场',
    shortLabel: '新兴',
    focusAreas: ['美元流动性', '资本流动', '本币汇率', '外债压力'],
    rect: { x: 56, y: 56, w: 28, h: 28 },
  },
}

/** 根据 effectScore 返回 Tailwind 颜色类 */
export function colorForScore(score: EffectScore | undefined): {
  bg: string
  border: string
  text: string
} {
  if (score === undefined) {
    return { bg: 'bg-slate-700/40', border: 'border-slate-500/40', text: 'text-slate-300' }
  }
  if (score >= 1) {
    const deep = score === 2
    return deep
      ? { bg: 'bg-emerald-600/70', border: 'border-emerald-400', text: 'text-white' }
      : { bg: 'bg-emerald-500/40', border: 'border-emerald-400/60', text: 'text-emerald-50' }
  }
  if (score <= -1) {
    const deep = score === -2
    return deep
      ? { bg: 'bg-rose-700/80', border: 'border-rose-400', text: 'text-white' }
      : { bg: 'bg-rose-600/40', border: 'border-rose-400/60', text: 'text-rose-50' }
  }
  return { bg: 'bg-amber-500/30', border: 'border-amber-400/60', text: 'text-amber-50' }
}