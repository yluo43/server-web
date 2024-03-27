import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/userLogin/login/' + data.username,
    method: 'get',
    xhrFields: {
      withCredentials: true
    }
  })
}

export function logout() {
  return request({
    url: '/userLogin/logout',
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
  return request({
    url: '/user/updatePwd',
    method: 'put',
    params: data
  })
}
