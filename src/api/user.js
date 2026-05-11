import http from '@/utils/httpRequest'

/**
 * 管理员登录
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} [data.smsCode] - 验证码（可选）
 * @param {number} [data.type] - 登录类型（可选，默认0）
 * @param {string} [data.inviteCode] - 邀请码（可选）
 */
export function login(data) {
  return http({
    url: http.adornUrl('/login'),
    method: 'post',
    data: data
  })
}

export function logout() {
  return http({
    url: http.adornUrl('/login/logout'),
    method: 'get'
  })
}

// 用户密码重置
export function updateUserPwd(userID, oldPassword, newPassword) {
  const data = {
    userID,
    oldPassword,
    newPassword
  }
  return http({
    url: http.adornUrl('/user/updatePwd'),
    method: 'put',
    params: data
  })
}
