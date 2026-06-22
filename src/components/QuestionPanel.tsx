import { useState } from 'react'
import type { Question } from '../types/game'
import { useGameStore } from '../store/gameStore'
import { validateAnswer } from '../engine/questionEngine'

interface QuestionPanelProps {
  question: Question
  index: number
  total: number
}

export function QuestionPanel({ question, index, total }: QuestionPanelProps) {
  const [userAnswer, setUserAnswer] = useState<string | string[] | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const submitAnswers = useGameStore((s) => s.submitAnswers)

  const { correct, explanation } = userAnswer
    ? validateAnswer(question, userAnswer)
    : { correct: false, explanation: '' }

  function pick(value: string) {
    if (submitted) return
    if (question.type === 'chainSort') {
      // 点击选项按顺序加入链
      const cur = Array.isArray(userAnswer) ? userAnswer : []
      if (cur.includes(value)) return
      const next = [...cur, value]
      setUserAnswer(next)
      if (next.length === (question.options?.length ?? 0)) {
        finalize(next)
      }
    } else {
      setUserAnswer(value)
    }
  }

  function finalize(answer: string | string[]) {
    const { correct } = validateAnswer(question, answer)
    setSubmitted(true)
    submitAnswers([
      {
        questionId: question.id,
        userAnswer: answer,
        correct,
      },
    ])
  }

  function reset() {
    setUserAnswer(null)
    setSubmitted(false)
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-slate-400">
          题目 {index + 1} / {total} · {questionTypeLabel(question.type)}
        </span>
      </div>
      <p className="text-base text-slate-100 leading-relaxed mb-3">{question.prompt}</p>

      {question.type === 'chainSort' && (
        <ChainSortInput
          question={question}
          userAnswer={userAnswer}
          submitted={submitted}
          correct={correct}
          onPick={pick}
          onReset={reset}
        />
      )}

      {(question.type === 'direction' || question.type === 'decision') && (
        <ChoiceInput
          options={question.options ?? []}
          userAnswer={userAnswer as string | null}
          submitted={submitted}
          correctAnswer={question.answer as string}
          onPick={(v) => {
            pick(v)
            finalize(v)
          }}
        />
      )}

      {submitted && (
        <div
          className={`mt-3 p-3 rounded-lg border text-sm leading-relaxed ${
            correct
              ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-100'
              : 'bg-rose-500/10 border-rose-400/40 text-rose-100'
          }`}
        >
          <div className="font-semibold mb-1">{correct ? '✓ 答对了' : '✗ 答错了'}</div>
          <div>{explanation}</div>
        </div>
      )}
    </div>
  )
}

function questionTypeLabel(type: Question['type']): string {
  switch (type) {
    case 'direction':
      return '方向判断'
    case 'chainSort':
      return '传导链排序'
    case 'decision':
      return '决策题'
  }
}

function ChoiceInput({
  options,
  userAnswer,
  submitted,
  correctAnswer,
  onPick,
}: {
  options: string[]
  userAnswer: string | null
  submitted: boolean
  correctAnswer: string
  onPick: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {options.map((opt) => {
        const picked = userAnswer === opt
        const isCorrect = opt === correctAnswer
        let cls = 'bg-slate-900/40 border-slate-700 hover:border-slate-500 text-slate-200'
        if (picked) {
          cls = isCorrect
            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-50'
            : 'bg-rose-500/20 border-rose-400 text-rose-50'
        } else if (submitted && isCorrect) {
          cls = 'bg-emerald-500/10 border-emerald-400/60 text-emerald-100'
        }
        return (
          <button
            key={opt}
            disabled={submitted}
            onClick={() => onPick(opt)}
            className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${cls}`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function ChainSortInput({
  question,
  userAnswer,
  submitted,
  correct,
  onPick,
  onReset,
}: {
  question: Question
  userAnswer: string | string[] | null
  submitted: boolean
  correct: boolean
  onPick: (v: string) => void
  onReset: () => void
}) {
  const ordered = Array.isArray(userAnswer) ? userAnswer : []
  const remaining = (question.options ?? []).filter((o) => !ordered.includes(o))
  const correctChain = Array.isArray(question.answer) ? question.answer : []

  return (
    <div>
      <div className="text-xs text-slate-400 mb-2">按你认为的因果顺序依次点击：</div>
      <div className="space-y-2 mb-3">
        {ordered.map((step, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-500/15 border border-sky-400/40 text-sky-50 text-sm">
            <span className="font-mono w-6 text-sky-300">{i + 1}.</span>
            <span>{step}</span>
          </div>
        ))}
        {ordered.length === 0 && (
          <div className="text-xs text-slate-500 italic px-1">尚未选择，按顺序点击下方选项...</div>
        )}
      </div>
      {!submitted ? (
        <div className="flex flex-wrap gap-2">
          {remaining.map((opt) => (
            <button
              key={opt}
              onClick={() => onPick(opt)}
              className="px-3 py-1.5 rounded-full bg-slate-700/60 border border-slate-600 text-slate-200 text-sm hover:bg-slate-700"
            >
              {opt}
            </button>
          ))}
          {ordered.length > 0 && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-full border border-slate-600 text-slate-400 text-xs hover:text-slate-200"
            >
              重置
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className={`text-xs ${correct ? 'text-emerald-300' : 'text-rose-300'}`}>
            {correct ? '✓ 顺序正确' : '✗ 顺序错误，正确顺序如下：'}
          </div>
          {!correct && (
            <div className="space-y-1">
              {correctChain.map((step, i) => (
                <div key={i} className="px-3 py-1.5 rounded bg-slate-700/50 border border-slate-600 text-slate-200 text-xs">
                  {i + 1}. {step}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}