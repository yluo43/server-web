import http from '@/utils/httpRequest'

/**
 * 获取用户注册统计数据
 * @param {Object} data - 查询参数
 * @param {number} data.year - 年份
 * @param {number} data.month - 月份
 */
export function getRegistrationStats(data) {
  return http({
    url: http.adornUrl('/user/registration-stats', true), // true 表示使用系统切换
    method: 'post',
    data: data
  })
}

/**
 * 导出用户注册统计数据为Excel
 * @param {Object} data - 查询参数
 * @param {number} data.year - 年份
 * @param {number} data.month - 月份
 */
export function exportRegistrationStats(data) {
  return http({
    url: http.adornUrl('/user/registration-stats/export', true), // true 表示使用系统切换
    method: 'post',
    data: data,
    responseType: 'arraybuffer'
  })
}

/**
 * 获取客户端用户列表
 * @param {Object} params - 查询参数
 * @param {string} [params.phone] - 手机号（模糊查询）
 * @param {string} [params.mail] - 邮箱（模糊查询）
 * @param {number} [params.status] - 状态：0-正常，1-禁用
 * @param {boolean} [params.isForever] - 是否永久会员
 * @param {number} [params.year] - 注册年份
 * @param {number} [params.month] - 注册月份
 * @param {string} [params.registerDate] - 注册日期（yyyy-MM-dd）
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 */
export function getClientUserList(params) {
  return http({
    url: http.adornUrl('/user/client-list', true), // true 表示使用系统切换
    method: 'get',
    params: params
  })
}

/**
 * 导出客户端用户列表为Excel
 * @param {Object} params - 查询参数（与 getClientUserList 一致）
 */
export function exportClientUserList(params) {
  return http({
    url: http.adornUrl('/user/client-list/export', true),
    method: 'get',
    params: params,
    responseType: 'arraybuffer'
  })
}
