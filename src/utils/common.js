//职级颜色
const deptColorsMap = new Map([
  ['经营管理层', { color: '#DAF7BE' }],
  ['销售部', { color: '#95DE64' }],
  ['售前支持部', { color: '#BAE7FF' }],
  ['运营拓展部', { color: '#91D5FF' }],
  ['工程建设部', { color: '#E6F7FF' }],
  ['技术服务部', { color: '#69C0FF' }],
  ['系统支撑部', { color: '#5BAAFF' }],
  ['产品委员会', { color: '#5790FF' }],
  ['电信平台系统部', { color: '#476EDA' }],
  ['电信业务拓展部', { color: '#98CEF4' }],
  ['大数据平台部', { color: '#A098F4' }],
  ['产品拓展部', { color: '#F9F0FF' }],
  ['安全产品部', { color: '#EFDBFF' }],
  ['媒体产品部', { color: '#D3ADF7' }],
  ['物联网产品部', { color: '#B380EB' }],
  ['战略研究部', { color: '#9254DE' }],
  ['测试部', { color: '#C0C5F8' }],
  ['质量部', { color: '#D1FBF5' }],
  ['财务部', { color: '#0CC5F1' }],
  ['商务部', { color: '#A0F8EB' }],
  ['综合管理部', { color: '#9099F4' }],
  ['default', { color: '#2A97FF' }]
])

//成本统计颜色
const costColorsMap = new Map([
  ['成本合计', { color: '#58CFFF' }],
  ['预计结算', { color: '#2A6EFF' }],
  ['实际回款', { color: '#13AD72' }],
  ['累计成本', { color: '#7EC900' }],
  ['累计预计结算', { color: '#F1D219' }],
  ['累计回款', { color: '#FD7F56' }],
  ['累计预计收益', { color: '#9A60B3' }],
  ['实际累计收益', { color: '#F05050' }],
  ['default', { color: '#2A97FF' }]
])
//表格成本统计颜色
const tableCostColorsMap = new Map([
  ['成本合计', { color: '#2A6EFF' }],
  ['预计结算', { color: '#2A6EFF' }],
  ['实际回款', { color: '#2A6EFF' }],
  ['利润率', { color: '#2A6EFF' }],
  ['累计成本', { color: '#F1D219' }],
  ['累计预计结算', { color: '#F1D219' }],
  ['累计回款', { color: '#F1D219' }],
  ['累计预计收益', { color: '#FD7F56' }],
  ['实际累计收益', { color: '#FD7F56' }],
  ['default', { color: '' }]
])

//表格分摊管理颜色
const shareTableColorsMap = new Map([
  ['轮空', { color: '#FD7F56' }],
  ['default', { color: '' }]
])

//获取部门颜色
export function getDeptColor(DeptName) {
  var colors = []
  if (deptColorsMap.get(DeptName) != undefined) {
    colors.push(deptColorsMap.get(DeptName).color)
  } else {
    colors.push(deptColorsMap.get('default').color)
  }

  return colors
}

// 获取所有部门颜色
export function getAllDeptColor() {
  return deptColorsMap
}

//获取成本颜色
export function getCostColor(costName) {
  var colors = []
  if (costColorsMap.get(costName) != undefined) {
    colors.push(costColorsMap.get(costName).color)
  } else {
    colors.push(costColorsMap.get('default').color)
  }

  return colors
}

//获取表格成本颜色
export function getTableCostColor(costName) {
  var colors = []
  if (tableCostColorsMap.get(costName) != undefined) {
    colors.push(tableCostColorsMap.get(costName).color)
  } else {
    colors.push(tableCostColorsMap.get('default').color)
  }

  return colors
}

export function getShareTableColor(costName) {
  var colors = []
  if (shareTableColorsMap.get(costName) != undefined) {
    colors.push(shareTableColorsMap.get(costName).color)
  } else {
    colors.push(shareTableColorsMap.get('default').color)
  }

  return colors
}
