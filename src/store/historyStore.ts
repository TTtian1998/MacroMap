import { create } from 'zustand'
import type { HistoryRecord } from '../types/game'

const STORAGE_KEY = 'macromap.history'
const MAX_HISTORY = 50

function loadFromStorage(): HistoryRecord[] {
  try {
    if (typeof localStorage === 'undefined') return []
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((r) => isValidRecord(r)).slice(0, MAX_HISTORY)
  } catch (err) {
    console.warn('Failed to load history from localStorage:', err)
    return []
  }
}

function isValidRecord(r: unknown): r is HistoryRecord {
  if (!r || typeof r !== 'object') return false
  const o = r as Record<string, unknown>
  return (
    typeof o.finishedAt === 'number' &&
    typeof o.role === 'string' &&
    typeof o.totalScore === 'number' &&
    typeof o.portfolioValue === 'number' &&
    typeof o.diagnosisType === 'string' &&
    typeof o.dimensionScores === 'object'
  )
}

function saveToStorage(records: HistoryRecord[]) {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_HISTORY)))
  } catch (err) {
    console.warn('Failed to save history to localStorage:', err)
  }
}

interface HistoryState {
  records: HistoryRecord[]
  addRecord: (rec: HistoryRecord) => void
  clear: () => void
  /** 启动时调用，加载 storage */
  init: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  records: [],

  init: () => {
    const records = loadFromStorage()
    set({ records })
  },

  addRecord: (rec) => {
    const records = [rec, ...get().records].slice(0, MAX_HISTORY)
    set({ records })
    saveToStorage(records)
  },

  clear: () => {
    set({ records: [] })
    saveToStorage([])
  },
}))