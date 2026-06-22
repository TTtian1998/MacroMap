import type { RoleKey } from '../types/game'

interface RoleMeta {
  key: RoleKey
  label: string
  summary: string
  concerns: string[]
}

export const ROLE_META: Record<RoleKey, RoleMeta> = {
  trader: {
    key: 'trader',
    label: '交易员',
    summary: '以资产价格和仓位为核心，对回撤敏感。',
    concerns: ['资产价格', '仓位', '回撤', '风险敞口', '市场情绪'],
  },
  officeWorker: {
    key: 'officeWorker',
    label: '普通上班族',
    summary: '关心工资、就业、房贷与日常物价。',
    concerns: ['工资', '就业', '房贷', '物价', '消费压力'],
  },
  businessOwner: {
    key: 'businessOwner',
    label: '企业老板',
    summary: '关心融资、订单、库存、利润率和汇率。',
    concerns: ['融资成本', '订单需求', '库存', '利润率', '汇率'],
  },
  civilServant: {
    key: 'civilServant',
    label: '公务员',
    summary: '关心财政收入、地方债和公共支出。',
    concerns: ['财政收入', '地方债', '土地财政', '公共支出', '政策周期'],
  },
  fundManager: {
    key: 'fundManager',
    label: '基金经理',
    summary: '关心风格切换、估值、久期和赎回压力。',
    concerns: ['风格切换', '估值', '久期', '回撤', '客户赎回压力'],
  },
}