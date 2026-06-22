import { useGameStore } from '../store/gameStore'
import { StatusBar } from './StatusBar'
import { WorldMap } from './WorldMap'
import { EventCard } from './EventCard'
import { VariablePanel } from './VariablePanel'
import { AssetImpactPanel } from './AssetImpactPanel'
import { RoleImpactPanel } from './RoleImpactPanel'
import { QuestionPanel } from './QuestionPanel'
import { ExplanationPanel } from './ExplanationPanel'
import { roleSurvivalScore } from '../engine/roleScoring'

export function MainGame() {
  const currentEvent = useGameStore((s) => s.currentEvent)
  const currentRound = useGameStore((s) => s.currentRound)
  const maxRounds = useGameStore((s) => s.maxRounds)
  const portfolio = useGameStore((s) => s.portfolio)
  const answeredQuestions = useGameStore((s) => s.answeredQuestions)
  const nextRound = useGameStore((s) => s.nextRound)
  const selectedRole = useGameStore((s) => s.selectedRole)
  const scoreBoard = useGameStore((s) => s.scoreBoard)

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        加载事件中…
      </div>
    )
  }

  const allQuestionsAnswered = answeredQuestions.length === currentEvent.questions.length
  const isLastRound = currentRound >= maxRounds

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* 左侧：地图 + 事件卡 */}
        <div className="lg:col-span-5 space-y-4">
          <WorldMap />
          <EventCard event={currentEvent} />
        </div>
        {/* 右侧：变量/资产/角色面板 */}
        <div className="lg:col-span-7 space-y-4">
          <VariablePanel />
          <AssetImpactPanel />
          <RoleImpactPanel />
        </div>
      </div>
      {/* 底部：题目 + 解释 */}
      <div className="border-t border-slate-700 bg-slate-900/60 p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {currentEvent.questions.map((q, i) => (
              <QuestionPanel key={q.id} question={q} index={i} total={currentEvent.questions.length} />
            ))}
          </div>
          <div>
            {allQuestionsAnswered ? (
              <ExplanationPanel explanation={currentEvent.explanation} />
            ) : (
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-slate-400 text-sm">
                完成所有题目后查看传导链解释。
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            角色生存分预测：
            <span className="ml-1 text-slate-300 font-mono">
              {selectedRole && portfolio
                ? Math.round(
                    roleSurvivalScore({
                      scoreBoard,
                      portfolio,
                      role: selectedRole,
                    })
                  )
                : '—'}
            </span>
          </div>
          <button
            disabled={!allQuestionsAnswered}
            onClick={() => nextRound()}
            className={`px-5 py-2 rounded-lg font-medium ${
              allQuestionsAnswered
                ? 'bg-sky-500 hover:bg-sky-400 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLastRound ? '查看诊断报告 →' : '进入下一回合 →'}
          </button>
        </div>
        <Disclaimer />
      </div>
    </div>
  )
}

function Disclaimer() {
  return (
    <div className="text-center text-xs text-slate-500 pt-2">
      本游戏用于金融知识学习，不构成任何投资建议。
    </div>
  )
}