import { useGameStore } from '../store/gameStore'
import { ROLE_META } from '../data/roles'
import { ROLES } from '../types/game'
import type { RoleKey } from '../types/game'

export function RoleSelect() {
  const selectRole = useGameStore((s) => s.selectRole)
  const selectedRole = useGameStore((s) => s.selectedRole)
  const history = useGameStore((s) => s.history)

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Header />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">选择你的角色</h2>
        <p className="text-slate-400 mb-6">不同角色关心的维度不同——先选一个身份开始。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((key) => {
            const meta = ROLE_META[key]
            const active = selectedRole === key
            return (
              <button
                key={key}
                onClick={() => selectRole(key as RoleKey)}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  active
                    ? 'border-sky-400 bg-sky-500/10 ring-2 ring-sky-400/30'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                }`}
              >
                <div className="text-lg font-semibold text-slate-100">{meta.label}</div>
                <div className="text-sm text-slate-400 mt-1">{meta.summary}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {meta.concerns.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {history.length > 0 ? `已完成 ${history.length} 个回合` : ''}
          </div>
          <a
            href="#portfolio"
            onClick={(e) => {
              if (!selectedRole) {
                e.preventDefault()
                return
              }
            }}
            className={`px-6 py-2.5 rounded-lg font-medium ${
              selectedRole
                ? 'bg-sky-500 hover:bg-sky-400 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            下一步：选择组合 →
          </a>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Macro Map</h1>
        <p className="text-slate-400 mt-1">世界经济模拟器 · 训练宏观传导链认知</p>
      </div>
      <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400">
        v0.1 MVP
      </span>
    </div>
  )
}