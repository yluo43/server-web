import http from '@/utils/httpRequest'

/**
 * 获取管理员用户列表
 * @param {Object} params - 查询参数
 * @param {string} [params.username] - 用户名（模糊查询）
 * @param {string} [params.realName] - 真实姓名（模糊查询）
 * @param {number} [params.status] - 状态：0-正常，1-禁用
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 */
export function getAdminList(params) {
  return http({
    url: http.adornUrl('/user/list'),
    method: 'get',
    params: params
  })
}

/**
 * 创建管理员用户
 * @param {Object} data - 管理员数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.realName - 真实姓名
 * @param {string} [data.phone] - 手机号
 * @param {string} [data.mail] - 邮箱
 * @param {number} [data.status] - 状态：0-正常，1-禁用（默认0）
 */
export function createAdmin(data) {
  return http({
    url: http.adornUrl('/user/create'),
    method: 'post',
    data: data
  })
}

/**
 * 更新管理员用户
 * @param {Object} data - 管理员数据
 * @param {string} data.userId - 用户ID
 * @param {string} [data.username] - 用户名
 * @param {string} [data.realName] - 真实姓名
 * @param {string} [data.phone] - 手机号
 * @param {string} [data.mail] - 邮箱
 * @param {number} [data.status] - 状态：0-正常，1-禁用
 */
export function updateAdmin(data) {
  return http({
    url: http.adornUrl('/user/update'),
    method: 'put',
    data: data
  })
}

/**
 * 删除管理员用户
 * @param {string} userId - 用户ID
 */
export function deleteAdmin(userId) {
  return http({
    url: http.adornUrl('/user/delete'),
    method: 'delete',
    params: { userId }
  })
}

/**
 * 获取管理员用户详情
 * @param {string} userId - 用户ID
 */
export function getAdminInfo(userId) {
  return http({
    url: http.adornUrl('/user/info'),
    method: 'get',
    params: { userId }
  })
}

/**
 * 修改管理员密码
 * @param {Object} data - 密码数据
 * @param {string} data.userId - 用户ID
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 */
export function changePassword(data) {
  return http({
    url: http.adornUrl('/user/change-password'),
    method: 'post',
    data: data
  })
}
