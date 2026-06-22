import type { MacroEvent } from '../types/game'

/**
 * 20 张 MVP 事件卡
 * 分类分布（与 proposal / task 9.4 一致）：
 *   usMonetaryPolicy: 4
 *   usEconomicData: 4
 *   chinaPolicy: 2
 *   chinaEconomicData: 3
 *   geopolitics: 2
 *   commoditySupply: 2
 *   technologyCycle: 1
 *   financialRisk: 2
 */
export const EVENTS: MacroEvent[] = [
  // ====== 美国货币政策（4） ======
  {
    id: 'event_us_rate_hike',
    title: '美联储加息 25 个基点',
    category: 'usMonetaryPolicy',
    difficulty: 1,
    description: '美联储 FOMC 会议决定加息 25 个基点，联邦基金利率升至更高水平。',
    variableEffects: {
      interestRate: 2,
      usd: 1,
      liquidity: -1,
      riskAppetite: -1,
      growth: -1,
    },
    regionEffects: {
      usa: { score: -1, reason: '利率上行压制估值，企业融资成本上升。' },
      emergingMarkets: { score: -1, reason: '美元走强叠加融资条件收紧，新兴市场承压。' },
    },
    assetEffects: {
      usTechStocks: { score: -2, reason: '高估值成长股对利率最敏感。' },
      usBonds: { score: -2, reason: '加息直接压制债券价格。' },
      gold: { score: -1, reason: '名义利率上行、美元走强压制黄金。' },
      banks: { score: 1, reason: '净息差扩大，短期利好银行。' },
      cash: { score: 1, reason: '高利率环境下现金收益提升。' },
    },
    roleEffects: {
      trader: '降低高估值成长股仓位，关注利率敏感板块的回撤。',
      officeWorker: '房贷、车贷利率可能上行，月供压力增加。',
      businessOwner: '新增融资成本上升，扩张计划需要重新评估。',
      fundManager: '缩短组合久期，控制估值暴露。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '美联储加息后，10 年期美债收益率最可能如何变化？',
        options: ['明显上升', '小幅上升', '基本不变', '下降'],
        answer: '明显上升',
        explanation: '加息提高短端利率，并通过预期效应推高长端利率。',
        dimensions: ['interestRateSensitivity', 'macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '美联储加息',
        '联邦基金利率上行',
        '美债收益率全线上行',
        '美元走强',
        '高估值成长股折现率上升',
        '新兴市场资金回流美国',
      ],
      summary: '加息是典型的流动性紧缩事件，对估值敏感资产压制明显，对现金和银行短期利好。',
      knowledgePoints: [
        '加息对成长股的伤害通常大于价值股。',
        '银行短期受益于息差扩大，但经济衰退风险会反过来压制银行。',
        '新兴市场对美元利率最敏感。',
      ],
    },
  },
  {
    id: 'event_us_dovish_signal',
    title: '美联储释放降息信号',
    category: 'usMonetaryPolicy',
    difficulty: 1,
    description: '美联储官员暗示通胀回落速度好于预期，可能提前开始降息周期。',
    variableEffects: {
      interestRate: -1,
      usd: -1,
      liquidity: 1,
      riskAppetite: 2,
      growth: 1,
    },
    regionEffects: {
      usa: { score: 1, reason: '宽松预期提振估值与情绪。' },
      emergingMarkets: { score: 1, reason: '美元走弱、流动性改善利好新兴市场。' },
    },
    assetEffects: {
      usTechStocks: { score: 2, reason: '降息预期直接利好高估值成长股。' },
      usBonds: { score: 1, reason: '利率下行推升债券价格。' },
      gold: { score: 1, reason: '美元走弱、真实利率下行利好黄金。' },
      banks: { score: -1, reason: '息差预期收窄压制银行。' },
      cash: { score: -1, reason: '利率下行意味着现金再投资收益下降。' },
    },
    roleEffects: {
      trader: '成长股和长久期资产通常在降息预期下表现较好。',
      officeWorker: '房贷利率可能见顶，月供压力有望缓解。',
      businessOwner: '再融资条件改善，资本支出意愿回升。',
      fundManager: '可适度延长组合久期、加配成长风格。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '美联储释放降息信号后，美元最可能如何走？',
        options: ['走强', '走弱', '基本不变'],
        answer: '走弱',
        explanation: '降息预期降低美元资产吸引力，叠加利差收窄，美元承压。',
        dimensions: ['dollarSystemUnderstanding', 'macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '美联储释放降息信号',
        '市场预期短端利率下行',
        '美债收益率下行',
        '美元走弱',
        '风险偏好上升',
        '成长股和黄金受益',
      ],
      summary: '降息预期是风险资产和黄金的友好环境，但需关注通胀是否配合下行。',
      knowledgePoints: [
        '降息预期往往比降息本身更早反映在资产价格中。',
        '美元走弱通常对应新兴市场和商品的相对收益。',
        '银行在降息周期中息差预期收窄，通常承压。',
      ],
    },
  },
  {
    id: 'event_us_hawkish_speech',
    title: '美联储主席鹰派讲话',
    category: 'usMonetaryPolicy',
    difficulty: 2,
    description: '美联储主席公开讲话措辞偏鹰，强调通胀风险尚未消除，市场推迟降息预期。',
    variableEffects: {
      interestRate: 1,
      usd: 1,
      riskAppetite: -2,
      inflation: 0,
    },
    regionEffects: {
      usa: { score: -1, reason: '紧缩预期升温，估值压制。' },
      emergingMarkets: { score: -1, reason: '美元走强、流动性预期收紧。' },
    },
    assetEffects: {
      usTechStocks: { score: -2, reason: '高估值成长股对紧缩预期最敏感。' },
      usBonds: { score: -1, reason: '鹰派讲话推升收益率。' },
      gold: { score: -1, reason: '美元走强、利率预期上行压制黄金。' },
      cash: { score: 1, reason: '高利率持续，现金收益有保障。' },
    },
    roleEffects: {
      trader: '短期市场情绪转弱，注意成长股回撤。',
      officeWorker: '通胀压力仍在，物价回落速度可能慢于预期。',
      fundManager: '客户可能开始关注回撤，需要及时沟通策略。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '鹰派讲话后，风险资产短期最可能：',
        options: ['上涨', '下跌', '震荡', '不受影响'],
        answer: '下跌',
        explanation: '紧缩预期升温压制估值，风险偏好下降。',
        dimensions: ['riskControlAwareness', 'macroUnderstanding'],
      },
      {
        id: 'q2',
        type: 'chainSort',
        prompt: '请按因果顺序排列以下传导链：',
        options: ['高估值成长股承压', '美联储鹰派讲话', '美元走强', '降息预期推迟'],
        answer: ['美联储鹰派讲话', '降息预期推迟', '美元走强', '高估值成长股承压'],
        explanation: '讲话 → 预期变化 → 汇率 → 估值。',
        dimensions: ['dollarSystemUnderstanding', 'macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '美联储鹰派讲话',
        '降息预期推迟',
        '美债收益率上行',
        '美元走强',
        '风险偏好下降',
        '成长股承压',
      ],
      summary: '鹰派讲话通过预期渠道影响市场，速度往往快于实际政策动作。',
      knowledgePoints: [
        '预期管理是央行最重要的工具之一。',
        '讲话比数据更早反映政策意图。',
      ],
    },
  },
  {
    id: 'event_us_taper',
    title: '美联储开始缩表',
    category: 'usMonetaryPolicy',
    difficulty: 1,
    description: '美联储宣布开始缩减资产负债表规模，市场流动性预期收紧。',
    variableEffects: {
      liquidity: -2,
      usd: 1,
      interestRate: 1,
      creditStress: 1,
    },
    regionEffects: {
      usa: { score: -1, reason: '流动性回收压制风险偏好。' },
      emergingMarkets: { score: -1, reason: '全球美元流动性边际收紧。' },
    },
    assetEffects: {
      usTechStocks: { score: -1, reason: '流动性回收压制成长股估值。' },
      usBonds: { score: -1, reason: '流动性收紧推升长端利率。' },
      cash: { score: 1, reason: '现金稀缺度上升。' },
      gold: { score: 0, reason: '影响相对中性。' },
    },
    roleEffects: {
      trader: '关注金融条件指数变化，警惕回购市场波动。',
      fundManager: '组合需要更注重流动性管理。',
      businessOwner: '中长期融资条件可能边际收紧。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '缩表最直接影响的是哪个宏观变量？',
        options: ['通胀', '流动性', '失业率', '消费者信心'],
        answer: '流动性',
        explanation: '缩表直接回收基础货币，影响银行体系准备金。',
        dimensions: ['macroUnderstanding', 'interestRateSensitivity'],
      },
    ],
    explanation: {
      chain: [
        '美联储缩表',
        '银行准备金下降',
        '金融条件收紧',
        '美债收益率上行',
        '风险资产承压',
      ],
      summary: '缩表与加息同方向，但作用机制不同——通过回收流动性影响金融条件。',
      knowledgePoints: [
        '缩表影响的是长端利率，加息影响的是短端利率。',
        '缩表的累积效应可能比加息更持久。',
      ],
    },
  },

  // ====== 美国经济数据（4） ======
  {
    id: 'event_us_cpi_hot',
    title: '美国 CPI 超预期',
    category: 'usEconomicData',
    difficulty: 1,
    description: '美国最新 CPI 数据高于市场预期，通胀压力重新升温。',
    variableEffects: {
      inflation: 2,
      interestRate: 1,
      usd: 1,
      liquidity: -1,
      riskAppetite: -1,
    },
    regionEffects: {
      usa: { score: -1, reason: '通胀压力上升，降息预期下降，股市估值承压。' },
      emergingMarkets: { score: -1, reason: '美元走强可能导致资金回流美国，新兴市场承压。' },
    },
    assetEffects: {
      usTechStocks: { score: -2, reason: '高估值成长股对利率上行更敏感。' },
      usBonds: { score: -1, reason: '利率预期上行会压制债券价格。' },
      gold: { score: -1, reason: '真实利率和美元走强通常压制黄金。' },
      cash: { score: 1, reason: '高利率环境下现金防御价值上升。' },
    },
    roleEffects: {
      trader: '高估值成长股仓位需要控制，关注美债收益率和美元。',
      officeWorker: '通胀压力意味着生活成本可能继续偏高，降息推迟也会影响房贷压力。',
      businessOwner: '融资成本下降的预期减弱，扩张计划需要更谨慎。',
      fundManager: '成长风格短期承压，需要关注客户赎回和组合久期。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '美国 CPI 超预期后，降息预期通常会如何变化？',
        options: ['增强', '减弱', '没有影响'],
        answer: '减弱',
        explanation: '通胀高于预期会让美联储更难快速降息。',
        dimensions: ['interestRateSensitivity', 'macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        'CPI 超预期',
        '通胀压力上升',
        '降息预期下降',
        '美债收益率上行',
        '美元偏强',
        '高估值成长股承压',
        '新兴市场风险偏好下降',
      ],
      summary: 'CPI 超预期属于典型的利率上行冲击，对成长股、债券和黄金短期偏压制。',
      knowledgePoints: [
        '通胀数据会影响美联储政策预期。',
        '利率上行会提高股票估值折现率。',
        '美元走强会压制部分新兴市场资产。',
      ],
    },
  },
  {
    id: 'event_us_jobs_strong',
    title: '美国非农就业强劲',
    category: 'usEconomicData',
    difficulty: 1,
    description: '美国非农就业数据大超预期，失业率下行，工资增速加快。',
    variableEffects: {
      growth: 1,
      interestRate: 1,
      usd: 1,
      riskAppetite: 0,
    },
    regionEffects: {
      usa: { score: 1, reason: '就业强劲意味着经济韧性，利好美元资产。' },
      emergingMarkets: { score: -1, reason: '强就业推迟降息，美元走强。' },
    },
    assetEffects: {
      usTechStocks: { score: -1, reason: '强就业推迟降息，估值压力上升。' },
      banks: { score: 1, reason: '经济强劲利好信贷需求和资产质量。' },
      consumerStocks: { score: 1, reason: '就业和收入改善利好消费。' },
      usBonds: { score: -1, reason: '经济强韧+利率上行压制债券。' },
    },
    roleEffects: {
      trader: '关注"好消息=坏消息"逻辑：经济强可能延迟宽松。',
      officeWorker: '就业市场稳健，工作安全感提升。',
      fundManager: '周期价值股短期可能优于成长股。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '强劲非农数据发布后，美债收益率最可能：',
        options: ['下降', '上升', '震荡', '无变化'],
        answer: '上升',
        explanation: '强劲就业推迟降息预期，推升长端利率。',
        dimensions: ['interestRateSensitivity', 'macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '非农就业强劲',
        '经济韧性确认',
        '降息预期推迟',
        '美债收益率上行',
        '美元走强',
        '周期价值股优于成长股',
      ],
      summary: '强就业对风险资产是双刃剑：短期利好基本面，但推迟降息会压制估值。',
      knowledgePoints: [
        '非农数据是美联储政策的重要输入。',
        '"好消息可能是坏消息"在紧缩周期尤为明显。',
      ],
    },
  },
  {
    id: 'event_us_retail_weak',
    title: '美国零售销售低于预期',
    category: 'usEconomicData',
    difficulty: 1,
    description: '美国零售销售月率意外下滑，消费者支出动能减弱。',
    variableEffects: {
      growth: -1,
      interestRate: -1,
      usd: -1,
      riskAppetite: -1,
    },
    regionEffects: {
      usa: { score: -1, reason: '消费是美国经济主引擎，零售弱拖累增长。' },
      china: { score: -1, reason: '美国消费弱拖累中国出口预期。' },
    },
    assetEffects: {
      consumerStocks: { score: -2, reason: '零售直接打击消费股。' },
      usTechStocks: { score: 0, reason: '降息预期对冲了经济担忧。' },
      usBonds: { score: 1, reason: '经济走弱+降息预期利好债券。' },
      gold: { score: 1, reason: '避险需求+降息预期利好黄金。' },
    },
    roleEffects: {
      trader: '关注防御板块：消费必需品、公用事业、债券。',
      officeWorker: '如果就业市场跟着走弱，需警惕失业风险。',
      businessOwner: '美国消费弱可能影响出口型企业订单。',
    },
    questions: [
      {
        id: 'q1',
        type: 'decision',
        prompt: '作为基金经理，面对零售数据走弱，最合理的操作是：',
        options: [
          '全仓追高成长股',
          '增加防御资产配置，控制组合回撤',
          '加大杠杆买入消费股抄底',
          '不做任何调整',
        ],
        answer: '增加防御资产配置，控制组合回撤',
        explanation: '零售走弱可能是衰退早期信号，防御优先。',
        dimensions: ['riskControlAwareness', 'equityValuationUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '零售销售低于预期',
        '消费者支出担忧',
        '降息预期升温',
        '美债收益率下行',
        '防御板块相对受益',
        '周期消费股承压',
      ],
      summary: '零售走弱通常增加衰退担忧，但同时提升降息预期，两者方向相反时需要看相对强度。',
      knowledgePoints: [
        '零售数据是消费的"高频体温计"。',
        '衰退担忧期，债券和必需消费往往先于股票反应。',
      ],
    },
  },
  {
    id: 'event_us_recession_fear',
    title: '美国经济衰退担忧上升',
    category: 'usEconomicData',
    difficulty: 3,
    description: '多项经济指标走弱，收益率曲线倒挂持续，市场开始定价衰退风险。',
    variableEffects: {
      growth: -2,
      creditStress: 1,
      riskAppetite: -2,
      liquidity: -1,
    },
    regionEffects: {
      usa: { score: -2, reason: '衰退担忧直接压制风险偏好。' },
      europe: { score: -1, reason: '美国衰退拖累欧洲出口预期。' },
      emergingMarkets: { score: -1, reason: '全球风险偏好下降，新兴市场承压。' },
    },
    assetEffects: {
      usBonds: { score: 2, reason: '避险需求+降息预期利好债券。' },
      gold: { score: 2, reason: '避险+实际利率下行利好黄金。' },
      cash: { score: 1, reason: '防御价值上升。' },
      usTechStocks: { score: -1, reason: '盈利预期下调风险大于降息利好。' },
      banks: { score: -2, reason: '信用风险担忧+利率下行压制银行。' },
    },
    roleEffects: {
      trader: '做好风险管理，降低杠杆，避免追高。',
      officeWorker: '关注就业市场是否跟随走弱。',
      businessOwner: '做好现金储备，推迟非必要扩张。',
      fundManager: '和客户充分沟通，避免在底部赎回。',
    },
    questions: [
      {
        id: 'q1',
        type: 'chainSort',
        prompt: '衰退担忧上升时的传导链（按因果顺序排列）：',
        options: [
          '盈利预期下调',
          '信用利差走阔',
          '衰退担忧上升',
          '避险需求上升',
        ],
        answer: ['衰退担忧上升', '避险需求上升', '盈利预期下调', '信用利差走阔'],
        explanation: '担忧 → 避险 → 盈利下修 → 信用恶化。',
        dimensions: ['macroUnderstanding', 'riskControlAwareness'],
      },
      {
        id: 'q2',
        type: 'decision',
        prompt: '衰退担忧上升时，最合理的资产配置是：',
        options: [
          '集中持有银行股抄底',
          '加仓黄金+美债+现金，降低权益暴露',
          '加大杠杆买入高估值成长股',
          '不做调整',
        ],
        answer: '加仓黄金+美债+现金，降低权益暴露',
        explanation: '衰退早期防御优先，避免在不确定中下重注。',
        dimensions: ['riskControlAwareness', 'commodityCycleUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '衰退担忧上升',
        '避险需求上升',
        '美债收益率下行',
        '黄金上涨',
        '盈利预期下调',
        '权益资产承压',
      ],
      summary: '衰退担忧是宏观最复杂的状态：避险与降息预期同方向利好债券和黄金，但对权益是双刃剑。',
      knowledgePoints: [
        '衰退担忧期，资产相关性会发生剧烈变化。',
        '现金和短期国债在恐慌阶段具有不可替代的防御价值。',
      ],
    },
  },

  // ====== 中国政策（2） ======
  {
    id: 'event_china_rrr_cut',
    title: '中国央行宣布降准',
    category: 'chinaPolicy',
    difficulty: 1,
    description: '中国央行宣布下调金融机构存款准备金率，释放长期流动性。',
    variableEffects: {
      liquidity: 2,
      riskAppetite: 1,
      growth: 1,
    },
    regionEffects: {
      china: { score: 1, reason: '流动性改善有助于缓解融资压力，提振风险偏好。' },
    },
    assetEffects: {
      chinaGrowthStocks: { score: 1, reason: '流动性宽松通常利好成长股估值。' },
      banks: { score: 1, reason: '准备金释放可提升银行可贷资金。' },
      hkInternetStocks: { score: 1, reason: '中国政策宽松可改善港股互联网风险偏好。' },
    },
    roleEffects: {
      trader: 'A股和港股风险偏好可能改善，但仍要看政策力度和基本面验证。',
      businessOwner: '融资环境边际改善，贷款可得性可能提升。',
      civilServant: '政策意图偏稳增长，地方投资和融资环境可能边际改善。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '降准最直接影响的是哪个变量？',
        options: ['流动性', '原油供给', '美国就业', '黄金库存'],
        answer: '流动性',
        explanation: '降准释放银行体系长期资金，最直接影响流动性。',
        dimensions: ['macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '央行降准',
        '银行可贷资金增加',
        '流动性改善',
        '市场风险偏好上升',
        '权益资产估值修复',
      ],
      summary: '降准是典型的国内流动性宽松信号，但最终效果取决于实体融资需求和政策组合。',
      knowledgePoints: [
        '降准不等于企业一定会扩大投资。',
        '宽货币需要配合宽信用才更有效。',
        '市场通常会先交易政策预期。',
      ],
    },
  },
  {
    id: 'event_china_lpr_cut',
    title: '中国 LPR 下调',
    category: 'chinaPolicy',
    difficulty: 1,
    description: '中国央行下调 LPR 利率，5 年期 LPR 降幅超预期，传递稳地产信号。',
    variableEffects: {
      interestRate: -1,
      liquidity: 1,
      riskAppetite: 1,
      growth: 1,
    },
    regionEffects: {
      china: { score: 1, reason: 'LPR 下调直接降低实体融资成本，利好增长。' },
    },
    assetEffects: {
      banks: { score: -1, reason: '息差预期收窄，短期压制银行。' },
      chinaGrowthStocks: { score: 1, reason: '流动性改善+融资成本下行利好成长股。' },
      consumerStocks: { score: 1, reason: '房贷成本下降利好消费意愿。' },
      hkInternetStocks: { score: 1, reason: '中国基本面预期改善利好港股。' },
    },
    roleEffects: {
      officeWorker: '房贷利率可能下行，月供压力缓解。',
      businessOwner: '新增贷款成本下降，资本支出意愿可能回升。',
      civilServant: '稳增长信号明确，地方融资环境改善。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: 'LPR 下调最直接的受益人群是：',
        options: ['股票投资者', '房贷借款人', '出口企业', '黄金投资者'],
        answer: '房贷借款人',
        explanation: '5 年期 LPR 直接挂钩房贷利率。',
        dimensions: ['macroUnderstanding', 'interestRateSensitivity'],
      },
    ],
    explanation: {
      chain: [
        'LPR 下调',
        '实体融资成本下行',
        '房贷成本下降',
        '消费和投资意愿回升',
        '银行息差预期收窄',
      ],
      summary: 'LPR 下调是降息通道的关键信号，对房贷族和企业融资最直接，对银行偏中性偏负。',
      knowledgePoints: [
        '5 年期 LPR 主要影响房贷，1 年期主要影响企业贷款。',
        'LPR 不对称下调常用于稳地产。',
      ],
    },
  },

  // ====== 中国经济数据（3） ======
  {
    id: 'event_china_social_financing_weak',
    title: '中国社融低于预期',
    category: 'chinaEconomicData',
    difficulty: 1,
    description: '中国新增社融数据低于预期，居民贷款偏弱，实体融资需求不足。',
    variableEffects: {
      liquidity: -1,
      growth: -1,
      riskAppetite: -1,
    },
    regionEffects: {
      china: { score: -1, reason: '社融是经济领先指标，弱社融意味着需求不足。' },
    },
    assetEffects: {
      chinaGrowthStocks: { score: -1, reason: '融资需求弱拖累成长股估值。' },
      banks: { score: -1, reason: '信贷需求弱+利率下行预期压制银行。' },
      hkInternetStocks: { score: -1, reason: '中国基本面预期下修。' },
    },
    roleEffects: {
      trader: '关注政策是否进一步加码宽松。',
      businessOwner: '融资需求弱可能传导到订单不足。',
      civilServant: '警惕财政收入压力。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '社融低于预期后，市场通常预期：',
        options: ['央行可能进一步宽松', '央行会紧缩', '政策无变化'],
        answer: '央行可能进一步宽松',
        explanation: '弱社融会触发稳增长政策加码。',
        dimensions: ['macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '社融低于预期',
        '实体融资需求弱',
        '增长预期下修',
        '市场预期政策加码宽松',
        '等待新一轮政策刺激',
      ],
      summary: '社融是中国宏观的"领先指标"，弱社融往往触发后续政策反应。',
      knowledgePoints: [
        '社融看增量，更要看结构（居民 vs 企业）。',
        '社融领先 GDP 大约 1-2 个季度。',
      ],
    },
  },
  {
    id: 'event_china_real_estate_relax',
    title: '中国地产政策放松',
    category: 'chinaEconomicData',
    difficulty: 1,
    description: '多地放松限购、降低首付比例，地产政策进入新一轮宽松周期。',
    variableEffects: {
      riskAppetite: 1,
      growth: 1,
      liquidity: 1,
    },
    regionEffects: {
      china: { score: 1, reason: '地产是支柱产业，政策放松提振增长预期。' },
    },
    assetEffects: {
      banks: { score: 1, reason: '信贷需求边际改善。' },
      consumerStocks: { score: 1, reason: '地产链消费（家电、家居）受益。' },
      chinaGrowthStocks: { score: 0, reason: '流动性利好与基本面修复预期对冲。' },
    },
    roleEffects: {
      officeWorker: '购房门槛下降，刚需购房者选择增多。',
      businessOwner: '地产链上下游订单可能改善。',
      civilServant: '土地财政压力有望边际缓解。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '地产政策放松后，最直接受益的是：',
        options: ['黄金', '地产链相关消费', '原油', '美债'],
        answer: '地产链相关消费',
        explanation: '地产对家电、家居、建材等下游消费有强拉动。',
        dimensions: ['macroUnderstanding', 'equityValuationUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '地产政策放松',
        '购房需求边际改善',
        '信贷扩张',
        '地产链消费回暖',
        '银行资产质量预期改善',
      ],
      summary: '地产政策放松是中国稳增长的重要工具，但传导有时滞，需要持续观察销售数据。',
      knowledgePoints: [
        '地产政策放松不等于房价立即上涨。',
        '从政策到销售再到拿地的传导链条较长。',
      ],
    },
  },
  {
    id: 'event_china_export_strong',
    title: '中国出口数据超预期',
    category: 'chinaEconomicData',
    difficulty: 1,
    description: '中国出口同比增速大幅超预期，全球需求韧性确认。',
    variableEffects: {
      growth: 1,
      riskAppetite: 1,
      usd: -1,
    },
    regionEffects: {
      china: { score: 1, reason: '出口是中国经济重要支柱，超预期利好增长。' },
    },
    assetEffects: {
      chinaGrowthStocks: { score: 1, reason: '基本面预期改善利好股市。' },
      consumerStocks: { score: 1, reason: '出口企业盈利改善带动居民收入预期。' },
      banks: { score: 0, reason: '影响中性。' },
    },
    roleEffects: {
      trader: '出口链相关股票（电子、机械）可能阶段性表现。',
      businessOwner: '外贸企业订单充裕，产能利用率上升。',
      civilServant: '出口退税和外汇收入增加。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '出口超预期通常对应人民币汇率：',
        options: ['走强', '走弱', '无影响'],
        answer: '走强',
        explanation: '出口强势带来外汇结汇需求，支撑人民币。',
        dimensions: ['macroUnderstanding', 'dollarSystemUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '出口超预期',
        '外汇结汇需求增加',
        '人民币汇率走强',
        '出口企业盈利改善',
        '宏观增长预期上修',
      ],
      summary: '出口超预期是基本面利好的真实信号，但要警惕外部需求的可持续性。',
      knowledgePoints: [
        '中国是全球最大出口国，出口数据是观察全球需求的窗口。',
        '人民币升值对出口企业是双刃剑。',
      ],
    },
  },

  // ====== 地缘政治（2） ======
  {
    id: 'event_middle_east_conflict',
    title: '中东冲突升级',
    category: 'geopolitics',
    difficulty: 1,
    description: '中东地缘冲突升级，市场担心原油供应受扰。',
    variableEffects: {
      commodityPrice: 2,
      inflation: 1,
      riskAppetite: -1,
    },
    regionEffects: {
      middleEast: { score: -2, reason: '地缘风险直接上升。' },
      europe: { score: -1, reason: '能源进口成本可能上升。' },
    },
    assetEffects: {
      oil: { score: 2, reason: '供应扰动预期推高油价。' },
      gold: { score: 1, reason: '避险需求上升。' },
      consumerStocks: { score: -1, reason: '能源价格上升可能压制消费和企业利润率。' },
    },
    roleEffects: {
      officeWorker: '油价上涨可能推高通勤和生活成本。',
      businessOwner: '运输和能源成本上升，利润率承压。',
      trader: '原油和黄金可能受益，但权益风险偏好下降。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '中东冲突升级最直接利好哪类资产？',
        options: ['原油', '航空股', '高估值科技股', '长期消费股'],
        answer: '原油',
        explanation: '中东冲突会引发市场对原油供应的担忧。',
        dimensions: ['commodityCycleUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '中东冲突升级',
        '原油供应担忧',
        '油价上涨',
        '通胀压力上升',
        '风险偏好下降',
        '黄金避险需求上升',
      ],
      summary: '地缘冲突通常会首先影响能源和避险资产，再通过通胀和风险偏好影响股债市场。',
      knowledgePoints: [
        '地缘事件不一定长期影响市场，但短期冲击明显。',
        '油价上涨既可能利好能源资产，也可能压制消费和制造业。',
      ],
    },
  },
  {
    id: 'event_opec_cut',
    title: 'OPEC 宣布减产',
    category: 'geopolitics',
    difficulty: 1,
    description: 'OPEC+ 意外宣布额外减产，原油供应预期收紧。',
    variableEffects: {
      commodityPrice: 2,
      inflation: 1,
      usd: 0,
    },
    regionEffects: {
      middleEast: { score: 1, reason: '油价上涨短期增加中东产油国收入。' },
      europe: { score: -1, reason: '能源进口成本上升。' },
      emergingMarkets: { score: -1, reason: '油价上涨加大新兴市场输入性通胀压力。' },
    },
    assetEffects: {
      oil: { score: 2, reason: '供应收紧直接推升油价。' },
      gold: { score: 1, reason: '通胀担忧+避险情绪利好黄金。' },
      consumerStocks: { score: -1, reason: '能源成本压制消费。' },
    },
    roleEffects: {
      trader: '能源股短期可能受益，但需关注需求端是否配合。',
      officeWorker: '油价上涨可能传导到出行和物流成本。',
      businessOwner: '运输和原材料成本上升，关注套保策略。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: 'OPEC 减产通常对油价的影响是：',
        options: ['推升', '打压', '中性'],
        answer: '推升',
        explanation: '减产直接收紧供应，支撑油价。',
        dimensions: ['commodityCycleUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        'OPEC 减产',
        '原油供应收紧',
        '油价上涨',
        '通胀预期上升',
        '央行宽松空间收窄',
        '新兴市场输入性通胀压力增加',
      ],
      summary: 'OPEC 减产是供应端驱动，对油价影响通常立竿见影，但需观察需求端验证。',
      knowledgePoints: [
        'OPEC 减产对油价的影响取决于全球需求背景。',
        '油价上涨会间接增加通胀压力，影响央行决策。',
      ],
    },
  },

  // ====== 商品供给（2） ======
  {
    id: 'event_copper_supply_disrupt',
    title: '铜矿供应中断',
    category: 'commoditySupply',
    difficulty: 1,
    description: '全球主要铜矿因罢工或事故停产，铜价大幅上涨。',
    variableEffects: {
      commodityPrice: 1,
      inflation: 0,
    },
    regionEffects: {
      emergingMarkets: { score: 1, reason: '铜矿生产国短期收入增加。' },
      china: { score: -1, reason: '中国是铜消费大国，成本上升。' },
    },
    assetEffects: {
      copper: { score: 2, reason: '供应中断直接推升铜价。' },
      consumerStocks: { score: -1, reason: '原材料成本上升压制下游消费。' },
    },
    roleEffects: {
      trader: '铜价上涨利好铜矿股，关注电力投资链。',
      businessOwner: '电力设备、新能源相关企业成本上升。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '铜价上涨通常反映：',
        options: ['全球制造业需求强韧', '全球需求崩溃', '通胀回落', '美元大幅升值'],
        answer: '全球制造业需求强韧',
        explanation: '铜被称为"经济晴雨表"，需求强时铜价上涨。',
        dimensions: ['commodityCycleUnderstanding', 'macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '铜矿供应中断',
        '铜价上涨',
        '电力和制造业成本上升',
        '通胀压力边际上升',
        '铜矿企业盈利改善',
      ],
      summary: '铜价既反映供给也反映需求，供应中断带来的上涨通常更短期。',
      knowledgePoints: [
        '铜是观察全球制造业的重要指标。',
        '铜价上涨对新能源转型相关行业有显著成本影响。',
      ],
    },
  },
  {
    id: 'event_gold_central_bank',
    title: '黄金央行购金增加',
    category: 'commoditySupply',
    difficulty: 1,
    description: '多家央行连续多月增持黄金储备，去美元化叙事升温。',
    variableEffects: {
      usd: -1,
      creditStress: 0,
    },
    regionEffects: {
      emergingMarkets: { score: 0, reason: '影响中性。' },
    },
    assetEffects: {
      gold: { score: 2, reason: '需求增加直接推升金价。' },
    },
    roleEffects: {
      trader: '央行购金是黄金的长期支撑因素。',
      officeWorker: '影响有限。',
      fundManager: '可在组合中适度增加黄金配置。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '央行购金增加对黄金的影响是：',
        options: ['压制', '支撑', '无影响'],
        answer: '支撑',
        explanation: '央行是大额长期买家，购金增加直接利好金价。',
        dimensions: ['commodityCycleUnderstanding', 'dollarSystemUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '央行购金增加',
        '黄金需求结构性上升',
        '金价获得长期支撑',
        '去美元化叙事强化',
        '新兴市场央行外汇储备多元化',
      ],
      summary: '央行购金是黄金的长期需求基础，节奏比短期价格更重要。',
      knowledgePoints: [
        '央行购金与价格不完全同步——价格低时买更多。',
        '去美元化是中长期叙事，但短期对金价影响有限。',
      ],
    },
  },

  // ====== 科技周期（1） ======
  {
    id: 'event_ai_chip_demand',
    title: 'AI 芯片需求爆发',
    category: 'technologyCycle',
    difficulty: 1,
    description: 'AI 大模型训练需求推动高端芯片需求爆发，相关产业链订单激增。',
    variableEffects: {
      growth: 1,
      riskAppetite: 1,
    },
    regionEffects: {
      usa: { score: 1, reason: '美国主导 AI 芯片设计与生态。' },
      china: { score: 0, reason: '高端芯片受限，但应用层受益。' },
    },
    assetEffects: {
      usTechStocks: { score: 2, reason: 'AI 景气直接利好美股科技龙头。' },
      copper: { score: 1, reason: '数据中心建设拉动铜需求。' },
      consumerStocks: { score: 0, reason: '影响中性。' },
    },
    roleEffects: {
      trader: '关注 AI 产业链上游（芯片、服务器、电力）和下游应用。',
      businessOwner: 'AI 工具可提升效率，关注降本机会。',
      fundManager: 'AI 是结构性主题，但需关注估值与盈利兑现节奏。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: 'AI 芯片需求爆发最直接利好：',
        options: ['美股科技', '黄金', '长期消费股', '美债'],
        answer: '美股科技',
        explanation: 'AI 芯片需求是科技股的核心驱动。',
        dimensions: ['equityValuationUnderstanding', 'macroUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        'AI 芯片需求爆发',
        '科技企业盈利预期上修',
        '美股科技上涨',
        '数据中心建设加快',
        '电力和铜需求上升',
      ],
      summary: 'AI 是当前最重要的科技周期主题，需求扩张可能持续多年，但估值波动大。',
      knowledgePoints: [
        'AI 主题产业链长，从芯片到应用都有机会。',
        'AI 资本开支高峰也意味着电力和金属需求压力。',
      ],
    },
  },

  // ====== 金融风险（2） ======
  {
    id: 'event_us_bank_risk',
    title: '美国银行风险暴露',
    category: 'financialRisk',
    difficulty: 3,
    description: '美国某中型银行曝出资产质量风险，市场担心系统性金融风险上升。',
    variableEffects: {
      creditStress: 2,
      riskAppetite: -2,
      liquidity: -1,
    },
    regionEffects: {
      usa: { score: -2, reason: '金融风险直接打压市场情绪。' },
      europe: { score: -1, reason: '银行体系联动担忧。' },
    },
    assetEffects: {
      banks: { score: -2, reason: '银行股直接承压。' },
      gold: { score: 2, reason: '避险需求大幅上升。' },
      usBonds: { score: 1, reason: '避险+降息预期利好债券。' },
      usTechStocks: { score: -1, reason: '风险偏好下降。' },
      cash: { score: 1, reason: '现金防御价值凸显。' },
    },
    roleEffects: {
      trader: '降杠杆，避免持有高杠杆个股。',
      officeWorker: '警惕存款安全，分散存放。',
      businessOwner: '关注银行授信条件变化。',
      fundManager: '做好客户沟通，可能面临赎回压力。',
    },
    questions: [
      {
        id: 'q1',
        type: 'chainSort',
        prompt: '银行风险事件后的传导链（按因果顺序排列）：',
        options: [
          '黄金上涨',
          '避险情绪上升',
          '美联储可能提供流动性',
          '信用利差走阔',
        ],
        answer: ['避险情绪上升', '黄金上涨', '信用利差走阔', '美联储可能提供流动性'],
        explanation: '避险情绪是源头，黄金、信用利差、央行反应是依次反应。',
        dimensions: ['riskControlAwareness', 'macroUnderstanding'],
      },
      {
        id: 'q2',
        type: 'decision',
        prompt: '银行风险事件后，最合理的现金管理是：',
        options: [
          '把所有存款集中到问题银行',
          '分散到多家受保存款机构',
          '全部买入股票抄底',
          '不做调整',
        ],
        answer: '分散到多家受保存款机构',
        explanation: '分散存放降低单点风险。',
        dimensions: ['riskControlAwareness'],
      },
    ],
    explanation: {
      chain: [
        '银行风险暴露',
        '避险情绪上升',
        '黄金和债券上涨',
        '信用利差走阔',
        '央行可能提供流动性支持',
      ],
      summary: '金融风险事件是宏观最敏感的场景，资产价格反应迅速，关键是判断是孤立事件还是系统性风险。',
      knowledgePoints: [
        '银行风险传染性极强，需要及时观察央行反应。',
        '单家银行风险不一定演变成系统性危机，但市场会先price in最坏情形。',
      ],
    },
  },
  {
    id: 'event_cny_devalue',
    title: '人民币快速贬值',
    category: 'financialRisk',
    difficulty: 1,
    description: '人民币兑美元汇率快速贬值突破关键关口，市场关注资本流动风险。',
    variableEffects: {
      usd: 1,
      riskAppetite: -1,
      inflation: 1,
    },
    regionEffects: {
      china: { score: -1, reason: '汇率贬值带来资本外流压力。' },
      emergingMarkets: { score: -1, reason: '亚洲货币普遍承压。' },
    },
    assetEffects: {
      gold: { score: 1, reason: '本币贬值+避险利好黄金。' },
      consumerStocks: { score: -1, reason: '进口商品成本上升压制消费。' },
      hkInternetStocks: { score: -1, reason: '外资风险偏好下降。' },
      banks: { score: -1, reason: '外币负债企业违约风险上升。' },
    },
    roleEffects: {
      trader: '关注央行的外汇干预和资本管制动作。',
      officeWorker: '进口商品和留学成本上升。',
      businessOwner: '外币负债企业压力增加，出口企业短期受益。',
      civilServant: '外储管理压力上升，政策工具需谨慎。',
    },
    questions: [
      {
        id: 'q1',
        type: 'direction',
        prompt: '人民币快速贬值对下列哪类企业短期有利？',
        options: ['进口企业', '出口企业', '地产开发商', '航空公司'],
        answer: '出口企业',
        explanation: '本币贬值提升出口产品价格竞争力。',
        dimensions: ['macroUnderstanding', 'dollarSystemUnderstanding'],
      },
    ],
    explanation: {
      chain: [
        '人民币快速贬值',
        '资本外流担忧',
        '央行外汇干预',
        '进口成本上升',
        '出口企业短期受益',
        '输入性通胀压力',
      ],
      summary: '汇率快速贬值通常是宏观压力的释放过程，央行会权衡是否干预。',
      knowledgePoints: [
        '适度贬值利好出口，但快速贬值会引发资本外流。',
        '汇率与利率往往联动，贬值压力可能限制降息空间。',
      ],
    },
  },
]

export function getEventById(id: string): MacroEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}