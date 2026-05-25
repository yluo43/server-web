import http from '@/utils/httpRequest'

/**
 * 获取任务定义列表（分页）
 * @param {Object} params - 查询参数
 * @param {number} [params.taskId] - 任务ID
 * @param {string} [params.taskCode] - 任务编码
 * @param {string} [params.taskName] - 任务名称
 * @param {string} [params.taskCategory] - 任务类别
 * @param {string} [params.resetType] - 重置类型
 * @param {number} [params.isEnabled] - 是否启用：0-禁用，1-启用
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 */
export function getTaskDefinitionList(params) {
  return http({
    url: http.adornUrl('/task-definition/list', true),
    method: 'get',
    params: params
  })
}

/**
 * 创建任务定义
 * @param {Object} data - 任务定义数据
 * @param {number} data.taskId - 任务ID
 * @param {string} data.taskCode - 任务编码
 * @param {string} data.taskName - 任务名称
 * @param {string} data.taskDesc - 任务描述
 * @param {string} data.taskCategory - 任务类别：daily/weekly/monthly/longterm/activity
 * @param {string} data.resetType - 重置类型：daily/weekly/monthly/none
 * @param {string} [data.resetTimezone] - 重置时区，默认 Asia/Shanghai
 * @param {number} data.targetProgress - 目标进度
 * @param {string} data.rewardType - 奖励类型：hammer/egg/piece
 * @param {number} data.rewardCount - 奖励数量
 * @param {number} [data.isEnabled] - 是否启用：0-禁用，1-启用，默认1
 * @param {number} [data.sort] - 排序，默认0
 */
export function createTaskDefinition(data) {
  return http({
    url: http.adornUrl('/task-definition/create', true),
    method: 'post',
    data: data
  })
}

/**
 * 更新任务定义
 * @param {Object} data - 任务定义数据
 * @param {number} data.id - 任务定义ID
 * @param {number} data.taskId - 任务ID
 * @param {string} data.taskCode - 任务编码
 * @param {string} data.taskName - 任务名称
 * @param {string} data.taskDesc - 任务描述
 * @param {string} data.taskCategory - 任务类别
 * @param {string} data.resetType - 重置类型
 * @param {string} [data.resetTimezone] - 重置时区
 * @param {number} data.targetProgress - 目标进度
 * @param {string} data.rewardType - 奖励类型
 * @param {number} data.rewardCount - 奖励数量
 * @param {number} [data.isEnabled] - 是否启用
 * @param {number} [data.sort] - 排序
 */
export function updateTaskDefinition(data) {
  return http({
    url: http.adornUrl('/task-definition/update', true),
    method: 'put',
    data: data
  })
}

/**
 * 更新任务定义状态
 * @param {Object} data - 更新数据
 * @param {number} data.id - 任务定义ID
 * @param {number} data.isEnabled - 是否启用：0-禁用，1-启用
 */
export function updateTaskDefinitionStatus(data) {
  return http({
    url: http.adornUrl('/task-definition/update-status', true),
    method: 'put',
    data: data
  })
}

/**
 * 删除任务定义
 * @param {number} id - 任务定义ID
 */
export function deleteTaskDefinition(id) {
  return http({
    url: http.adornUrl(`/task-definition/delete/${id}`, true),
    method: 'delete'
  })
}

/**
 * 获取用户任务进度列表（分页）
 * @param {Object} params - 查询参数
 * @param {string} [params.userId] - 用户ID
 * @param {number} [params.taskId] - 任务ID
 * @param {string} [params.periodKey] - 周期键
 * @param {number} [params.taskStatus] - 任务状态：0-进行中，1-可领取，2-已领取，3-已过期，4-未解锁
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 */
export function getUserTaskProgressList(params) {
  return http({
    url: http.adornUrl('/task-progress/list', true),
    method: 'get',
    params: params
  })
}

/**
 * 获取任务领取记录列表（分页）
 * @param {Object} params - 查询参数
 * @param {string} [params.userId] - 用户ID
 * @param {number} [params.taskId] - 任务ID
 * @param {string} [params.periodKey] - 周期键
 * @param {string} [params.rewardType] - 奖励类型
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 */
export function getTaskClaimRecordList(params) {
  return http({
    url: http.adornUrl('/task-claim/list', true),
    method: 'get',
    params: params
  })
}
