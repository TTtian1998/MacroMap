import type { Explanation } from '../types/game'

export function ExplanationPanel({ explanation }: { explanation: Explanation }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="text-sm text-slate-400 mb-2">解释区 · 传导链 + 知识点</div>
      <div className="mb-4">
        <div className="text-xs text-slate-500 mb-1">完整传导链</div>
        <ol className="space-y-1.5">
          {explanation.chain.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
              <span className="font-mono text-sky-300 w-5">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mb-4 text-sm text-slate-300 leading-relaxed">
        <span className="text-slate-500">总结：</span>
        {explanation.summary}
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-1">知识点</div>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
          {explanation.knowledgePoints.map((kp, i) => (
            <li key={i}>{kp}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}