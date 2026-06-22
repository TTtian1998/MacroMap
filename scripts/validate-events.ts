#!/usr/bin/env tsx
/**
 * 事件库自检脚本：
 * - 校验每张事件卡字段齐全
 * - 校验 score 在 [-2, 2] 范围内
 * - 校验 20 张事件卡分类计数符合 spec §22 / proposal
 *
 * Usage: npm run validate:events
 */

import { EVENTS } from '../src/data/events'
import {
  MACRO_VARIABLES,
  REGIONS,
  ASSETS,
  ROLES,
  SCORE_DIMENSIONS,
  EVENT_CATEGORIES,
} from '../src/types/game'

const EXPECTED_TOTAL = 20
const EXPECTED_DISTRIBUTION: Record<string, number> = {
  usMonetaryPolicy: 4,
  usEconomicData: 4,
  chinaPolicy: 2,
  chinaEconomicData: 3,
  geopolitics: 2,
  commoditySupply: 2,
  technologyCycle: 1,
  financialRisk: 2,
}
const VALID_SCORES = new Set([-2, -1, 0, 1, 2])

let errors = 0
function fail(msg: string) {
  console.error(`  ✗ ${msg}`)
  errors++
}
function ok(msg: string) {
  console.log(`  ✓ ${msg}`)
}

console.log('Validating event library...')

// 1) 数量
if (EVENTS.length !== EXPECTED_TOTAL) {
  fail(`Expected ${EXPECTED_TOTAL} events, got ${EVENTS.length}`)
} else {
  ok(`Event count: ${EVENTS.length}`)
}

// 2) id 唯一
const ids = new Set<string>()
for (const e of EVENTS) {
  if (ids.has(e.id)) fail(`Duplicate event id: ${e.id}`)
  ids.add(e.id)
}
ok(`Unique IDs: ${ids.size}`)

// 3) 分类分布
const dist: Record<string, number> = {}
for (const e of EVENTS) dist[e.category] = (dist[e.category] ?? 0) + 1
let distOk = true
for (const [cat, expected] of Object.entries(EXPECTED_DISTRIBUTION)) {
  const actual = dist[cat] ?? 0
  if (actual !== expected) {
    fail(`Category "${cat}" expected ${expected}, got ${actual}`)
    distOk = false
  }
}
if (distOk) ok(`Category distribution matches spec`)

// 4) 每张卡字段检查
const validVariables = new Set<string>(MACRO_VARIABLES)
const validRegions = new Set<string>(REGIONS)
const validAssets = new Set<string>(ASSETS)
const validRoles = new Set<string>(ROLES)
const validDimensions = new Set<string>(SCORE_DIMENSIONS)
const validCategories = new Set<string>(EVENT_CATEGORIES)

for (const e of EVENTS) {
  const ctx = `${e.id}:`
  if (!e.id) fail(`${ctx} missing id`)
  if (!e.title) fail(`${ctx} missing title`)
  if (!validCategories.has(e.category)) fail(`${ctx} invalid category: ${e.category}`)
  if (![1, 2, 3].includes(e.difficulty)) fail(`${ctx} invalid difficulty: ${e.difficulty}`)
  if (!e.description) fail(`${ctx} missing description`)
  if (!e.questions || e.questions.length === 0) {
    fail(`${ctx} has no questions`)
  }
  if (!e.explanation || !e.explanation.chain || e.explanation.chain.length < 4) {
    fail(`${ctx} explanation.chain too short (<4)`)
  }
  if (e.explanation && e.explanation.chain && e.explanation.chain.length > 10) {
    fail(`${ctx} explanation.chain too long (>10)`)
  }

  // variableEffects
  for (const [k, v] of Object.entries(e.variableEffects ?? {})) {
    if (!validVariables.has(k)) fail(`${ctx} invalid variable key: ${k}`)
    if (v === undefined || !VALID_SCORES.has(v)) fail(`${ctx} variable ${k} has invalid score: ${v}`)
  }

  // regionEffects
  for (const [k, v] of Object.entries(e.regionEffects ?? {})) {
    if (!validRegions.has(k)) fail(`${ctx} invalid region key: ${k}`)
    if (!VALID_SCORES.has(v.score)) fail(`${ctx} region ${k} has invalid score: ${v.score}`)
    if (!v.reason) fail(`${ctx} region ${k} missing reason`)
  }

  // assetEffects
  for (const [k, v] of Object.entries(e.assetEffects ?? {})) {
    if (!validAssets.has(k)) fail(`${ctx} invalid asset key: ${k}`)
    if (!VALID_SCORES.has(v.score)) fail(`${ctx} asset ${k} has invalid score: ${v.score}`)
    if (!v.reason) fail(`${ctx} asset ${k} missing reason`)
  }

  // roleEffects
  for (const [k, v] of Object.entries(e.roleEffects ?? {})) {
    if (!validRoles.has(k)) fail(`${ctx} invalid role key: ${k}`)
    if (!v) fail(`${ctx} role ${k} missing text`)
  }

  // questions
  for (const q of e.questions ?? []) {
    if (!q.id) fail(`${ctx}/${q.id} missing id`)
    if (!q.prompt) fail(`${ctx}/${q.id} missing prompt`)
    if (!['direction', 'chainSort', 'decision'].includes(q.type)) {
      fail(`${ctx}/${q.id} invalid type: ${q.type}`)
    }
    if (!q.explanation) fail(`${ctx}/${q.id} missing explanation`)
    if (q.type === 'chainSort') {
      if (!Array.isArray(q.answer)) fail(`${ctx}/${q.id} chainSort answer must be array`)
      if (!Array.isArray(q.options) || q.options.length !== q.answer.length) {
        fail(`${ctx}/${q.id} chainSort options length mismatch`)
      }
    } else {
      if (!Array.isArray(q.options)) fail(`${ctx}/${q.id} missing options`)
      if (typeof q.answer !== 'string') fail(`${ctx}/${q.id} non-chainSort answer must be string`)
      if (Array.isArray(q.options) && !q.options.includes(q.answer as string)) {
        fail(`${ctx}/${q.id} answer "${q.answer}" not in options`)
      }
    }
    if (!q.dimensions || q.dimensions.length === 0) {
      fail(`${ctx}/${q.id} missing dimensions metadata`)
    }
    for (const d of q.dimensions ?? []) {
      if (!validDimensions.has(d)) fail(`${ctx}/${q.id} invalid dimension: ${d}`)
    }
  }

  // 难度 >= 2 至少 2 道题
  if (e.difficulty >= 2 && e.questions.length < 2) {
    fail(`${ctx} difficulty>=2 requires at least 2 questions, has ${e.questions.length}`)
  }
}

ok(`Per-event field validation done`)

if (errors > 0) {
  console.error(`\n❌ Validation failed with ${errors} error(s)`)
  process.exit(1)
}
console.log(`\n✅ All ${EVENTS.length} events valid`)