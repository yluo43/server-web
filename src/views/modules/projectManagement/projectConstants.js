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
  { id: 1, name: '研发立项' },
  { id: 2, name: '运营管理' }
]

/**
 * 人员状态枚举
 */
export const personnelState = [
  { id: 1, name: '支撑中' },
  { id: 2, name: '待开始' },
  { id: 3, name: '已结束' }
]

/**
 * 技术级别枚举
 */
export const empLevel = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
  { id: 5, name: '5' },
  { id: 6, name: '6-' },
  { id: 7, name: '6' },
  { id: 8, name: '6+' }
]
/**
 * 岗位类型枚举
 * 1 A岗、2 B岗、3 外包、4 学生、5 实习、6 兼职
 */
export const positionType = [
  { id: 1, name: 'A岗' },
  { id: 2, name: 'B岗' },
  { id: 7, name: 'C岗' },
  { id: 3, name: '外包' },
  { id: 4, name: '学生' },
  { id: 5, name: '实习' },
  { id: 6, name: '兼职' }
]

/**
 * 项目状态枚举
 * 0 交付中  1 已交付  3 已回款  2 关闭
 * @type {[{name, id: number}]}
 */
export const stateName = [
  { id: 0, name: '交付中' },
  { id: 1, name: '已交付' },
  { id: 3, name: '已回款' },
  { id: 2, name: '关闭' }
]

/**
 * 项目标签枚举
 * 0 外包  1 协外  2 大数据 3 AI 4 应用系统
 * @type {[{name, id: number}]}
 */
export const itemLabel = [
  { id: 0, name: '外包' },
  { id: 1, name: '协外' },
  { id: 2, name: '大数据' },
  { id: 3, name: 'AI' },
  { id: 4, name: '应用系统' }
]
