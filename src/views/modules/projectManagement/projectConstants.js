/**
 * 合同信息枚举
 * 0自研-单价、1自研-总价、2外协-单价
 */
export const contractType = [
  { id: 0, name: '自研-单价' },
  { id: 1, name: '自研-总价' },
  { id: 2, name: '外协-单价' }
]

/**
 * 结算周期枚举
 */
export const settlementCycle = [
  { id: 1, name: '1个月' },
  { id: 2, name: '2个月' },
  { id: 3, name: '3个月' },
  { id: 4, name: '4个月' },
  { id: 5, name: '5个月' },
  { id: 6, name: '6个月' },
  { id: 7, name: '7个月' },
  { id: 8, name: '8个月' },
  { id: 9, name: '9个月' },
  { id: 10, name: '10个月' },
  { id: 11, name: '11个月' },
  { id: 12, name: '12个月' }
]

/**
 * 项目类型枚举
 */
export const projectType = [
  { id: 0, name: '合同立项' },
  { id: 1, name: '研发立研' }
]
