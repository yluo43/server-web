import http from '@/utils/httpRequest'

/**
 * 获取兑换码列表（分页）
 * @param {Object} params - 查询参数
 * @param {string} [params.code] - 兑换码（模糊查询）
 * @param {number} [params.templateNo] - 模板编号
 * @param {string} [params.channel] - 渠道
 * @param {string} [params.campaign] - 活动标记
 * @param {number} [params.status] - 状态：0-禁用，1-启用
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 */
export function getRedemptionCodeList(params) {
  return http({
    url: http.adornUrl('/redemption-code/list', true),
    method: 'get',
    params: params
  })
}

/**
 * 创建兑换码
 * @param {Object} data - 兑换码数据
 * @param {number} data.templateNo - 模板编号
 * @param {number} data.type - 类型：1-一次性，2-自定义，3-永久
 * @param {string} [data.code] - 兑换码（留空自动生成）
 * @param {number} [data.customConsumeCount] - 自定义消费次数（type=2时必填）
 * @param {string} [data.channel] - 渠道
 * @param {string} [data.campaign] - 活动标记
 * @param {string} [data.expireTime] - 过期时间（yyyy-MM-dd格式，留空表示永久有效）
 * @param {string} [data.remark] - 备注
 */
export function createRedemptionCode(data) {
  return http({
    url: http.adornUrl('/redemption-code/create', true),
    method: 'post',
    data: data
  })
}

/**
 * 更新兑换码状态
 * @param {Object} data - 更新数据
 * @param {number} data.id - 兑换码ID
 * @param {number} data.status - 状态：0-禁用，1-启用
 */
export function updateRedemptionCodeStatus(data) {
  return http({
    url: http.adornUrl('/redemption-code/update-status', true),
    method: 'put',
    data: data
  })
}

/**
 * 删除兑换码
 * @param {number} id - 兑换码ID
 */
export function deleteRedemptionCode(id) {
  return http({
    url: http.adornUrl(`/redemption-code/delete/${id}`, true),
    method: 'delete'
  })
}

/**
 * 获取模板列表
 */
export function getTemplateList() {
  return http({
    url: http.adornUrl('/redemption-code/template-list', true),
    method: 'get'
  })
}

/**
 * 生成唯一兑换码
 */
export function generateUniqueCode() {
  return http({
    url: http.adornUrl('/redemption-code/generate', true),
    method: 'get'
  })
}

/**
 * 获取兑换记录列表（分页）
 * @param {Object} params - 查询参数
 * @param {string} [params.redemptionCode] - 兑换码（模糊查询）
 * @param {string} [params.userId] - 用户ID（模糊查询）
 * @param {number} [params.templateNo] - 模板编号
 * @param {string} [params.channel] - 渠道
 * @param {string} [params.campaign] - 活动标记
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 */
export function getRedemptionRecordList(params) {
  return http({
    url: http.adornUrl('/redemption-code/record-list', true),
    method: 'get',
    params: params
  })
}

/**
 * 使用兑换码兑换模板
 * @param {Object} data - 兑换数据
 * @param {string} data.code - 兑换码
 */
export function exchangeByCode(data) {
  return http({
    url: '/template/exchange-by-code',
    method: 'post',
    data: data
  })
}
