import { useGameStore } from '../store/gameStore'
import { ROLE_META } from '../data/roles'

export function RoleImpactPanel() {
  const currentEvent = useGameStore((s) => s.currentEvent)
  const selectedRole = useGameStore((s) => s.selectedRole)

  if (!currentEvent || !selectedRole) return null

  const impact = currentEvent.roleEffects[selectedRole]
  const role = ROLE_META[selectedRole]

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">角色影响 · {role.label}</div>
        <div className="text-xs text-slate-500">{role.summary}</div>
      </div>
      <p className="text-sm text-slate-200 leading-relaxed">{impact ?? '本事件对当前角色影响有限。'}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {role.concerns.map((c) => (
          <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400">
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}